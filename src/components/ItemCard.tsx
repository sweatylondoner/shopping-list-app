'use client';

import { ItemWithStatus } from '@/lib/types';

interface ItemCardProps {
  item: ItemWithStatus;
  onToggle: (itemId: string, checked: boolean) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
}

export default function ItemCard({ item, onToggle, onQuantityChange }: ItemCardProps) {
  const handleDecrease = () => {
    if (onQuantityChange && item.quantity && item.quantity > 0) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(item.id, (item.quantity || 0) + 1);
    }
  };

  const getStockBadge = () => {
    if (item.stock_status === 'low') {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
          Running Low
        </span>
      );
    }
    if (item.stock_status === 'out') {
      return (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-100 hover:bg-cream-50 transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={(e) => onToggle(item.id, e.target.checked)}
        className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
      />

      {/* Item Image */}
      {item.image_url ? (
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-cream-100">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🛒</span>
        </div>
      )}

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 ${item.isChecked ? 'line-through opacity-60' : ''}`}>
              {item.name}
            </h3>
            {item.notes && (
              <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>
            )}
            <div className="mt-1">{getStockBadge()}</div>
          </div>

          {/* Quantity Controls */}
          {onQuantityChange && (
            <div className="flex items-center gap-2 bg-cream-100 rounded-full px-1 py-1">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 rounded-full bg-white text-primary-600 flex items-center justify-center hover:bg-cream-50 active:scale-95 transition-transform"
                disabled={!item.quantity || item.quantity <= 0}
              >
                −
              </button>
              <span className="w-8 text-center font-medium text-sm">
                {item.quantity || 0}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          )}
        </div>

        {item.unit && (
          <p className="text-xs text-gray-500 mt-1">{item.unit}</p>
        )}
      </div>
    </div>
  );
}
