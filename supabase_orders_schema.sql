-- Tạo bảng orders để lưu thông tin đơn hàng
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_district TEXT NOT NULL,
  customer_ward TEXT NOT NULL,
  note TEXT,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng order_items để lưu chi tiết sản phẩm trong đơn hàng
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,  -- Đổi từ UUID sang TEXT để hỗ trợ cả số và string
  product_name TEXT NOT NULL,
  product_color TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Bật Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- XÓA TẤT CẢ POLICIES CŨ (nếu có)
DROP POLICY IF EXISTS "Allow anonymous insert orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow users to view their own orders" ON orders;
DROP POLICY IF EXISTS "Allow users to view order items" ON order_items;
DROP POLICY IF EXISTS "Allow anonymous read orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public insert orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;

-- ===== POLICIES CHO BẢNG ORDERS =====

-- Cho phép TẤT CẢ mọi người (public) tạo đơn hàng
CREATE POLICY "Allow public insert orders" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Cho phép anonymous users tạo đơn hàng
CREATE POLICY "Allow anonymous insert orders" ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Cho phép authenticated users tạo đơn hàng
CREATE POLICY "Allow authenticated insert orders" ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Cho phép TẤT CẢ mọi người đọc đơn hàng
CREATE POLICY "Allow public read orders" ON orders
  FOR SELECT
  TO public
  USING (true);

-- Cho phép anonymous users đọc
CREATE POLICY "Allow anonymous read orders" ON orders
  FOR SELECT
  TO anon
  USING (true);

-- Cho phép authenticated users đọc
CREATE POLICY "Allow users to view their own orders" ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- ===== POLICIES CHO BẢNG ORDER_ITEMS =====

-- Cho phép TẤT CẢ mọi người (public) tạo order items
CREATE POLICY "Allow public insert order_items" ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Cho phép anonymous users tạo order items
CREATE POLICY "Allow anonymous insert order_items" ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Cho phép authenticated users tạo order items
CREATE POLICY "Allow authenticated insert order_items" ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Cho phép TẤT CẢ mọi người đọc order items
CREATE POLICY "Allow public read order_items" ON order_items
  FOR SELECT
  TO public
  USING (true);

-- Cho phép anonymous users đọc
CREATE POLICY "Allow anonymous read order_items" ON order_items
  FOR SELECT
  TO anon
  USING (true);

-- Cho phép authenticated users đọc
CREATE POLICY "Allow users to view order items" ON order_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment để ghi chú
COMMENT ON TABLE orders IS 'Bảng lưu thông tin đơn hàng';
COMMENT ON TABLE order_items IS 'Bảng lưu chi tiết sản phẩm trong đơn hàng';
