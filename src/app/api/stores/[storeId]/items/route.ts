import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ItemWithStatus } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'all'; // 'all' or 'shopping'

    // Fetch all items for this store
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .eq('store_id', params.storeId)
      .order('name');

    if (itemsError) throw itemsError;

    if (!items || items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Get item IDs
    const itemIds = items.map(item => item.id);

    // Fetch latest actions for all items
    const { data: actions, error: actionsError } = await supabase
      .from('item_actions')
      .select('*')
      .in('item_id', itemIds)
      .order('timestamp', { ascending: false });

    if (actionsError) throw actionsError;

    // Build map of item_id -> latest action
    const latestActionMap = new Map<string, { action: string; timestamp: string }>();
    (actions || []).forEach(action => {
      if (!latestActionMap.has(action.item_id)) {
        latestActionMap.set(action.item_id, {
          action: action.action,
          timestamp: action.timestamp,
        });
      }
    });

    // Transform items with checked status
    const itemsWithStatus: ItemWithStatus[] = items.map(item => {
      const latestAction = latestActionMap.get(item.id);
      const isChecked = latestAction?.action === 'checked';
      const lastChecked = isChecked ? latestAction.timestamp : null;

      return {
        ...item,
        isChecked,
        lastChecked,
      };
    });

    // Filter based on mode
    const filteredItems = mode === 'shopping'
      ? itemsWithStatus.filter(item => !item.isChecked)
      : itemsWithStatus;

    return NextResponse.json({ items: filteredItems });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
