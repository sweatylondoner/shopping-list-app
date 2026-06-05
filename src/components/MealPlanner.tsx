'use client';

import { useState } from 'react';
import type { MealPlan } from '@/lib/types';

interface MealPlannerProps {
  initialMealPlans: MealPlan[];
}

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function MealPlanner({ initialMealPlans }: MealPlannerProps) {
  const [mealPlans] = useState<MealPlan[]>(initialMealPlans);
  const [selectedWeek, setSelectedWeek] = useState('Oct 16 - Oct 20');

  // Get today's day index (0 = Monday)
  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  // Group meal plans by date
  const mealPlansByDate = mealPlans.reduce((acc, plan) => {
    if (!acc[plan.date]) {
      acc[plan.date] = [];
    }
    acc[plan.date].push(plan);
    return acc;
  }, {} as Record<string, MealPlan[]>);

  // Generate week dates
  const getWeekDates = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - todayIndex);

    return DAYS_OF_WEEK.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="max-w-md mx-auto bg-cream-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-brown-800">Arjun's Lunch Box</h1>
          <button className="text-brown-700">⚙️</button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Weekly Menu: {selectedWeek}
        </p>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-brown-700">
            ←
          </button>
          <span className="text-sm font-medium text-gray-700">{selectedWeek}</span>
          <button className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-brown-700">
            →
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="pb-24">
        {DAYS_OF_WEEK.map((day, index) => {
          const date = weekDates[index];
          const dayPlans = mealPlansByDate[date] || [];
          const isToday = index === todayIndex;

          return (
            <div key={day} className="mb-4">
              {/* Day Header */}
              <div className={`px-4 py-3 flex items-center justify-between ${
                isToday ? 'bg-primary-100' : 'bg-cream-100'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${
                    isToday ? 'text-primary-700' : 'text-brown-800'
                  }`}>
                    {day}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {isToday && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500 text-white">
                      TODAY
                    </span>
                  )}
                </div>
                <button className="text-primary-600 text-sm font-medium">
                  + Add Now
                </button>
              </div>

              {/* Meals */}
              <div className="bg-white">
                {dayPlans.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <div className="text-3xl mb-2">🍱</div>
                    <p className="text-sm">No meals planned</p>
                  </div>
                ) : (
                  dayPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center gap-3 p-4 border-b border-gray-100"
                    >
                      {/* Meal Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                        {plan.recipe?.image_url ? (
                          <img
                            src={plan.recipe.image_url}
                            alt={plan.recipe.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Meal Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">
                          {plan.recipe?.name || 'Unnamed Meal'}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {plan.recipe?.description || plan.notes}
                        </p>

                        {/* Tags */}
                        <div className="flex gap-1 flex-wrap">
                          {plan.recipe?.prep_time && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                              ⏱️ {plan.recipe.prep_time} mins
                            </span>
                          )}
                          {plan.is_completed && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                              ✓ Done
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-brown-700 hover:bg-cream-200">
                        ↻
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Button */}
      <div className="fixed bottom-20 right-6 z-10">
        <button className="w-14 h-14 bg-brown-700 text-white rounded-full shadow-lg text-2xl flex items-center justify-center hover:bg-brown-800">
          🎤
        </button>
      </div>
    </div>
  );
}
