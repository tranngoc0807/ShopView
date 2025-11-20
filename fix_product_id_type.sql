-- Script để fix lỗi product_id type mismatch
-- Chạy script này trong Supabase SQL Editor

-- Bước 1: Xóa bảng order_items cũ (nếu có dữ liệu thì backup trước)
DROP TABLE IF EXISTS order_items CASCADE;

-- Bước 2: Tạo lại bảng order_items với product_id kiểu TEXT
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,  -- Đổi từ UUID sang TEXT
  product_name TEXT NOT NULL,
  product_color TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bước 3: Tạo lại index
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Bước 4: Bật RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Bước 5: Xóa policies cũ
DROP POLICY IF EXISTS "Allow public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anonymous insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anonymous read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow users to view order items" ON order_items;

-- Bước 6: Tạo lại policies
CREATE POLICY "Allow public insert order_items" ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert order_items" ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert order_items" ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read order_items" ON order_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow anonymous read order_items" ON order_items
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow users to view order items" ON order_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Bước 7: Comment
COMMENT ON TABLE order_items IS 'Bảng lưu chi tiết sản phẩm trong đơn hàng';
COMMENT ON COLUMN order_items.product_id IS 'ID sản phẩm - hỗ trợ cả số và UUID';
