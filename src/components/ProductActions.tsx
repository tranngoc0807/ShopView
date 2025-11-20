'use client';

import { useState } from 'react';
import ColorSelector from './ColorSelector';
import AddToCartButton from './AddToCartButton';

interface ProductActionsProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image_url?: string;
    colors?: string[];
    description?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );

  return (
    <>
      {/* Colors */}
      {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
        <ColorSelector colors={product.colors} onColorSelect={setSelectedColor} />
      )}

      {/* Description */}
      {product.description && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Add to Cart Button */}
      <AddToCartButton product={product} selectedColor={selectedColor} />
    </>
  );
}
