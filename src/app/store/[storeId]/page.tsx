import ShoppingList from '@/components/ShoppingList';
import type { Store, ItemWithStatus } from '@/lib/types';

async function getStore(storeId: string): Promise<Store> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch stores');
  }

  const stores: Store[] = await res.json();
  const store = stores.find(s => s.id === storeId);

  if (!store) {
    throw new Error('Store not found');
  }

  return store;
}

async function getItems(storeId: string): Promise<ItemWithStatus[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores/${storeId}/items`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch items');
  }

  const data = await res.json();
  return data.items;
}

export default async function StorePage({
  params,
}: {
  params: { storeId: string };
}) {
  const [store, items] = await Promise.all([
    getStore(params.storeId),
    getItems(params.storeId),
  ]);

  return <ShoppingList store={store} initialItems={items} />;
}
