"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/contexts/CartContext";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, removeItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }


    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Vui lòng nhập tỉnh/thành phố";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }

    if (!formData.ward.trim()) {
      newErrors.ward = "Vui lòng nhập phường/xã";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    setIsProcessing(true);

    try {
      const supabase = createClient();
      const shippingFee = totalPrice >= 500000 ? 0 : 30000;
      const finalTotal = totalPrice + shippingFee;

      console.log("=== BẮT ĐẦU TẠO ĐơN HÀNG ===");
      console.log("Thông tin đơn hàng:", {
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        subtotal: totalPrice,
        shipping_fee: shippingFee,
        total: finalTotal,
      });

      // Tạo đơn hàng mới trong bảng orders
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_district: formData.district,
          customer_ward: formData.ward,
          note: formData.note,
          subtotal: totalPrice,
          shipping_fee: shippingFee,
          total: finalTotal,
          status: "pending", // pending, processing, completed, cancelled
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        console.error("❌ LỖI KHI TẠO ĐƠN HÀNG:", orderError);
        alert(`Có lỗi xảy ra khi đặt hàng: ${orderError.message}`);
        setIsProcessing(false);
        return;
      }

      console.log("✅ Đơn hàng đã được tạo:", order);
      console.log("Số lượng sản phẩm trong giỏ:", items.length);

      // Lưu chi tiết đơn hàng vào bảng order_items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_color: item.color || "",
        product_image: item.image_url || "",
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      console.log("Sản phẩm chuẩn bị lưu:", orderItems);

      const { data: insertedItems, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error("❌ LỖI KHI LƯU CHI TIẾT ĐƠN HÀNG:", itemsError);
        alert(`Lỗi lưu chi tiết: ${itemsError.message}`);
        // Vẫn cho phép tiếp tục vì đơn hàng chính đã được tạo
      } else {
        console.log("✅ Đã lưu chi tiết đơn hàng:", insertedItems);
      }

      console.log("=== HOÀN TẤT ĐẶT HÀNG ===");

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderId=${order.id}`);
    } catch (error) {
      console.error("❌ LỖI TỔNG QUÁT:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-gray-600 mb-8">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục thanh toán
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-sm p-6 space-y-6"
            >
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin liên hệ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0912345678"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Địa chỉ nhận hàng
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.ward ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Phường 1"
                      />
                      {errors.ward && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.ward}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.district ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Quận 1"
                      />
                      {errors.district && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="TP. Hồ Chí Minh"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng (tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Đơn hàng của bạn
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex gap-3">
                    <div className="w-16 h-16 relative rounded bg-gray-100 shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
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
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.color && (
                        <p className="text-xs text-gray-500">
                          Màu: {item.color}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        SL: {item.quantity}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-semibold text-gray-900">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.color || "")}
                        className="text-red-600 hover:text-red-800 text-xs"
                        title="Xóa sản phẩm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString("vi-VN")}₫`
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Mua thêm {(500000 - totalPrice).toLocaleString("vi-VN")}₫ để
                    được miễn phí vận chuyển
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-gray-900">
                    {finalTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đặt hàng"
                )}
              </button>

              <Link
                href="/"
                className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
