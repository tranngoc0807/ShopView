import { Category } from '@/types/product';
import CategoryCard from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Danh mục sản phẩm
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Khám phá những bộ sưu tập được yêu thích nhất
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
