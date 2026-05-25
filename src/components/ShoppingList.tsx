'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ItemRow from './ItemRow';
import SearchBar from './SearchBar';
import SmartSuggestions from './SmartSuggestions';
import AddItemModal from './AddItemModal';
import type { ItemWithStatus, Store } from '@/lib/types';

interface ShoppingListProps {
  store: Store;
  initialItems: ItemWithStatus[];
}

export default function ShoppingList({ store, initialItems }: ShoppingListProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemWithStatus[]>(initialItems);
  const [mode, setMode] = useState<'all' | 'shopping'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by mode
    if (mode === 'shopping') {
      result = result.filter(item => !item.isChecked);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [items, mode, searchQuery]);

  const handleToggle = async (itemId: string, checked: boolean) => {
    // Optimistic update
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isChecked: checked } : item
      )
    );

    try {
      const endpoint = checked ? 'check' : 'uncheck';
      const res = await fetch(`/api/items/${itemId}/${endpoint}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to update item');
      }

      // Refresh to get latest state
      router.refresh();
    } catch (error) {
      console.error('Error updating item:', error);
      // Rollback optimistic update
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, isChecked: !checked } : item
        )
      );
      alert('Failed to update item. Please try again.');
    }
  };

  const handleToggleFavorite = async (itemId: string, favorite: boolean) => {
    // Optimistic update
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, is_favorite: favorite } : item
      )
    );

    try {
      const res = await fetch(`/api/items/${itemId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: favorite }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle favorite');
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Rollback
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, is_favorite: !favorite } : item
        )
      );
    }
  };

  const handleSuggestionClick = async (itemId: string) => {
    await handleToggle(itemId, true);
  };

  const handleItemAdded = () => {
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.push('/')}
            className="text-2xl mr-3 min-w-touch-target min-h-touch-target flex items-center justify-center"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode('all')}
            className={`flex-1 py-3 text-lg font-medium ${
              mode === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setMode('shopping')}
            className={`flex-1 py-3 text-lg font-medium ${
              mode === 'shopping'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600'
            }`}
          >
            Shopping
          </button>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Smart Suggestions */}
      {mode === 'shopping' && !searchQuery && (
        <SmartSuggestions
          storeId={store.id}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Items List */}
      <div className="pb-24">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No items match your search' : 'No items yet. Tap + to add one.'}
          </div>
        ) : (
          filteredItems.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        )}
      </div>

      {/* Add Item Button - Fixed at bottom */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg text-3xl flex items-center justify-center hover:bg-primary-700"
        >
          +
        </button>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        storeId={store.id}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onItemAdded={handleItemAdded}
      />
    </div>
  );
}
