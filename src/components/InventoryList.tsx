'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { InventoryItem } from '@/lib/types';

interface InventoryListProps {
  initialInventory: InventoryItem[];
}

const LOCATION_FILTERS = [
  { id: 'all', label: 'All Items', icon: '📦' },
  { id: 'fridge', label: 'Fridge', icon: '🧊' },
  { id: 'freezer', label: 'Freezer', icon: '❄️' },
  { id: 'pantry', label: 'Pantry', icon: '🥫' },
];

export default function InventoryList({ initialInventory }: InventoryListProps) {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [locationFilter, setLocationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = useMemo(() => {
    let result = inventory;

    // Filter by location
    if (locationFilter !== 'all') {
      result = result.filter(item => item.location === locationFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.item_name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [inventory, locationFilter, searchQuery]);

  const getStatusBadge = (item: InventoryItem) => {
    if (item.status === 'expired') {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Expired
        </span>
      );
    }
    if (item.status === 'low') {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
          Running Low
        </span>
      );
    }

    // Check if expiring soon (within 3 days)
    if (item.expiry_date) {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            Use by {new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        );
      }
    }

    return null;
  };

  const groupByLocation = (items: InventoryItem[]) => {
    return items.reduce((acc, item) => {
      const location = item.location || 'other';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
  };

  const groupedInventory = groupByLocation(filteredInventory);

  return (
    <div className="max-w-md mx-auto bg-cream-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl">
            👤
          </div>
          <h1 className="text-2xl font-bold text-brown-800">Search your fridge</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full px-4 py-3 pl-10 bg-cream-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Location Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {LOCATION_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setLocationFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                locationFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items */}
      <div className="pb-24">
        {Object.keys(groupedInventory).length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600">
              {searchQuery ? 'No items match your search' : 'Your inventory is empty'}
            </p>
          </div>
        ) : (
          Object.entries(groupedInventory).map(([location, items]) => (
            <div key={location} className="mb-4">
              {/* Location Header */}
              <div className="px-4 py-2 bg-cream-100">
                <h2 className="font-semibold text-brown-800 uppercase text-sm tracking-wide">
                  {location === 'fridge' && '🧊 Fridge'}
                  {location === 'freezer' && '❄️ Freezer'}
                  {location === 'pantry' && '🥫 Pantry'}
                  {location === 'other' && '📦 Other'}
                </h2>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 bg-white border-b border-gray-100"
                >
                  {/* Item Image */}
                  <div className="w-14 h-14 rounded-lg bg-cream-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      '📦'
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.item_name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                    <div className="mt-1">{getStatusBadge(item)}</div>
                  </div>

                  {/* Quantity Badge */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {item.quantity}
                    </div>
                    {item.unit && (
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Add Item Button */}
      <div className="fixed bottom-20 right-6 z-10">
        <button
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg text-3xl flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
