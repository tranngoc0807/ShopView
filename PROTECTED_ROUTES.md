# 🔐 Hướng dẫn: Trang Protected Routes & Authentication

## Tổng quan

Website hiện tại đã được cấu hình với **Protected Routes** - một số trang yêu cầu người dùng phải đăng nhập mới có thể truy cập.

## Cách hoạt động

### 1. **Public Routes** (Không cần đăng nhập)
Người dùng có thể tự do truy cập:
- ✅ Trang chủ `/`
- ✅ Xem sản phẩm
- ✅ Xem danh mục
- ✅ Trang đăng ký `/auth/register`
- ✅ Trang đăng nhập `/auth/login`

### 2. **Protected Routes** (Yêu cầu đăng nhập)
Các trang sau CHỈ dành cho người dùng đã đăng nhập:
- 🔒 `/account` - Trang tài khoản cá nhân
- 🔒 `/account/orders` - Danh sách đơn hàng
- 🔒 `/checkout` - Thanh toán
- 🔒 `/orders` - Quản lý đơn hàng

**Điều gì sẽ xảy ra nếu chưa đăng nhập?**
- Tự động redirect đến `/auth/login`
- Hiển thị thông báo yêu cầu đăng nhập
- Sau khi đăng nhập thành công → Quay lại trang ban đầu

## Test Protected Routes

### Bước 1: Kiểm tra khi CHƯA đăng nhập

1. Mở trình duyệt ở chế độ ẩn danh (Incognito)
2. Truy cập: http://localhost:3000/account
3. **Kết quả:** Tự động chuyển đến http://localhost:3000/auth/login?redirect=/account
4. Bạn sẽ thấy thông báo màu vàng: "Yêu cầu đăng nhập: Bạn cần đăng nhập để truy cập /account"

### Bước 2: Đăng nhập

1. Nhập email và password
2. Click "Đăng nhập"
3. **Kết quả:** Tự động quay lại `/account`

### Bước 3: Kiểm tra khi ĐÃ đăng nhập

1. Click vào avatar/tên user ở góc phải header
2. Menu dropdown hiển thị:
   - Email của bạn
   - Tài khoản của tôi
   - Đơn hàng
   - Đăng xuất

## Cấu trúc kỹ thuật

### Middleware Protection

File: `utils/supabase/middleware.ts`

```typescript
const protectedRoutes = [
  '/account',
  '/checkout',
  '/orders',
];
```

**Cách thêm route mới cần bảo vệ:**
```typescript
const protectedRoutes = [
  '/account',
  '/checkout',
  '/orders',
  '/wishlist',      // Thêm mới
  '/profile',       // Thêm mới
];
```

### Auto Redirect After Login

File: `components/auth/LoginForm.tsx`

```typescript
// Lấy URL redirect từ query params
const redirectTo = searchParams.get('redirect') || '/';

// Sau khi login thành công, quay về trang ban đầu
router.push(redirectTo);
```

### Auth State in Header

File: `components/Header.tsx`

```typescript
const [user, setUser] = useState<User | null>(null);

// Lắng nghe thay đổi authentication state
supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null);
});
```

## Demo Pages

### Trang Account (`/account`)
- Hiển thị thông tin user
- Avatar với chữ cái đầu
- Quick actions: Đơn hàng, Yêu thích, Cài đặt
- Badge "Trang được bảo vệ"

### Trang Orders (`/account/orders`)
- Danh sách đơn hàng (hiện đang dùng data mẫu)
- Trạng thái đơn hàng
- Link quay lại trang account

## Tùy chỉnh Protected Routes

### Option 1: Bảo vệ thêm các routes
Thêm vào `protectedRoutes` array:

```typescript
const protectedRoutes = [
  '/account',
  '/checkout',
  '/orders',
  '/wishlist',           // Wishlist
  '/cart',               // Giỏ hàng (nếu muốn)
  '/product/*/review',   // Viết review
];
```

### Option 2: Bảo vệ cả trang chủ (yêu cầu login cho toàn site)

```typescript
// Nếu muốn bắt buộc đăng nhập cho mọi trang
if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
  // Redirect tất cả trang không phải /auth
  const url = request.nextUrl.clone();
  url.pathname = '/auth/login';
  return NextResponse.redirect(url);
}
```

### Option 3: Cho phép xem sản phẩm nhưng không cho thêm giỏ hàng

Trong component AddToCart:
```typescript
const handleAddToCart = () => {
  if (!user) {
    router.push('/auth/login?redirect=' + window.location.pathname);
    return;
  }
  // Logic thêm vào giỏ hàng
};
```

## Flow chart đăng nhập

```
Người dùng truy cập /account
         ↓
   [Middleware kiểm tra]
         ↓
  ┌──────┴──────┐
  │ Đã đăng nhập? │
  └──────┬──────┘
    Yes  │  No
    ↓    │    ↓
[/account] │ [Redirect → /auth/login?redirect=/account]
           │         ↓
           │   [Hiển thị form login + thông báo]
           │         ↓
           │   [User đăng nhập]
           │         ↓
           └─→ [Redirect về /account]
```

## Các trường hợp đặc biệt

### 1. User đã login cố vào trang /auth/login
→ Tự động redirect về `/` (trang chủ)

### 2. User đã login cố vào trang /auth/register
→ Tự động redirect về `/` (trang chủ)

### 3. User logout
→ Session bị xóa
→ Redirect về `/`
→ Nếu cố truy cập protected route → redirect đến login

## Testing Checklist

- [ ] Truy cập `/account` khi chưa đăng nhập → Redirect đến login
- [ ] Đăng nhập thành công → Quay lại `/account`
- [ ] Click "Tài khoản của tôi" trong Header → Vào được trang account
- [ ] Click "Đơn hàng" trong dropdown → Vào được trang orders
- [ ] Đăng xuất → Avatar biến mất, hiện nút "Đăng nhập"
- [ ] Sau khi logout, cố vào `/account` → Redirect đến login
- [ ] User đã login vào `/auth/login` → Redirect về trang chủ

## Troubleshooting

### Vẫn vào được protected route khi chưa login?
1. Kiểm tra middleware.ts có được apply đúng không
2. Restart dev server
3. Clear browser cache và cookies
4. Kiểm tra `.env.local` có đúng Supabase keys

### Bị redirect loop?
- Kiểm tra logic trong `utils/supabase/middleware.ts`
- Đảm bảo `/auth/*` không bị protect

### Sau login không redirect về trang ban đầu?
- Kiểm tra searchParams trong LoginForm
- Xem URL có chứa `?redirect=` không

## Kết luận

✅ Trang chủ và xem sản phẩm: **PUBLIC** (không cần login)
✅ Trang account, orders, checkout: **PROTECTED** (cần login)
✅ Tự động redirect và quay lại trang ban đầu sau login
✅ Thông báo rõ ràng khi cần đăng nhập

---

**Câu hỏi thường gặp:**

**Q: Làm sao để bảo vệ thêm route khác?**
A: Thêm vào array `protectedRoutes` trong `utils/supabase/middleware.ts`

**Q: Có thể bắt buộc login cho toàn bộ site không?**
A: Có, sửa logic trong middleware để redirect tất cả routes trừ `/auth/*`

**Q: Làm sao biết user đã login chưa?**
A: Check `user` state trong Header component hoặc dùng `supabase.auth.getUser()`
