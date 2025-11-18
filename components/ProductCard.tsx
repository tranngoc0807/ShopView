import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100">
        {/* Placeholder for product image */}
        <div className="aspect-3/4 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
          <div className="text-gray-400 text-center p-4">
            <div className="text-6xl mb-2">👗</div>
            <div className="text-sm">{product.name}</div>
          </div>
        </div>
        
        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
            MỚI
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition mb-1">
          {product.name}
        </h3>
        <p className="text-gray-900 font-semibold">
          {product.price.toLocaleString('vi-VN')}₫
        </p>
        {product.colors && product.colors > 1 && (
          <p className="text-sm text-gray-500">{product.colors} màu</p>
        )}
      </div>
    </Link>
  );
}
