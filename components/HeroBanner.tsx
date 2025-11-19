import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-pink-50 to-blue-50">
        {/* Placeholder for hero image */}
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-rose-100 via-pink-50 to-teal-50">
          <div className="text-center z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              Bộ sưu tập mùa đông
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Khám phá phong cách của bạn
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
