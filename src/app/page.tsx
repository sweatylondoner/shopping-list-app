import StoreSelector from '@/components/StoreSelector';
import type { Store } from '@/lib/types';

async function getStores(): Promise<Store[]> {
  // Use environment variable or localhost for dev
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch stores');
  }

  return res.json();
}

export default async function Home() {
  const stores = await getStores();

  return (
    <div className="py-8">
      <StoreSelector stores={stores} />
    </div>
  );
}
