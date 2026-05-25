'use client';

import { useState, useEffect } from 'react';
import { useVoiceInput } from '@/lib/hooks/useVoiceInput';

interface AddItemModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: () => void;
}

export default function AddItemModal({ storeId, isOpen, onClose, onItemAdded }: AddItemModalProps) {
  const [itemName, setItemName] = useState('');
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
            disabled={isSubmitting}
          />

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
