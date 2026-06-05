'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CategorySection from './CategorySection';
import SearchBar from './SearchBar';
import AddItemModal from './AddItemModal';
import VoiceButton from './VoiceButton';
import OfflineBanner from './OfflineBanner';
import type { ItemWithStatus, Store } from '@/lib/types';

interface ShoppingListProps {
  store: Store;
  initialItems: ItemWithStatus[];
  allStores: Store[];
}

export default function ShoppingList({ store, initialItems, allStores }: ShoppingListProps) {
  const router = useRouter();
  const [items, setItems] = useState<ItemWithStatus[]>(initialItems);
  const [mode, setMode] = useState<'all' | 'shopping'>('shopping');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsByCategory = useMemo(() => {
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

    // Group by category
    const grouped = result.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ItemWithStatus[]>);

    return grouped;
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

      router.refresh();
    } catch (error) {
      console.error('Error updating item:', error);
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, isChecked: !checked } : item
        )
      );
      alert('Failed to update item. Please try again.');
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    // Optimistic update
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    try {
      const res = await fetch(`/api/items/${itemId}/quantity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      router.refresh();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setSearchQuery(text);
    // Optionally auto-open add modal with the transcript
    setIsAddModalOpen(true);
  };

  const handleItemAdded = () => {
    router.refresh();
  };

  const handleClearCompleted = async () => {
    const checkedItems = items.filter(item => item.isChecked);
    if (checkedItems.length === 0) return;

    if (!confirm(`Clear ${checkedItems.length} completed items?`)) return;

    try {
      await Promise.all(
        checkedItems.map(item =>
          fetch(`/api/items/${item.id}`, { method: 'DELETE' })
        )
      );
      router.refresh();
    } catch (error) {
      console.error('Error clearing items:', error);
      alert('Failed to clear some items');
    }
  };

  const uncheckedCount = items.filter(i => !i.isChecked).length;
  const checkedCount = items.filter(i => i.isChecked).length;

  return (
    <>
      <OfflineBanner />

      <div className="max-w-md mx-auto bg-cream-50 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-10 h-10 flex items-center justify-center text-brown-800 hover:bg-cream-100 rounded-full"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold text-brown-800">{store.name}</h1>
                <p className="text-xs text-gray-600">
                  {uncheckedCount} items {checkedCount > 0 && `· ${checkedCount} done`}
                </p>
              </div>
            </div>
            {checkedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 px-4 py-3">
            <button
              onClick={() => setMode('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                mode === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
              }`}
            >
              📦 All Items
            </button>
            <button
              onClick={() => setMode('shopping')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                mode === 'shopping'
                  ? 'bg-primary-500 text-white'
                  : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
              }`}
            >
              🛒 Shopping List
            </button>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Items by Category */}
        <div className="pb-32">
          {Object.keys(itemsByCategory).length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600">
                {searchQuery ? 'No items match your search' : 'Your list is empty. Tap + to add items.'}
              </p>
            </div>
          ) : (
            Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <CategorySection
                key={category}
                category={category}
                items={categoryItems}
                onToggle={handleToggle}
                onQuantityChange={handleQuantityChange}
              />
            ))
          )}
        </div>

        {/* Voice Input Button */}
        <VoiceButton onTranscript={handleVoiceTranscript} />

        {/* Add Item Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg text-3xl flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-transform"
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
          initialName={searchQuery}
        />
      </div>
    </>
  );
}
