import Link from 'next/link';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="text-9xl mb-8">😔</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-8">
            Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link 
            href="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Quay về trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
