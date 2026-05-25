'use client';

import { useRouter } from 'next/navigation';
import type { Store } from '@/lib/types';

interface StoreSelectorProps {
  stores: Store[];
}

export default function StoreSelector({ stores }: StoreSelectorProps) {
  const router = useRouter();

  const handleStoreClick = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Shopping Lists
      </h1>

      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => handleStoreClick(store.id)}
          className="w-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow min-h-touch-target flex flex-col items-center justify-center space-y-2"
        >
          <span className="text-2xl font-semibold text-gray-800">
            {store.name}
          </span>
          {store.uncheckedCount !== undefined && (
            <span className="text-lg text-gray-600">
              ({store.uncheckedCount})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
