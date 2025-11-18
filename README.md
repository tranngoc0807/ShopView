# Website Bán Quần Áo - Fashion Store

Website thương mại điện tử bán quần áo với giao diện hiện đại, lấy cảm hứng từ Boden.com.

## 🎨 Tính năng

- ✅ Giao diện responsive (mobile, tablet, desktop)
- ✅ Header với menu điều hướng, giỏ hàng, wishlist
- ✅ Hero banner với call-to-action
- ✅ Hiển thị sản phẩm dạng lưới (grid)
- ✅ Danh mục sản phẩm với hover effects
- ✅ Footer với newsletter signup và social media
- ✅ Thiết kế sạch đẹp, chuyên nghiệp

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Chạy production server
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang web.

## 📁 Cấu trúc dự án

```
my-app/
├── app/
│   ├── page.tsx          # Trang chủ
│   ├── layout.tsx        # Layout chính
│   └── globals.css       # CSS toàn cục
├── components/
│   ├── Header.tsx        # Component header
│   ├── Footer.tsx        # Component footer
│   ├── HeroBanner.tsx    # Banner chính
│   ├── ProductCard.tsx   # Card sản phẩm
│   ├── ProductGrid.tsx   # Lưới sản phẩm
│   ├── CategoryCard.tsx  # Card danh mục
│   └── CategoryGrid.tsx  # Lưới danh mục
├── types/
│   └── product.ts        # TypeScript types
└── public/               # Static files
```

## 🛠️ Công nghệ sử dụng

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React 19** - UI library

## 📝 Tùy chỉnh

### Thêm sản phẩm mới

Chỉnh sửa file `app/page.tsx` và cập nhật mảng `newProducts`:

```typescript
const newProducts: Product[] = [
  {
    id: '1',
    name: 'Tên sản phẩm',
    price: 1990000,
    image: '/path/to/image.jpg',
    colors: 2,
    category: 'category-name',
    isNew: true
  },
  // Thêm sản phẩm khác...
];
```

### Thêm danh mục

Cập nhật mảng `categories` trong `app/page.tsx`:

```typescript
const categories: Category[] = [
  {
    id: '1',
    name: 'Tên danh mục',
    image: '/path/to/image.jpg',
    link: '/collections/category-slug'
  },
  // Thêm danh mục khác...
];
```

### Thay đổi màu sắc

Chỉnh sửa các class Tailwind CSS trong components:
- `bg-red-600` - Màu chủ đạo (đỏ)
- `text-gray-900` - Màu chữ chính
- `bg-gray-50` - Màu nền nhẹ

## 🎯 Các bước tiếp theo

1. **Thêm hình ảnh thật** - Thay thế các placeholder bằng hình ảnh sản phẩm thật
2. **Tạo trang chi tiết sản phẩm** - Thêm route `/product/[id]`
3. **Tạo trang danh mục** - Thêm các route `/collections/[category]`
4. **Thêm giỏ hàng** - Implement shopping cart functionality
5. **Tích hợp API** - Kết nối với backend để lấy dữ liệu động
6. **Thêm tìm kiếm** - Implement search functionality
7. **Thêm filter & sort** - Lọc và sắp xếp sản phẩm
8. **Authentication** - Đăng nhập/đăng ký người dùng

## 📸 Screenshots

Truy cập http://localhost:3000 để xem giao diện!

## 📞 Hỗ trợ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ hoặc tạo issue.

---

Được phát triển với ❤️ bằng Next.js & Tailwind CSS

