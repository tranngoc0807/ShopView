import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  title: string;
  products: unknown;
}

export default function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.isArray(products) && products.map((product  ) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
