'use client';

import { useState } from 'react';
import type { ItemWithStatus } from '@/lib/types';

interface ItemRowProps {
  item: ItemWithStatus;
  onToggle: (itemId: string, checked: boolean) => Promise<void>;
  onToggleFavorite: (itemId: string, favorite: boolean) => Promise<void>;
}

export default function ItemRow({ item, onToggle, onToggleFavorite }: ItemRowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = async () => {
    setIsLoading(true);
    try {
      await onToggle(item.id, !item.isChecked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onToggleFavorite(item.id, !item.is_favorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="flex items-center space-x-3 py-3 px-4 bg-white border-b border-gray-200">
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={handleCheckboxChange}
        disabled={isLoading}
        className="w-6 h-6 min-w-touch-target min-h-touch-target rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />

      <span
        className={`flex-1 text-lg ${
          item.isChecked ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}
      >
        {item.name}
      </span>

      <button
        onClick={handleFavoriteClick}
        className="text-2xl min-w-touch-target min-h-touch-target flex items-center justify-center"
        aria-label={item.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {item.is_favorite ? '⭐' : '☆'}
      </button>
    </div>
  );
}
