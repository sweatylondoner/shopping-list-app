'use client';

import { useState } from 'react';
import { ItemWithStatus } from '@/lib/types';
import ItemCard from './ItemCard';

interface CategorySectionProps {
  category: string;
  items: ItemWithStatus[];
  onToggle: (itemId: string, checked: boolean) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'grains': '🌾',
  'spices': '🌶️',
  'vegetables': '🥬',
  'fruits': '🍎',
  'dairy': '🥛',
  'meat': '🥩',
  'seafood': '🐟',
  'bakery': '🍞',
  'snacks': '🍿',
  'beverages': '☕',
  'frozen': '🧊',
  'pantry': '🥫',
  'other': '📦',
};

export default function CategorySection({
  category,
  items,
  onToggle,
  onQuantityChange,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
  const icon = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS['other'];
  const uncheckedCount = items.filter(item => !item.isChecked).length;

  return (
    <div className="mb-4">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-cream-100 hover:bg-cream-200 transition-colors"
      >
        <span className="text-2xl">{icon}</span>
        <span className="flex-1 text-left font-semibold text-brown-800 uppercase text-sm tracking-wide">
          {category}
        </span>
        {uncheckedCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-600 text-white">
            {uncheckedCount}
          </span>
        )}
        <span className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Category Items */}
      {isExpanded && (
        <div>
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onToggle={onToggle}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
