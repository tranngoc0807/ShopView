# Hướng dẫn thiết lập Database cho Orders

## Bước 1: Tạo bảng trong Supabase

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** (biểu tượng database bên trái)
4. Copy toàn bộ nội dung file `supabase_orders_schema.sql` và paste vào SQL Editor
5. Nhấn **Run** để thực thi

## Bước 2: Kiểm tra bảng đã tạo

Vào **Table Editor** để kiểm tra 2 bảng đã được tạo:

### Bảng `orders`
Lưu thông tin đơn hàng chính:
- `id` (UUID): Mã đơn hàng duy nhất
- `customer_name` (TEXT): Tên khách hàng
- `customer_phone` (TEXT): Số điện thoại
- `customer_address` (TEXT): Địa chỉ
- `customer_city` (TEXT): Thành phố
- `customer_district` (TEXT): Quận/Huyện
- `customer_ward` (TEXT): Phường/Xã
- `note` (TEXT): Ghi chú đơn hàng
- `subtotal` (DECIMAL): Tạm tính
- `shipping_fee` (DECIMAL): Phí vận chuyển
- `total` (DECIMAL): Tổng tiền
- `status` (TEXT): Trạng thái (pending, processing, completed, cancelled)
- `created_at` (TIMESTAMP): Thời gian tạo
- `updated_at` (TIMESTAMP): Thời gian cập nhật

### Bảng `order_items`
Lưu chi tiết sản phẩm trong đơn hàng:
- `id` (UUID): ID duy nhất
- `order_id` (UUID): Liên kết với bảng orders
- `product_id` (UUID): ID sản phẩm
- `product_name` (TEXT): Tên sản phẩm
- `product_color` (TEXT): Màu sắc
- `product_image` (TEXT): Link ảnh
- `quantity` (INTEGER): Số lượng
- `price` (DECIMAL): Giá
- `subtotal` (DECIMAL): Tổng tiền sản phẩm
- `created_at` (TIMESTAMP): Thời gian tạo

## Bước 3: Kiểm tra Row Level Security (RLS)

Các policy đã được thiết lập:
- ✅ Anonymous users có thể tạo đơn hàng (INSERT)
- ✅ Anonymous users có thể xem đơn hàng (SELECT)
- ✅ Authenticated users có thể xem đơn hàng của mình

## Bước 4: Test chức năng

1. Thêm sản phẩm vào giỏ hàng
2. Vào trang Checkout
3. Điền thông tin khách hàng
4. Nhấn "Đặt hàng"
5. Kiểm tra trong Supabase Table Editor xem dữ liệu đã được lưu chưa

## Luồng hoạt động

1. User điền form và nhấn "Đặt hàng"
2. System validate form
3. Tạo record trong bảng `orders`
4. Tạo các record trong bảng `order_items` (liên kết với order_id)
5. Clear giỏ hàng
6. Redirect đến `/order-success?orderId=xxx`
7. Trang order-success fetch thông tin đơn hàng từ Supabase và hiển thị

## Cấu trúc dữ liệu mẫu

### Order
\`\`\`json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "customer_name": "Nguyễn Văn A",
  "customer_phone": "0912345678",
  "customer_address": "123 Đường ABC",
  "customer_city": "TP. Hồ Chí Minh",
  "customer_district": "Quận 1",
  "customer_ward": "Phường Bến Nghé",
  "note": "Giao giờ hành chính",
  "subtotal": 500000,
  "shipping_fee": 0,
  "total": 500000,
  "status": "pending",
  "created_at": "2025-11-19T10:30:00Z",
  "updated_at": "2025-11-19T10:30:00Z"
}
\`\`\`

### Order Items
\`\`\`json
[
  {
    "id": "item-uuid-1",
    "order_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "product_id": "product-uuid-1",
    "product_name": "Áo sơ mi trắng",
    "product_color": "Trắng",
    "product_image": "https://...jpg",
    "quantity": 2,
    "price": 250000,
    "subtotal": 500000
  }
]
\`\`\`

## Troubleshooting

### Lỗi: "permission denied for table orders"
- Kiểm tra RLS policies đã được tạo chưa
- Đảm bảo `anon` role có quyền INSERT và SELECT

### Lỗi: "violates foreign key constraint"
- Kiểm tra order_id trong order_items phải tồn tại trong bảng orders

### Dữ liệu không hiển thị trên trang order-success
- Kiểm tra URL có chứa `?orderId=xxx` không
- Kiểm tra console log để xem lỗi từ Supabase
- Verify RLS policy cho SELECT operation

## Nâng cấp trong tương lai

- [ ] Thêm user_id để liên kết đơn hàng với tài khoản
- [ ] Thêm payment_method (COD, banking, etc.)
- [ ] Thêm tracking_number cho vận chuyển
- [ ] Tạo webhook để gửi email xác nhận
- [ ] Tích hợp thanh toán online
- [ ] Admin dashboard để quản lý đơn hàng
