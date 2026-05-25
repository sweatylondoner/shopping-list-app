import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Suggestion } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    // Get all items for this store
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('store_id', storeId);

    if (itemsError) throw itemsError;

    if (!items || items.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const itemIds = items.map(item => item.id);

    // Get all check actions
    const { data: actions, error: actionsError } = await supabase
      .from('item_actions')
      .select('*')
      .in('item_id', itemIds)
      .eq('action', 'checked')
      .order('timestamp', { ascending: false });

    if (actionsError) throw actionsError;

    // Count checks per item
    const checkCounts = new Map<string, number>();
    (actions || []).forEach(action => {
      checkCounts.set(action.item_id, (checkCounts.get(action.item_id) || 0) + 1);
    });

    // Get latest action per item to determine current checked state
    const { data: latestActions, error: latestError } = await supabase
      .from('item_actions')
      .select('*')
      .in('item_id', itemIds)
      .order('timestamp', { ascending: false });

    if (latestError) throw latestError;

    const latestActionMap = new Map<string, string>();
    (latestActions || []).forEach(action => {
      if (!latestActionMap.has(action.item_id)) {
        latestActionMap.set(action.item_id, action.action);
      }
    });

    // Build suggestions
    const suggestions: Suggestion[] = items
      .filter(item => {
        const checkCount = checkCounts.get(item.id) || 0;
        const latestAction = latestActionMap.get(item.id);
        const isCurrentlyChecked = latestAction === 'checked';

        // Include if: (favorite OR 3+ checks) AND not currently checked
        return (item.is_favorite || checkCount >= 3) && !isCurrentlyChecked;
      })
      .map(item => ({
        id: item.id,
        name: item.name,
        isFavorite: item.is_favorite,
        checkCount: checkCounts.get(item.id) || 0,
      }))
      .sort((a, b) => {
        // Sort: favorites first, then by check count descending
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return b.checkCount - a.checkCount;
      });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
