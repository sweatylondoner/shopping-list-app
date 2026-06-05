export interface Store {
  id: string;
  name: string;
  created_at: string;
  uncheckedCount?: number;
}

export interface Item {
  id: string;
  name: string;
  store_id: string;
  is_favorite: boolean;
  created_at: string;
  isChecked?: boolean;
  lastChecked?: string | null;
  category?: string;
  quantity?: number;
  unit?: string;
  image_url?: string;
  stock_status?: 'ok' | 'low' | 'out';
  notes?: string;
}

export interface ItemAction {
  id: string;
  item_id: string;
  action: 'checked' | 'unchecked';
  timestamp: string;
}

export interface ItemWithStatus extends Item {
  isChecked: boolean;
  lastChecked: string | null;
}

export interface Suggestion {
  id: string;
  name: string;
  isFavorite: boolean;
  checkCount: number;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  category: string | null;
  quantity: number;
  unit: string | null;
  expiry_date: string | null;
  location: string; // fridge, freezer, pantry
  status: 'ok' | 'low' | 'expired';
  image_url: string | null;
  notes: string | null;
  purchased_date: string;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number;
  difficulty: string | null;
  cuisine: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface MealPlan {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id: string | null;
  recipe?: Recipe;
  notes: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
