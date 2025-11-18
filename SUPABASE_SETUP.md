# 🔐 Hướng dẫn cấu hình Supabase Authentication

## Bước 1: Lấy thông tin Supabase

1. Truy cập [Supabase Dashboard](https://app.supabase.com/)
2. Chọn project của bạn
3. Vào **Settings** → **API**
4. Copy các thông tin sau:
   - **Project URL** (URL)
   - **anon/public** key (API Key)

## Bước 2: Cấu hình file .env.local

Mở file `.env.local` và thay thế bằng thông tin thực:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bước 3: Cấu hình Authentication trong Supabase

### 3.1 Bật Email Authentication

1. Vào **Authentication** → **Providers**
2. Bật **Email** provider
3. Tắt **Confirm email** nếu muốn test nhanh (hoặc giữ bật để bảo mật hơn)

### 3.2 Cấu hình Google OAuth (Tùy chọn)

1. Vào **Authentication** → **Providers**
2. Bật **Google** provider
3. Lấy Google OAuth credentials:
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo OAuth 2.0 Client ID
   - Thêm authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
4. Copy **Client ID** và **Client Secret** vào Supabase

### 3.3 Cấu hình Site URL & Redirect URLs

1. Vào **Authentication** → **URL Configuration**
2. Thêm URLs:
   - **Site URL**: `http://localhost:3000` (development)
   - **Redirect URLs**: 
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000
     ```

## Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Truy cập:
- Trang đăng ký: http://localhost:3000/auth/register
- Trang đăng nhập: http://localhost:3000/auth/login

## Các tính năng đã implement:

✅ **Đăng ký bằng Email/Password**
- Form validation
- Hiển thị lỗi
- Gửi email xác nhận

✅ **Đăng nhập bằng Email/Password**
- Remember me checkbox
- Link quên mật khẩu
- Redirect sau khi đăng nhập

✅ **Đăng nhập bằng Google OAuth**
- One-click sign in
- Auto redirect

✅ **User Menu trong Header**
- Hiển thị avatar & tên
- Dropdown menu
- Logout functionality

✅ **Protected Routes**
- Middleware tự động redirect
- Routes `/account/*` cần đăng nhập

✅ **Session Management**
- Auto refresh token
- Persistent login

## Cấu trúc file:

```
my-app/
├── .env.local                          # Supabase config
├── middleware.ts                       # Route protection
├── utils/supabase/
│   ├── client.ts                      # Client-side Supabase
│   ├── server.ts                      # Server-side Supabase
│   └── middleware.ts                  # Auth middleware
├── app/
│   └── auth/
│       ├── login/page.tsx            # Trang đăng nhập
│       ├── register/page.tsx         # Trang đăng ký
│       └── callback/route.ts         # OAuth callback
└── components/
    ├── Header.tsx                     # Header với user menu
    └── auth/
        ├── LoginForm.tsx             # Form đăng nhập
        └── RegisterForm.tsx          # Form đăng ký
```

## Testing:

### Test đăng ký:
1. Vào http://localhost:3000/auth/register
2. Điền thông tin
3. Kiểm tra email (nếu bật confirm email)
4. Click link xác nhận

### Test đăng nhập:
1. Vào http://localhost:3000/auth/login
2. Nhập email/password
3. Kiểm tra redirect về trang chủ
4. Kiểm tra user menu trong header

### Test Google OAuth:
1. Click "Đăng nhập với Google"
2. Chọn tài khoản Google
3. Kiểm tra redirect về trang chủ

## Troubleshooting:

### Lỗi "Invalid login credentials"
- Kiểm tra email/password đúng chưa
- Kiểm tra user đã được tạo trong Supabase Dashboard

### Lỗi "Email not confirmed"
- Vào Authentication → Users
- Click vào user và confirm manually

### Google OAuth không hoạt động
- Kiểm tra Redirect URIs trong Google Console
- Kiểm tra Client ID/Secret trong Supabase

### Session bị mất sau refresh
- Kiểm tra middleware.ts
- Kiểm tra cookies được set đúng

## Các bước tiếp theo:

1. **Trang quên mật khẩu** - `/auth/forgot-password`
2. **Trang đổi mật khẩu** - `/auth/reset-password`
3. **Trang tài khoản** - `/account`
4. **Trang đơn hàng** - `/account/orders`
5. **Email templates** - Customize email trong Supabase
6. **Profile update** - Cho phép user cập nhật thông tin
7. **Social login khác** - Facebook, GitHub, etc.

## Bảo mật:

- ✅ Middleware bảo vệ routes
- ✅ Server-side validation
- ✅ Secure cookie handling
- ✅ Token auto refresh
- ⚠️ Nên bật email confirmation cho production
- ⚠️ Nên thêm rate limiting
- ⚠️ Nên implement 2FA cho tài khoản quan trọng

---

Happy coding! 🚀
