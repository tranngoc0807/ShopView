-- Add category column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Optionally, add some sample categories based on gender
-- UPDATE products SET category = 'Nam' WHERE gender = 'nam';
-- UPDATE products SET category = 'Nữ' WHERE gender = 'nu';
-- UPDATE products SET category = 'Trẻ em' WHERE gender = 'kids';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
