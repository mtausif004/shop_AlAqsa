import React from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    estimatedDeliveryFee,
    estimatedGrandTotal,
    isOpen,
    setIsOpen
  } = useCart();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn no-print">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-[#6B352A] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FFF1A6]" />
            <h3 className="font-bold text-base">আপনার শপিং ব্যাগ ({items.length})</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-stone-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FFF1A6]/30 px-4 py-2 text-xs border-b border-amber-200 text-[#2F4858]">
          {deliveryZone === 'cox_bazar' ? (
            subtotal >= 1000 ? (
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                🎉 অভিনন্দন! কক্সবাজার সদরে আপনার জন্য ফ্রি ডেলিভারি!
              </span>
            ) : (
              <span>
                আর মাত্র <strong className="text-[#6B352A]">৳{1000 - subtotal}</strong> টাকার অর্ডারে কক্সবাজারে ফ্রি ডেলিভারি!
              </span>
            )
          ) : (
            subtotal >= 1500 ? (
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                🎉 অভিনন্দন! সারাদেশে আপনার জন্য ফ্রি হোম ডেলিভারি!
              </span>
            ) : (
              <span>
                আর মাত্র <strong className="text-[#6B352A]">৳{1500 - subtotal}</strong> টাকার অর্ডারে সারাদেশে ফ্রি ডেলিভারি!
              </span>
            )
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-stone-700">আপনার ব্যাগ খালি</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                আমাদের ঐতিহ্যবাহী বার্মিজ আচার, মিষ্টি তেঁতুল অথবা বালাচাও পছন্দ করে ব্যাগে যোগ করুন।
              </p>
              <button
                onClick={() => { setIsOpen(false); navigate('/'); }}
                className="mt-2 bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-5 py-2.5 rounded-full shadow hover:bg-[#52271E] transition"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            items.map(item => {
              const effectivePrice = Math.max(0, item.product.price - item.product.discount);
              const itemTotal = effectivePrice * item.quantity;
              return (
                <div key={item.product.productId} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.images?.[0] || ''}
                    alt={item.product.bengaliName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-stone-800 truncate">
                      {item.product.bengaliName}
                    </h5>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>৳{effectivePrice}</span>
                      {item.product.discount > 0 && (
                        <span className="line-through text-stone-400 text-[10px]">
                          ৳{item.product.price}
                        </span>
                      )}
                      <span>• {item.product.weight} {item.product.unit}</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#6B352A]">
                          ৳{itemTotal}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.productId)}
                          className="p-1 text-stone-400 hover:text-red-600 transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
            {/* Delivery Zone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B352A]" />
                ডেলিভারি এলাকা নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('cox_bazar')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition ${
                    deliveryZone === 'cox_bazar'
                      ? 'bg-[#6B352A] text-[#FFF1A6] font-bold border-[#6B352A]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  কক্সবাজার সদর
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside_cox')}
                  className={`py-1.5 px-2 rounded-lg border text-center transition ${
                    deliveryZone === 'outside_cox'
                      ? 'bg-[#6B352A] text-[#FFF1A6] font-bold border-[#6B352A]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  কক্সবাজারের বাইরে
                </button>
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
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
              <div className="flex justify-between text-sm font-extrabold text-[#6B352A] pt-1.5 border-t border-stone-200">
                <span>সর্বমোট প্রদেয়:</span>
                <span>৳{estimatedGrandTotal}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ক্যাশ অন ডেলিভারি ও নিরাপদ যাচাইকৃত অর্ডার</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
