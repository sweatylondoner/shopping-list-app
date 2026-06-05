'use client';

import { useState, useMemo } from 'react';
import type { Recipe } from '@/lib/types';

interface RecipesListProps {
  initialRecipes: Recipe[];
}

const FILTER_CHIPS = [
  { id: 'all', label: 'All', icon: '📖' },
  { id: 'school-specials', label: 'School Specials', icon: '🎒' },
  { id: 'under-15-mins', label: 'Under 15 Mins', icon: '⏱️' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
];

export default function RecipesList({ initialRecipes }: RecipesListProps) {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // Filter by tags
    if (activeFilter !== 'all') {
      result = result.filter(recipe =>
        recipe.tags?.includes(activeFilter)
      );
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.cuisine?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [recipes, activeFilter, searchQuery]);

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-cream-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-brown-800 mb-4">
          School Lunch Box Ideas
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients (e.g. paneer, pasta)"
              className="w-full px-4 py-3 pl-10 bg-cream-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_CHIPS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeFilter === filter.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="p-4 pb-24">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <p className="text-gray-600">
              {searchQuery ? 'No recipes match your search' : 'No recipes available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Recipe Image */}
                <div className="relative h-32 bg-cream-100">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                  {/* Favorite Button */}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-primary-600">
                    ♡
                  </button>
                </div>

                {/* Recipe Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {recipe.name}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-cream-100 text-gray-600"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {recipe.prep_time && (
                      <span>⏱️ {recipe.prep_time + (recipe.cook_time || 0)} min</span>
                    )}
                    {recipe.difficulty && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                          recipe.difficulty
                        )}`}
                      >
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
