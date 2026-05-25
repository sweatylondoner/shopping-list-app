import ShoppingList from '@/components/ShoppingList';
import { supabase } from '@/lib/supabase';
import type { Store, ItemWithStatus } from '@/lib/types';

async function getStore(storeId: string): Promise<Store> {
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .single();

  if (error || !store) {
    throw new Error('Store not found');
  }

  return { ...store, uncheckedCount: 0 };
}

async function getItems(storeId: string): Promise<ItemWithStatus[]> {
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('store_id', storeId)
    .order('name');

  if (itemsError) throw itemsError;

  if (!items || items.length === 0) {
    return [];
  }

  const itemIds = items.map(item => item.id);

  const { data: actions, error: actionsError } = await supabase
    .from('item_actions')
    .select('*')
    .in('item_id', itemIds)
    .order('timestamp', { ascending: false });

  if (actionsError) throw actionsError;

  const latestActionMap = new Map<string, { action: string; timestamp: string }>();
  (actions || []).forEach(action => {
    if (!latestActionMap.has(action.item_id)) {
      latestActionMap.set(action.item_id, {
        action: action.action,
        timestamp: action.timestamp,
      });
    }
  });

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

  return itemsWithStatus;
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const [store, items] = await Promise.all([
    getStore(storeId),
    getItems(storeId),
  ]);

  return <ShoppingList store={store} initialItems={items} />;
}
