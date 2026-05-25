'use client';

import { useState, useEffect } from 'react';
import type { Suggestion } from '@/lib/types';

interface SmartSuggestionsProps {
  storeId: string;
  onSuggestionClick: (itemId: string) => Promise<void>;
}

export default function SmartSuggestions({ storeId, onSuggestionClick }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, [storeId]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`/api/stores/${storeId}/suggestions`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');

      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (itemId: string) => {
    try {
      await onSuggestionClick(itemId);
      // Remove from suggestions list
      setSuggestions(prev => prev.filter(s => s.id !== itemId));
    } catch (error) {
      console.error('Error checking suggestion:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-gray-500">Loading suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          You usually buy:
        </h2>
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleClick(suggestion.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 border-2 border-gray-300 rounded" />
                <span className="text-lg text-gray-800">{suggestion.name}</span>
              </div>
              {suggestion.isFavorite && (
                <span className="text-xl">⭐</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
