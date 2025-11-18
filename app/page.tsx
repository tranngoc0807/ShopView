import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductGrid from '@/components/ProductGrid';
import CategoryGrid from '@/components/CategoryGrid';
import { Product, Category } from '@/types/product';

// Sample data
const newProducts: Product[] = [
  { id: '1', name: 'Váy Cord Evelyn', price: 1990000, image: '', colors: 2, category: 'dresses', isNew: true },
  { id: '2', name: 'Áo Jersey Trim Imi', price: 1290000, image: '', colors: 2, category: 'tops', isNew: true },
  { id: '3', name: 'Áo khoác dài Wax', price: 6590000, image: '', category: 'coats', isNew: true },
  { id: '4', name: 'Áo len Cashmere Lydia', price: 3990000, image: '', colors: 5, category: 'knitwear', isNew: true },
  { id: '5', name: 'Váy sơ mi dài tay Anita', price: 2990000, image: '', colors: 3, category: 'dresses', isNew: true },
  { id: '6', name: 'Áo Denim cổ nơ', price: 1990000, image: '', category: 'tops', isNew: true },
  { id: '7', name: 'Áo khoác Check Stirling', price: 3790000, image: '', colors: 2, category: 'coats', isNew: true },
  { id: '8', name: 'Áo hoodie Bouclé Raglan', price: 1990000, image: '', colors: 2, category: 'tops', isNew: true },
];

const categories: Category[] = [
  { id: '1', name: 'Áo len', image: '', link: '/collections/knitwear' },
  { id: '2', name: 'Áo khoác', image: '', link: '/collections/coats' },
  { id: '3', name: 'Đồ dự tiệc', image: '', link: '/collections/party' },
  { id: '4', name: 'Váy', image: '', link: '/collections/dresses' },
  { id: '5', name: 'Áo sơ mi', image: '', link: '/collections/tops' },
  { id: '6', name: 'Trẻ em', image: '', link: '/collections/kids' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroBanner />
        
        <ProductGrid title="Sản phẩm mới về" products={newProducts} />
        
        <CategoryGrid categories={categories} />
        
        {/* Editor's Picks Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Gợi ý của biên tập viên
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Những lựa chọn đặc biệt được tuyển chọn kỹ lưỡng
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pick 1 */}
              <div className="group relative overflow-hidden rounded-lg cursor-pointer">
                <div className="aspect-video bg-linear-to-br from-red-100 to-pink-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Bộ sưu tập Giáng sinh</h3>
                    <p className="text-gray-700">Từ tiệc tùng đến những buổi gói quà</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
              </div>
              
              {/* Pick 2 */}
              <div className="group relative overflow-hidden rounded-lg cursor-pointer">
                <div className="aspect-video bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Đồ len Alpine</h3>
                    <p className="text-gray-700">Áo len sang trọng cho mùa đông</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Sustainability Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mua tốt hơn. Mua ít hơn. Mặc nhiều hơn.
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              Chúng tôi cam kết tạo ra những sản phẩm bền vững, chất lượng cao để bạn có thể mặc lâu dài.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Xem mục tiêu bền vững của chúng tôi
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
