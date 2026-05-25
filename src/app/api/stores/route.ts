import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Store } from '@/lib/types';

export async function GET() {
  try {
    // Fetch all stores
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .order('name');

    if (storesError) throw storesError;

    // For each store, count unchecked items
    const storesWithCounts = await Promise.all(
      (stores || []).map(async (store) => {
        // Get all items for this store
        const { data: items, error: itemsError } = await supabase
          .from('items')
          .select('id')
          .eq('store_id', store.id);

        if (itemsError) throw itemsError;

        // For each item, get the latest action
        const itemIds = (items || []).map(item => item.id);

        if (itemIds.length === 0) {
          return { ...store, uncheckedCount: 0 };
        }

        // Get latest action for each item
        const { data: latestActions, error: actionsError } = await supabase
          .from('item_actions')
          .select('item_id, action')
          .in('item_id', itemIds)
          .order('timestamp', { ascending: false });

        if (actionsError) throw actionsError;

        // Group by item_id and get the first (latest) action
        const latestByItem = new Map<string, string>();
        (latestActions || []).forEach(action => {
          if (!latestByItem.has(action.item_id)) {
            latestByItem.set(action.item_id, action.action);
          }
        });

        // Count items that are either unchecked or have no actions
        const uncheckedCount = itemIds.filter(id => {
          const latestAction = latestByItem.get(id);
          return !latestAction || latestAction === 'unchecked';
        }).length;

        return {
          ...store,
          uncheckedCount,
        };
      })
    );

    return NextResponse.json(storesWithCounts);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
