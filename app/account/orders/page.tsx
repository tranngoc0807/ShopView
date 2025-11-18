import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Sample orders data - in real app, fetch from database
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 2990000,
      status: 'Đã giao',
      items: 2,
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      total: 1590000,
      status: 'Đang giao',
      items: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/account" className="text-red-600 hover:text-red-700 flex items-center gap-2 mb-4">
              ← Quay lại tài khoản
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Theo dõi và quản lý đơn hàng của bạn
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Chưa có đơn hàng
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
              </p>
              <Link
                href="/"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Đơn hàng #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Đặt ngày: {new Date(order.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Đã giao' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items} sản phẩm
                      </p>
                      <p className="font-bold text-gray-900">
                        {order.total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
