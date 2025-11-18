import { Category } from '@/types/product';
import Link from 'next/link';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.link} className="group relative overflow-hidden rounded-lg">
      <div className="aspect-4/5 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">
            {category.name === 'Áo len' && '🧶'}
            {category.name === 'Áo khoác' && '🧥'}
            {category.name === 'Váy' && '👗'}
            {category.name === 'Áo sơ mi' && '👔'}
            {category.name === 'Đồ dự tiệc' && '✨'}
            {category.name === 'Trẻ em' && '👶'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pb-8">
        <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          Xem thêm
        </span>
      </div>
    </Link>
  );
}
