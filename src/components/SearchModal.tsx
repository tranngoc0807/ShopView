"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Function to create URL slug from product name with ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .normalize("NFD") // Normalize Unicode
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d") // Replace đ with d
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple hyphens
  
  return `${nameSlug}-${id}`; // Add ID at the end for uniqueness
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Search products whenever query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      const { data } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchQuery}%`)
        .limit(10);

      setSearchResults(data || []);
      setIsLoading(false);
    };

    const delaySearch = setTimeout(() => {
      searchProducts();
    }, 300); // Debounce 300ms

    return () => clearTimeout(delaySearch);
  }, [searchQuery, supabase]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-900"></div>
              <p className="text-gray-500 mt-2">Đang tìm kiếm...</p>
            </div>
          ) : searchQuery.trim().length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>Nhập ít nhất 2 ký tự để tìm kiếm</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((product) => {
                const slug = createSlug(product.name, String(product.id));
                return (
                  <Link
                    key={product.id}
                    href={`/product/${slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                  >
                  {/* Product Image */}
                  <div className="w-16 h-16 relative rounded bg-gray-100 shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">
                        👕
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {product.gender} • ID: {product.id}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {product.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">😔</div>
              <p className="font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        {searchResults.length > 0 && (
          <div className="p-3 bg-gray-50 border-t text-center text-xs text-gray-500">
            Nhấn Enter hoặc click vào sản phẩm để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
}
