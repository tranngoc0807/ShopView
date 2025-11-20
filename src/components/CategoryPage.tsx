'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ProductCard from '@/src/components/ProductCard';
import { Product } from '@/types/product';

interface CategoryPageProps {
  gender: 'nam' | 'nu' | 'kids';
  title: string;
  description: string;
}

export default function CategoryPage({ gender, title, description }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`gender.eq.${gender},gender.eq.unisex`)
        .order('created_at', { ascending: false });

      const productList: Product[] = data || [];
      setProducts(productList);
      setFilteredProducts(productList);
      setIsLoading(false);
    }

    fetchProducts();
  }, [gender, supabase]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Filters Section (Optional - có thể mở rộng sau) */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> sản phẩm
          </p>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Sắp xếp:</label>
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
            <p className="text-gray-600">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
