'use client';

import { useState, useEffect } from 'react';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';

interface AddItemModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: () => void;
  initialName?: string;
}

export default function AddItemModal({ storeId, isOpen, onClose, onItemAdded, initialName }: AddItemModalProps) {
  const [itemName, setItemName] = useState(initialName || '');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: voiceError,
  } = useVoiceInput();

  // Update item name when transcript changes
  useEffect(() => {
    if (transcript) {
      setItemName(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      alert('Item name required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: itemName.trim(),
          storeId,
          category: category || 'Other',
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add item');
      }

      // Success
      setItemName('');
      resetTranscript();
      onItemAdded();
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setItemName('');
    resetTranscript();
    if (isListening) {
      stopListening();
    }
    onClose();
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Item</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Item name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
            disabled={isSubmitting}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isSubmitting}
          >
            <option value="">Select category...</option>
            <option value="Grains">🌾 Grains & Lentils</option>
            <option value="Spices">🌶️ Spices</option>
            <option value="Vegetables">🥬 Vegetables</option>
            <option value="Fruits">🍎 Fruits</option>
            <option value="Dairy">🥛 Dairy</option>
            <option value="Meat">🥩 Meat</option>
            <option value="Seafood">🐟 Seafood</option>
            <option value="Bakery">🍞 Bakery</option>
            <option value="Snacks">🍿 Snacks</option>
            <option value="Beverages">☕ Beverages</option>
            <option value="Frozen">🧊 Frozen</option>
            <option value="Pantry">🥫 Pantry</option>
            <option value="Other">📦 Other</option>
          </select>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300"
                disabled={isSubmitting}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700"
                disabled={isSubmitting}
              >
                +
              </button>
            </div>
          </div>

          {isSupported && (
            <div className="mb-4 flex flex-col items-center">
              <button
                type="button"
                onClick={handleVoiceClick}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                🎤
              </button>
              <p className="mt-2 text-sm text-gray-600">
                {isListening ? 'Listening...' : 'Tap to speak'}
              </p>
            </div>
          )}

          {voiceError && (
            <p className="text-red-600 text-sm mb-4">{voiceError}</p>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
              disabled={isSubmitting || !itemName.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
