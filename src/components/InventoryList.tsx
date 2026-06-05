'use client';

import { useState, useMemo } from 'react';
import type { InventoryItem } from '@/lib/types';

interface InventoryListProps {
  initialInventory: InventoryItem[];
}

const LOCATION_FILTERS = [
  { id: 'all', label: 'All Items' },
  { id: 'low', label: 'Low Stock', icon: '△' },
  { id: 'fridge', label: 'Fridge', icon: '🧊' },
];

export default function InventoryList({ initialInventory }: InventoryListProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [locationFilter, setLocationFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = useMemo(() => {
    let result = inventory;

    if (locationFilter === 'low') {
      result = result.filter(item => item.status === 'low' || item.status === 'expired');
    } else if (locationFilter !== 'all') {
      result = result.filter(item => item.location === locationFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.item_name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [inventory, locationFilter, searchQuery]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <span className="text-lg font-semibold text-brown-800">Ghar Ki Rasoi</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10" cy="10" r="3" />
              <path d="M10 1v2M10 17v2M18.66 5.34l-1.41 1.41M3.34 14.66l1.41 1.41M19 10h-2M3 10H1M18.66 14.66l-1.41-1.41M3.34 5.34l1.41 1.41" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your fridge"
              className="w-full px-4 py-2.5 pl-10 bg-gray-50 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LOCATION_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setLocationFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                locationFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {filter.icon && <span>{filter.icon}</span>}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items */}
      <div className="px-4 pb-24">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No items found' : 'Your fridge is empty'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                {/* Item Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base">{item.item_name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.notes || `${item.quantity} ${item.unit || 'items'} left`}
                  </p>
                  {item.expiry_date && (
                    <p className="text-xs text-gray-500">
                      Use by {new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  {item.status === 'low' && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600">
                      Running Low
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold hover:bg-blue-200 active:scale-95 transition-all">
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                  <button className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold hover:bg-primary-600 active:scale-95 transition-all">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
