-- Migration: GKR Redesign - Add new fields to items table
-- Date: 2026-06-05
-- Description: Adds category, quantity, unit, image_url, stock_status, and notes fields

-- Add new columns to items table
ALTER TABLE items
ADD COLUMN IF NOT EXISTS category VARCHAR DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit VARCHAR,
ADD COLUMN IF NOT EXISTS image_url VARCHAR,
ADD COLUMN IF NOT EXISTS stock_status VARCHAR DEFAULT 'ok' CHECK (stock_status IN ('ok', 'low', 'out')),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);

-- Add index on stock_status for filtering low/out of stock items
CREATE INDEX IF NOT EXISTS idx_items_stock_status ON items(stock_status);

-- Update existing items to have default category if NULL
UPDATE items SET category = 'Other' WHERE category IS NULL;

-- Update existing items to have default quantity if NULL
UPDATE items SET quantity = 1 WHERE quantity IS NULL;

-- Add comment to table for documentation
COMMENT ON COLUMN items.category IS 'Item category (Grains, Spices, Vegetables, Fruits, Dairy, Meat, Seafood, Bakery, Snacks, Beverages, Frozen, Pantry, Other)';
COMMENT ON COLUMN items.quantity IS 'Quantity to purchase (default: 1)';
COMMENT ON COLUMN items.unit IS 'Unit of measure (e.g., 400g, 2kg, 1 dozen)';
COMMENT ON COLUMN items.image_url IS 'Optional product image URL';
COMMENT ON COLUMN items.stock_status IS 'Stock status: ok (in stock), low (running low), out (out of stock)';
COMMENT ON COLUMN items.notes IS 'Additional notes about the item';
