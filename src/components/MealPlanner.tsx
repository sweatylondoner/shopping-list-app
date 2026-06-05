'use client';

import { useState } from 'react';
import type { MealPlan } from '@/lib/types';

interface MealPlannerProps {
  initialMealPlans: MealPlan[];
}

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function MealPlanner({ initialMealPlans }: MealPlannerProps) {
  const [mealPlans] = useState<MealPlan[]>(initialMealPlans);

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;

  const mealPlansByDate = mealPlans.reduce((acc, plan) => {
    if (!acc[plan.date]) {
      acc[plan.date] = [];
    }
    acc[plan.date].push(plan);
    return acc;
  }, {} as Record<string, MealPlan[]>);

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

        <div>
          <h2 className="text-xl font-bold text-gray-900">Arjun's Lunch Box</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <button className="hover:text-gray-900">←</button>
            <span>Weekly Menu: Oct 16 - Oct 20</span>
            <button className="hover:text-gray-900">→</button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="pb-24">
        {DAYS_OF_WEEK.map((day, index) => {
          const date = weekDates[index];
          const dayPlans = mealPlansByDate[date] || [];

          return (
            <div key={day} className="border-b border-gray-100">
              {/* Day Header */}
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">{day}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Meals */}
              {dayPlans.length === 0 ? (
                <div className="p-6 text-center">
                  <button className="text-sm text-primary-600 font-medium">+ Add Now</button>
                </div>
              ) : (
                dayPlans.map((plan) => (
                  <div key={plan.id} className="px-4 py-3 flex items-center gap-3">
                    {/* Circular Meal Image */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {plan.recipe?.image_url ? (
                        <img
                          src={plan.recipe.image_url}
                          alt={plan.recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Meal Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {plan.recipe?.name || 'Unnamed Meal'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {plan.recipe?.description || plan.notes}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-gray-600 hover:text-primary-600">
                          ↻ Add Now
                        </button>
                        <button className="text-xs text-gray-600 hover:text-primary-600">
                          🛒 Buy Now
                        </button>
                        <button className="text-xs text-gray-600 hover:text-primary-600">
                          Swap
                        </button>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col gap-1 items-end">
                      {plan.recipe?.tags?.includes('egg-free') && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                          EGG-FREE
                        </span>
                      )}
                      {plan.is_completed && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-50 text-red-600">
                          STOCK ALERT
                        </span>
                      )}
                    </div>

                    {/* Voice Button Icon */}
                    <button className="w-10 h-10 rounded-full bg-brown-700 text-white flex items-center justify-center flex-shrink-0 hover:bg-brown-800">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
