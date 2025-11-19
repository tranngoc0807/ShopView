import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductGrid from '@/components/ProductGrid';
import CategoryGrid from '@/components/CategoryGrid';
import { Product, Category } from '@/types/product';
import { createClient } from '@/utils/supabase/server';

// Sample data for new products (you can also fetch this from Supabase)
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

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch products from Supabase
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  // Fetch unique genders for categories
  const { data: genderData, error: genderError } = await supabase
    .from('products')
    .select('gender');

  // Use products from Supabase or fallback to sample data
  const newProducts: Product[] = productsData || [];

  // Create categories array from products data
  let categories: Category[] = [];
  
  if (genderData && !genderError) {
    // Get unique genders to use as categories
    const uniqueGenders = [...new Set(genderData.map(p => p.gender).filter(Boolean))];
    
    // Map genders to readable category names
    const genderMap: Record<string, string> = {
      'nam': 'Nam',
      'nu': 'Nữ', 
      'nữ': 'Nữ',
      'kids': 'Trẻ em',
      'unisex': 'Unisex'
    };
    
    categories = uniqueGenders.map((gender, index) => ({
      id: String(index + 1),
      name: genderMap[gender.toLowerCase()] || gender,
      image: '',
      link: `/collections/${gender.toLowerCase()}`
    }));
  } else {
    // Fallback to default categories if fetch fails
    categories = [
      { id: '1', name: 'Áo len', image: '', link: '/collections/knitwear' },
      { id: '2', name: 'Áo khoác', image: '', link: '/collections/coats' },
      { id: '3', name: 'Đồ dự tiệc', image: '', link: '/collections/party' },
      { id: '4', name: 'Váy', image: '', link: '/collections/dresses' },
      { id: '5', name: 'Áo sơ mi', image: '', link: '/collections/tops' },
      { id: '6', name: 'Trẻ em', image: '', link: '/collections/kids' },
    ];
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroBanner />
        
        <ProductGrid title="Sản phẩm mới về" products={productsData || []} />
        
        {/* <CategoryGrid categories={categories} /> */}
        
        {/* Editor's Picks Section */}

        
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
