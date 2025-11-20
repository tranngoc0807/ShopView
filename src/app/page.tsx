import ScrollHeader from '@/src/components/ScrollHeader';
import Footer from '@/src/components/Footer';
import HeroBanner from '@/src/components/HeroBanner';
import ProductGrid from '@/src/components/ProductGrid';
import CategoryGrid from '@/src/components/CategoryGrid';
import { Product, Category } from '@/types/product';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch products from Supabase
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  // Fetch unique genders for categories
  const { data: genderData, error: genderError } = await supabase
    .from('products')
    .select('gender');


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
  }
  return (
    <div className="min-h-screen">
      <ScrollHeader />
      <main>
        <HeroBanner />

        <ProductGrid title="Sản phẩm mới về" products={productsData || []} />
        
        {/* <CategoryGrid categories={categories} /> */}
        
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
