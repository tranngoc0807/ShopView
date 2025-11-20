'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      // Calculate date 10 days ago
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const tenDaysAgoISO = tenDaysAgo.toISOString();

      // Fetch products created in the last 10 days
      const { data } = await supabase
        .from('products')
        .select('*')
        .gte('created_at', tenDaysAgoISO)
        .order('created_at', { ascending: false });

      const productList: Product[] = data || [];
      setProducts(productList);
      setFilteredProducts(productList);
      setIsLoading(false);
    }

    fetchProducts();
  }, [supabase]);

  const handleSearchChange = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    const sorted = [...filteredProducts];
    
    switch (value) {
      case 'newest':
        sorted.sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        break;
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header onSearchChange={handleSearchChange} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm mới...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onSearchChange={handleSearchChange} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold mb-4">
            ✨ MỚI VỀ
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sản Phẩm Mới Về
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm mới nhất vừa về trong 10 ngày qua. 
            Cập nhật xu hướng thời trang mới nhất cho bạn.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-linear-to-r from-red-50 to-pink-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl">🎉</div>
            <div className="text-center">
              <p className="text-gray-900 font-semibold">
                {filteredProducts.length} sản phẩm mới trong 10 ngày qua
              </p>
              <p className="text-sm text-gray-600">
                Cập nhật: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> sản phẩm
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Sắp xếp:</label>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="name-az">Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">�</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Thử tìm kiếm với từ khóa khác.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Khám phá tất cả sản phẩm
            </Link>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Miễn phí vận chuyển
            </h3>
            <p className="text-sm text-gray-600">
              Cho đơn hàng trên 500.000₫
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Đổi trả dễ dàng
            </h3>
            <p className="text-sm text-gray-600">
              Trong vòng 30 ngày
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Chất lượng đảm bảo
            </h3>
            <p className="text-sm text-gray-600">
              100% chính hãng
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
