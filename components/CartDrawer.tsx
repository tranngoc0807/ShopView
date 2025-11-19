'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - transparent or light */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Giỏ hàng ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={onClose}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.color}`}
                  className="flex gap-4 pb-4 border-b"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-3xl">
                        👕
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {item.color && (
                      <p className="text-sm text-gray-500">Màu: {item.color}</p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                        className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id, item.color)}
                    className="text-gray-400 hover:text-red-600 transition p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="text-xl font-bold text-gray-900">
                {totalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>

            {/* Shipping Notice */}
            <p className="text-sm text-gray-500 text-center">
              Phí vận chuyển sẽ được tính ở bước thanh toán
            </p>

            {/* Checkout Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Thanh toán
              </Link>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
