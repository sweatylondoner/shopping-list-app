-- Create stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create item_actions table (history tracking)
CREATE TABLE item_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('checked', 'unchecked')),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_item_actions_item_id ON item_actions(item_id);
CREATE INDEX idx_item_actions_timestamp ON item_actions(timestamp);
CREATE INDEX idx_item_actions_action ON item_actions(action);

-- Seed stores
INSERT INTO stores (name) VALUES
  ('Indian Store'),
  ('Sainsbury''s'),
  ('Costco');

-- Seed Indian Store items
INSERT INTO items (name, store_id)
SELECT name, (SELECT id FROM stores WHERE name = 'Indian Store')
FROM (VALUES
  ('Basmati rice'),
  ('Toor dal'),
  ('Moong dal'),
  ('Chana dal'),
  ('Turmeric powder'),
  ('Cumin seeds'),
  ('Coriander powder'),
  ('Red chili powder'),
  ('Atta flour'),
  ('Paneer'),
  ('Ghee'),
  ('Papad'),
  ('Mango pickle'),
  ('Coconut oil'),
  ('Curry leaves'),
  ('Mustard seeds'),
  ('Cardamom'),
  ('Garam masala'),
  ('Besan flour'),
  ('Jaggery'),
  ('Tamarind paste'),
  ('Urad dal'),
  ('Masoor dal'),
  ('Rice flour'),
  ('Idli batter'),
  ('Sambar powder'),
  ('Kasuri methi'),
  ('Saffron'),
  ('Fennel seeds'),
  ('Asafoetida (hing)'),
  ('Chana masala'),
  ('Black salt'),
  ('Green chili'),
  ('Ginger'),
  ('Coriander leaves')
) AS t(name);

-- Seed Sainsbury's items
INSERT INTO items (name, store_id)
SELECT name, (SELECT id FROM stores WHERE name = 'Sainsbury''s')
FROM (VALUES
  ('Milk (whole)'),
  ('Milk (semi-skimmed)'),
  ('Bread (white)'),
  ('Bread (brown)'),
  ('Eggs'),
  ('Butter'),
  ('Cheddar cheese'),
  ('Chicken breast'),
  ('Bacon'),
  ('Minced beef'),
  ('Salmon'),
  ('Broccoli'),
  ('Carrots'),
  ('Onions'),
  ('Tomatoes'),
  ('Potatoes'),
  ('Apples'),
  ('Bananas'),
  ('Oranges'),
  ('Pasta'),
  ('Rice'),
  ('Cereal'),
  ('Coffee'),
  ('Tea'),
  ('Toilet paper'),
  ('Kitchen roll'),
  ('Washing liquid'),
  ('Dishwasher tablets'),
  ('Yogurt'),
  ('Cucumber'),
  ('Lettuce'),
  ('Bell peppers'),
  ('Mushrooms'),
  ('Garlic'),
  ('Lemons'),
  ('Strawberries'),
  ('Grapes'),
  ('Pears'),
  ('Olive oil'),
  ('Balsamic vinegar'),
  ('Honey'),
  ('Jam'),
  ('Peanut butter'),
  ('Biscuits'),
  ('Chocolate')
) AS t(name);

-- Seed Costco items
INSERT INTO items (name, store_id)
SELECT name, (SELECT id FROM stores WHERE name = 'Costco')
FROM (VALUES
  ('Paper towels (bulk)'),
  ('Toilet paper (bulk)'),
  ('Dishwasher tablets (bulk)'),
  ('Laundry detergent (bulk)'),
  ('Kitchen trash bags'),
  ('Bottled water (case)'),
  ('Frozen pizza'),
  ('Frozen berries'),
  ('Mixed nuts'),
  ('Protein bars'),
  ('Olive oil (large)'),
  ('Pasta (bulk)'),
  ('Canned tomatoes (case)'),
  ('Coffee beans (bulk)'),
  ('Batteries (AA/AAA)'),
  ('Cleaning wipes'),
  ('Hand soap (bulk)'),
  ('Shampoo (bulk)'),
  ('Conditioner (bulk)'),
  ('Aluminum foil'),
  ('Plastic wrap'),
  ('Ziploc bags'),
  ('Paper plates'),
  ('Plastic cups'),
  ('Napkins (bulk)'),
  ('Granola bars'),
  ('Crackers (bulk)'),
  ('Peanuts'),
  ('Cashews'),
  ('Almonds')
) AS t(name);

-- Enable Row Level Security (RLS)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now - single user app)
CREATE POLICY "Allow all on stores" ON stores FOR ALL USING (true);
CREATE POLICY "Allow all on items" ON items FOR ALL USING (true);
CREATE POLICY "Allow all on item_actions" ON item_actions FOR ALL USING (true);
