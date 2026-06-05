import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/lib/types';
import RecipesList from '@/components/RecipesList';

export const dynamic = 'force-dynamic';

async function getRecipes(): Promise<Recipe[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('name');

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError);
    return [];
  }

  // Fetch tags for each recipe
  const recipesWithTags = await Promise.all(
    (recipes || []).map(async (recipe) => {
      const { data: tags } = await supabase
        .from('recipe_tags')
        .select('tag')
        .eq('recipe_id', recipe.id);

      return {
        ...recipe,
        tags: tags?.map((t) => t.tag) || [],
      };
    })
  );

  return recipesWithTags;
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return <RecipesList initialRecipes={recipes} />;
}
