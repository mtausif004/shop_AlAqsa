import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    estimatedDeliveryFee,
    estimatedGrandTotal
  } = useCart();
  const { navigate } = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-800">আপনার কার্ট খালি</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          আমাদের মুখরোচক বার্মিজ আচার, চাটনি, মিষ্টি তেঁতুল অথবা রূপচর্চার পণ্য কার্টে যোগ করে অর্ডার করুন।
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-md"
        >
          কেনাকাটা শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858]">
          শপিং কার্ট ({items.length} টি পণ্য)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>কার্ট খালি করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 divide-y divide-stone-100">
          {items.map((item) => {
            const effectivePrice = Math.max(0, item.product.price - item.product.discount);
            const lineTotal = effectivePrice * item.quantity;
            return (
              <div key={item.product.productId} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={item.product.images?.[0] || ''}
                  alt={item.product.bengaliName}
                  className="w-20 h-20 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3
                    onClick={() => navigate(`/product/${item.product.productId}`)}
                    className="font-bold text-sm sm:text-base text-stone-800 hover:text-[#6B352A] cursor-pointer transition leading-snug"
                  >
                    {item.product.bengaliName}
                  </h3>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {item.product.brand} • {item.product.weight} {item.product.unit}
                  </div>
                  <div className="text-xs font-bold text-[#6B352A] mt-1">
                    একক মূল্য: ৳{effectivePrice}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                      className="p-2 hover:bg-stone-200 text-stone-600 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      className="p-2 hover:bg-stone-200 text-stone-600 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-extrabold text-stone-800 min-w-[70px] text-right">
                    ৳{lineTotal}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.productId)}
                    className="text-stone-400 hover:text-red-600 p-1.5 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2F4858] border-b border-stone-100 pb-3">
              অর্ডারের সারসংক্ষেপ
            </h3>

            {/* Delivery Zone Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B352A]" />
                ডেলিভারি এলাকা:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('cox_bazar')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition ${
                    deliveryZone === 'cox_bazar'
                      ? 'bg-[#6B352A] text-[#FFF1A6] border-[#6B352A]'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  কক্সবাজার সদর
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside_cox')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition ${
                    deliveryZone === 'outside_cox'
                      ? 'bg-[#6B352A] text-[#FFF1A6] border-[#6B352A]'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  কক্সবাজারের বাইরে
                </button>
              </div>
            </div>

            {/* Pricing details */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>পণ্য মূল্য (সাবটোটাল):</span>
                <span className="font-bold text-stone-800">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>আনুমানিক ডেলিভারি চার্জ:</span>
                <span className={`font-bold ${estimatedDeliveryFee === 0 ? 'text-emerald-700' : 'text-stone-800'}`}>
                  {estimatedDeliveryFee === 0 ? 'ফ্রি (FREE)' : `৳${estimatedDeliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#6B352A] pt-3 border-t border-stone-200">
                <span>সর্বমোট প্রদেয়:</span>
                <span>৳{estimatedGrandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <span>চেকআউট পেজে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/60 text-xs text-stone-600 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>আমরা শতভাগ খাঁটি পণ্য ও নিরাপদ ক্যাশ অন ডেলিভারি নিশ্চিত করি।</span>
          </div>
        </div>
      </div>
    </div>
  );
};
