-- Migration: Full GKR App - Add recipes, meal plans, and inventory tables
-- Date: 2026-06-05
-- Description: Extends shopping list app with meal planning, recipes, and inventory tracking

-- ============================================
-- RECIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER DEFAULT 1,
  difficulty VARCHAR(50), -- easy, medium, hard
  cuisine VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe ingredients (many-to-many with items)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe tags (for filtering: egg-free, vegan, healthy, quick, etc.)
CREATE TABLE IF NOT EXISTS recipe_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, tag)
);

-- Recipe instructions
CREATE TABLE IF NOT EXISTS recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, step_number)
);

-- ============================================
-- MEAL PLANNER TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, snack
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY TABLE (Fridge/Pantry tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10,2) DEFAULT 1,
  unit VARCHAR(50),
  expiry_date DATE,
  location VARCHAR(100), -- fridge, freezer, pantry
  status VARCHAR(50) DEFAULT 'ok', -- ok, low, expired
  image_url VARCHAR(500),
  notes TEXT,
  purchased_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag ON recipe_tags(tag);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe ON recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date ON meal_plans(date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_meal_type ON meal_plans(meal_type);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location);

-- ============================================
-- SAMPLE DATA - Recipes
-- ============================================
-- Insert sample recipes
INSERT INTO recipes (name, description, image_url, prep_time, cook_time, servings, difficulty, cuisine) VALUES
('Paneer Tikka Roll', 'A cheesy twist to the traditional favorite', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 15, 10, 2, 'easy', 'Indian'),
('Aloo Cheese Paratha', 'Perfect non-messy wrap for kids', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', 20, 15, 4, 'medium', 'Indian'),
('Pasta with Veggies', 'No sauce, No worries! Swap as you go!', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', 10, 15, 3, 'easy', 'Italian'),
('Paneer Wrap', 'A hearty on Paneer', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', 15, 10, 2, 'easy', 'Fusion'),
('Samosa & Sprouts', 'Stock Alert: Add Now, Buy Now', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 5, 10, 1, 'easy', 'Indian'),
('Aloo Tikki Burger', 'Classic burger + add ketchup', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 20, 15, 4, 'medium', 'Fusion');

-- Get IDs for tag insertion (assuming they were just inserted)
DO $$
DECLARE
  paneer_roll_id UUID;
  aloo_paratha_id UUID;
  pasta_id UUID;
BEGIN
  -- Get recipe IDs
  SELECT id INTO paneer_roll_id FROM recipes WHERE name = 'Paneer Tikka Roll' LIMIT 1;
  SELECT id INTO aloo_paratha_id FROM recipes WHERE name = 'Aloo Cheese Paratha' LIMIT 1;
  SELECT id INTO pasta_id FROM recipes WHERE name = 'Pasta with Veggies' LIMIT 1;

  -- Insert tags
  IF paneer_roll_id IS NOT NULL THEN
    INSERT INTO recipe_tags (recipe_id, tag) VALUES
      (paneer_roll_id, 'indian-fusion'),
      (paneer_roll_id, 'under-15-mins');
  END IF;

  IF aloo_paratha_id IS NOT NULL THEN
    INSERT INTO recipe_tags (recipe_id, tag) VALUES
      (aloo_paratha_id, 'classic');
  END IF;

  IF pasta_id IS NOT NULL THEN
    INSERT INTO recipe_tags (recipe_id, tag) VALUES
      (pasta_id, 'egg-free'),
      (pasta_id, 'healthy');
  END IF;
END $$;

-- ============================================
-- SAMPLE DATA - Inventory
-- ============================================
INSERT INTO inventory (item_name, category, quantity, unit, expiry_date, location, status) VALUES
('Milk', 'Dairy', 2, 'liters', CURRENT_DATE + INTERVAL '3 days', 'fridge', 'ok'),
('Eggs', 'Dairy', 12, 'pieces', CURRENT_DATE + INTERVAL '7 days', 'fridge', 'low'),
('Tomatoes', 'Vegetables', 5, 'pieces', CURRENT_DATE + INTERVAL '4 days', 'fridge', 'ok'),
('Paneer', 'Dairy', 400, 'grams', CURRENT_DATE + INTERVAL '2 days', 'fridge', 'low'),
('Bread', 'Bakery', 1, 'loaf', CURRENT_DATE + INTERVAL '5 days', 'pantry', 'ok'),
('Frozen Pizza', 'Frozen', 2, 'pieces', CURRENT_DATE + INTERVAL '30 days', 'freezer', 'ok');

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE recipes IS 'Recipe database with instructions and metadata';
COMMENT ON TABLE recipe_ingredients IS 'Ingredients needed for each recipe';
COMMENT ON TABLE recipe_tags IS 'Tags for filtering recipes (dietary, cuisine, difficulty)';
COMMENT ON TABLE meal_plans IS 'Weekly meal planning calendar';
COMMENT ON TABLE inventory IS 'Fridge/pantry inventory with expiry tracking';
