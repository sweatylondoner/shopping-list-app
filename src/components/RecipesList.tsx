'use client';

import { useState, useMemo } from 'react';
import type { Recipe } from '@/lib/types';

interface RecipesListProps {
  initialRecipes: Recipe[];
}

const FILTER_CHIPS = [
  { id: 'school-specials', label: 'School Specials' },
  { id: 'under-15-mins', label: 'Under 15 Mins' },
  { id: 'healthy', label: 'Healthy' },
];

export default function RecipesList({ initialRecipes }: RecipesListProps) {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (activeFilter) {
      result = result.filter(recipe =>
        recipe.tags?.includes(activeFilter)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [recipes, activeFilter, searchQuery]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200">
              <span className="w-full h-full flex items-center justify-center text-lg">👤</span>
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
              placeholder="Search ingredients (e.g. paneer, pasta)"
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
          {FILTER_CHIPS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">School Lunch Box Ideas</h2>
        <button className="text-sm text-primary-600 font-medium">See All →</button>
      </div>

      {/* Recipes Grid */}
      <div className="px-4 pb-24">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🍳</div>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No recipes found' : 'No recipes available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Recipe Image */}
                <div className="relative h-40 bg-gray-50">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}
                  {/* Favorite Button */}
                  <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Recipe Info */}
                <div className="p-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 uppercase"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                    {recipe.name}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {recipe.description || 'Delicious recipe'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
