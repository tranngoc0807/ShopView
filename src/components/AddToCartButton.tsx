'use client';

import { useCart } from '@/src/contexts/CartContext';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image_url?: string;
  };
  selectedColor?: string;
}

export default function AddToCartButton({ product, selectedColor }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      color: selectedColor,
    });

    // Show feedback animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="mt-auto">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full py-4 px-8 rounded-lg font-semibold transition mb-3 ${
          isAdding
            ? 'bg-green-600 text-white'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đã thêm vào giỏ!
          </span>
        ) : (
          'Thêm vào giỏ hàng'
        )}
      </button>
    </div>
  );
}
