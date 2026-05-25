import StoreSelector from '@/components/StoreSelector';
import { supabase } from '@/lib/supabase';
import type { Store } from '@/lib/types';

async function getStores(): Promise<Store[]> {
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (storesError) throw storesError;

  // Get unchecked counts for each store
  const storesWithCounts = await Promise.all(
    (stores || []).map(async (store) => {
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('id')
        .eq('store_id', store.id);

      if (itemsError) throw itemsError;

      const itemIds = (items || []).map(item => item.id);

      if (itemIds.length === 0) {
        return { ...store, uncheckedCount: 0 };
      }

      const { data: actions, error: actionsError } = await supabase
        .from('item_actions')
        .select('*')
        .in('item_id', itemIds)
        .order('timestamp', { ascending: false });

      if (actionsError) throw actionsError;

      const latestActionMap = new Map<string, string>();
      (actions || []).forEach(action => {
        if (!latestActionMap.has(action.item_id)) {
          latestActionMap.set(action.item_id, action.action);
        }
      });

      const uncheckedCount = itemIds.filter(
        id => latestActionMap.get(id) !== 'checked'
      ).length;

      return { ...store, uncheckedCount };
    })
  );

  return storesWithCounts;
}

export default async function Home() {
  const stores = await getStores();

  return (
    <div className="py-8">
      <StoreSelector stores={stores} />
    </div>
  );
}
