# 🚀 Quick Setup - Tạo bảng Orders trong Supabase

## Bước 1: Mở Supabase SQL Editor

1. Truy cập: https://app.supabase.com
2. Đăng nhập và chọn project của bạn
3. Click **SQL Editor** ở menu bên trái
4. Click **"New query"**

## Bước 2: Copy và chạy SQL

1. Mở file `supabase_orders_schema.sql` trong VS Code
2. Copy **TOÀN BỘ** nội dung (Cmd/Ctrl + A, sau đó Cmd/Ctrl + C)
3. Paste vào SQL Editor trong Supabase
4. Click nút **"Run"** (hoặc nhấn Cmd/Ctrl + Enter)

## Bước 3: Kiểm tra

Sau khi chạy thành công, vào **Table Editor** và kiểm tra:

### ✅ Bảng `orders` đã được tạo với các cột:
- id (UUID)
- customer_name
- customer_phone
- customer_address
- customer_city
- customer_district
- customer_ward
- note
- subtotal
- shipping_fee
- total
- status
- created_at
- updated_at

### ✅ Bảng `order_items` đã được tạo với các cột:
- id (UUID)
- order_id (foreign key → orders.id)
- product_id
- product_name
- product_color
- product_image
- quantity
- price
- subtotal
- created_at

### ✅ RLS Policies đã được tạo:
- Anonymous users có thể INSERT và SELECT orders
- Anonymous users có thể INSERT và SELECT order_items

## Bước 4: Test

1. Vào trang web của bạn: http://localhost:3000
2. Thêm sản phẩm vào giỏ hàng
3. Click "Thanh toán"
4. Điền thông tin và click "Đặt hàng"
5. Kiểm tra trong Supabase Table Editor → `orders` để xem dữ liệu mới

## ⚠️ Nếu gặp lỗi

### Lỗi: "Could not find the table 'public.orders'"
➡️ Bạn chưa chạy SQL script. Quay lại Bước 2.

### Lỗi: "permission denied for table orders"
➡️ Kiểm tra RLS policies đã được tạo chưa. Chạy lại toàn bộ SQL script.

### Lỗi: "duplicate key value violates unique constraint"
➡️ Normal, nghĩa là bảng đã tồn tại. Bạn có thể tiếp tục sử dụng.

## 🎉 Done!

Sau khi setup xong, hệ thống sẽ tự động lưu đơn hàng vào Supabase khi người dùng đặt hàng.
