import { supabase } from '@/lib/supabase';
import type { MealPlan, Recipe } from '@/lib/types';
import MealPlanner from '@/components/MealPlanner';

export const dynamic = 'force-dynamic';

async function getMealPlans(): Promise<MealPlan[]> {
  // Get current week's meal plans
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

  const { data: mealPlans, error } = await supabase
    .from('meal_plans')
    .select('*')
    .gte('date', startOfWeek.toISOString().split('T')[0])
    .lte('date', endOfWeek.toISOString().split('T')[0])
    .order('date');

  if (error) {
    console.error('Error fetching meal plans:', error);
    return [];
  }

  // Fetch associated recipes
  const plansWithRecipes = await Promise.all(
    (mealPlans || []).map(async (plan) => {
      if (plan.recipe_id) {
        const { data: recipe } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', plan.recipe_id)
          .single();

        return { ...plan, recipe };
      }
      return plan;
    })
  );

  return plansWithRecipes;
}

export default async function PlannerPage() {
  const mealPlans = await getMealPlans();

  return <MealPlanner initialMealPlans={mealPlans} />;
}
