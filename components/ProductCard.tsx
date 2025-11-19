import { Product } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Support both 'image' and 'image_url' fields
  const imageUrl = product.image_url || product.image;
  console.log('Product Image URL:', imageUrl);
  
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100">
        {/* Product image */}
        {imageUrl ? (
          <div className="aspect-3/4 relative">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        ) : (
          // Placeholder if no image
          <div className="aspect-3/4 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <div className="text-gray-400 text-center p-4">
              <div className="text-6xl mb-2">👗</div>
              <div className="text-sm">{product.name}</div>
            </div>
          </div>
        )}
        
        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
            MỚI
          </div>
        )}

      </div>

      <div>
        <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition mb-1">
          {product.name}
        </h3>
        <p className="text-gray-900 font-semibold">
          {product.price.toLocaleString('vi-VN')}₫
        </p>
        {product.colors && (
          <p className="text-sm text-gray-500">
            {Array.isArray(product.colors) 
              ? `${product.colors.length} màu` 
              : product.colors > 1 
                ? `${product.colors} màu` 
                : null}
          </p>
        )}
      </div>
    </Link>
  );
}
