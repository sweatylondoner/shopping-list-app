import { supabase } from '@/lib/supabase';
import type { InventoryItem } from '@/lib/types';
import InventoryList from '@/components/InventoryList';

export const dynamic = 'force-dynamic';

async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('expiry_date', { ascending: true, nullsLast: true });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data || [];
}

export default async function InventoryPage() {
  const inventory = await getInventory();

  return <InventoryList initialInventory={inventory} />;
}
