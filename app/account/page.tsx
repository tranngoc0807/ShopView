import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // This should never happen due to middleware, but just in case
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tài khoản của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân và đơn hàng của bạn
            </p>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin cá nhân
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'Người dùng'}
                  </p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Tham gia: {new Date(user.created_at || '').toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/account/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-bold text-gray-900 mb-1">Đơn hàng</h3>
              <p className="text-sm text-gray-600">Xem đơn hàng của bạn</p>
            </Link>

            <Link
              href="/account/wishlist"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="font-bold text-gray-900 mb-1">Yêu thích</h3>
              <p className="text-sm text-gray-600">Sản phẩm đã lưu</p>
            </Link>

            <Link
              href="/account/settings"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="font-bold text-gray-900 mb-1">Cài đặt</h3>
              <p className="text-sm text-gray-600">Quản lý tài khoản</p>
            </Link>
          </div>

          {/* Protected Info Notice */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-bold text-green-900 mb-1">
                  Trang được bảo vệ
                </h3>
                <p className="text-green-800 text-sm">
                  Bạn đang xem trang này vì đã đăng nhập. Người dùng chưa đăng nhập 
                  sẽ tự động được chuyển đến trang đăng nhập khi truy cập trang này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
