import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product details from Supabase
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // If product not found, show 404
  if (error || !product) {
    notFound();
  }

  const imageUrl = product.image_url || product.image;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            {imageUrl ? (
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 rounded-lg">
                <div className="text-gray-400 text-center p-8">
                  <div className="text-9xl mb-4">👗</div>
                  <div className="text-lg">{product.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {product.gender && (
                <p className="text-sm text-gray-500 mb-4">
                  Danh mục: <span className="capitalize">{product.gender}</span>
                  {product.age_group && ` • ${product.age_group}`}
                </p>
              )}

              <p className="text-3xl font-bold text-gray-900">
                {product.price.toLocaleString("vi-VN")}₫
              </p>
            </div>

            {/* Product Actions (Colors, Description, Add to Cart) */}
            <ProductActions product={product} />

            {/* Product Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-gray-900">
                      Thông tin giao hàng
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm">
                    Giao hàng miễn phí cho đơn hàng trên 1.000.000₫. Thời gian
                    giao hàng từ 2-5 ngày làm việc.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-gray-900">
                      Chính sách đổi trả
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm">
                    Đổi trả miễn phí trong vòng 30 ngày nếu sản phẩm còn nguyên
                    tem mác, chưa qua sử dụng.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-gray-900">
                      Hướng dẫn bảo quản
                    </span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm">
                    Giặt máy ở nhiệt độ thấp. Không sử dụng chất tẩy. Phơi khô
                    tự nhiên. Là ở nhiệt độ thấp.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Sản phẩm tương tự
          </h2>
          <p className="text-gray-600 mb-4">
            Khám phá thêm những sản phẩm khác trong cùng danh mục
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
