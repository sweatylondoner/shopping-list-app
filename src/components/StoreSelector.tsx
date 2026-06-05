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
    // Home page view - GKR2 style
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 pt-6 pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <span className="w-full h-full flex items-center justify-center text-xl">👤</span>
              </div>
              <span className="text-xl font-bold text-brown-800">Ghar Ki Rasoi</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="10" cy="10" r="3" />
                <path d="M10 1v2M10 17v2M18.66 5.34l-1.41 1.41M3.34 14.66l1.41 1.41M19 10h-2M3 10H1M18.66 14.66l-1.41-1.41M3.34 5.34l1.41 1.41" />
              </svg>
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-700 mb-1">Grocery Lists</h1>
              <p className="text-sm text-gray-600">Quick toggle between your regular stores</p>
            </div>
            <button className="px-4 py-2 rounded-full border border-primary-300 text-primary-700 text-sm font-medium hover:bg-primary-50">
              Clear Completed
            </button>
          </div>

          {/* Store Tabs */}
          <div className="flex gap-2 mt-4">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  store.id === selectedStore
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* This will be replaced by the actual grocery list content */}
        <div className="p-4">
          <p className="text-center text-gray-500 py-8">Select a store to view items</p>
        </div>
      </div>
    );
  }

  // In-store view header with tabs
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => handleStoreClick(store.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              store.id === selectedStore
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {store.name}
          </button>
        ))}
      </div>
    </div>
  );
}
