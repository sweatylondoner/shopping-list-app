'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Store } from '@/lib/types';

interface StoreSelectorProps {
  stores: Store[];
  currentStoreId?: string;
}

export default function StoreSelector({ stores, currentStoreId }: StoreSelectorProps) {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState(currentStoreId || stores[0]?.id);

  const handleStoreClick = (storeId: string) => {
    setSelectedStore(storeId);
    router.push(`/store/${storeId}`);
  };

  if (!currentStoreId) {
    // Home page view - show all stores
    return (
      <div className="max-w-md mx-auto min-h-screen bg-cream-50">
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl">
              👤
            </div>
            <h1 className="text-2xl font-bold text-brown-800">My Shopping Lists</h1>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-brown-800 mb-4">Grocery Lists</h2>
          <p className="text-sm text-gray-600 mb-4">Quick toggle between your regular stores</p>

          <div className="grid grid-cols-3 gap-3">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow min-h-touch-target flex flex-col items-center justify-center gap-2"
              >
                <span className="text-2xl">🏪</span>
                <span className="text-sm font-medium text-gray-800 text-center">
                  {store.name}
                </span>
                {store.uncheckedCount !== undefined && store.uncheckedCount > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
                    {store.uncheckedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // In-app store switcher (tabs)
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-200 scrollbar-hide">
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => handleStoreClick(store.id)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            store.id === selectedStore
              ? 'bg-primary-500 text-white'
              : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
          }`}
        >
          {store.name}
          {store.uncheckedCount !== undefined && store.uncheckedCount > 0 && (
            <span className="ml-2">({store.uncheckedCount})</span>
          )}
        </button>
      ))}
    </div>
  );
}
