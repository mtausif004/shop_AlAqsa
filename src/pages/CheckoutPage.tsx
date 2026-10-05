import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { createOrder, validateCoupon } from '../services/api';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  Phone,
  FileText,
  MapPin,
  CreditCard,
  Banknote
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, clearCart, subtotal, deliveryZone, setDeliveryZone } = useCart();
  const { navigate } = useRouter();

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState("Cox's Bazar");
  const [area, setArea] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bKash' | 'Nagad'>('COD');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Bangladesh districts list
  const popularDistricts = [
    "Cox's Bazar", 'Dhaka', 'Chattogram', 'Sylhet', 'Cumilla', 'Gazipur',
    'Narayanganj', 'Khulna', 'Rajshahi', 'Barishal', 'Rangpur', 'Mymensingh',
    'Feni', 'Noakhali', 'Brahmanbaria', 'Bogura', 'Jessore'
  ];

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (res.valid) {
        setAppliedCoupon({ code: res.discount > 0 ? couponCode.trim().toUpperCase() : '', discount: res.discount, message: res.message });
      } else {
        setCouponError(res.message);
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError('কুপন যাচাইয়ে সমস্যা হয়েছে');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    if (d.toLowerCase().includes('cox') || d.includes('কক্সবাজার')) {
      setDeliveryZone('cox_bazar');
    } else {
      setDeliveryZone('outside_cox');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    // Validation
    if (!name.trim()) {
      setOrderError('দয়া করে আপনার নাম লিখুন।');
      return;
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setOrderError('দয়া করে সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর লিখুন (যেমন: 01861007427)।');
      return;
    }

    if (!address.trim()) {
      setOrderError('দয়া করে পূর্ণাঙ্গ ডেলিভারি ঠিকানা লিখুন।');
      return;
    }

    if (items.length === 0) {
      setOrderError('আপনার কার্ট খালি। পণ্য যোগ করে অর্ডার করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          altPhone: altPhone.trim() ? altPhone.replace(/[\s\-\(\)]/g, '') : undefined,
          address: address.trim(),
          district,
          area: area.trim(),
          deliveryZone,
          note: note.trim(),
          paymentMethod
        },
        items: items.map((i) => ({
          productId: i.product.productId,
          quantity: i.quantity
        })),
        couponCode: appliedCoupon?.code
      };

      const result = await createOrder(orderPayload);

      if (result.success) {
        setCompletedOrder({
          orderId: result.orderId,
          invoiceId: result.invoiceId,
          customerPhone: cleanPhone,
          ...result.data
        });
        clearCart();
      } else {
        setOrderError(result.error || 'অর্ডার সম্পন্ন করা সম্ভব হয়নি। দয়া করে পুনরায় চেষ্টা করুন।');
      }
    } catch (err: any) {
      setOrderError(err.message || 'সার্ভারে সাময়িক সমস্যা দেখা দিয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#FFF1A6] text-[#6B352A] text-xs font-bold px-3 py-1 rounded-full">
              অর্ডার সফল হয়েছে!
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F4858]">
              ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              আমাদের কাস্টমার কেয়ার টিম শীঘ্রই ফোন করে অর্ডার কনফার্ম করবে।
            </p>
          </div>

          {/* Order Snapshot Box */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-stone-200/80 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">অর্ডার আইডি:</span>
              <strong className="font-mono text-[#6B352A] text-sm">{completedOrder.orderId}</strong>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">ইনভয়েস নম্বর:</span>
              <strong className="font-mono text-stone-800">{completedOrder.invoiceId}</strong>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">গ্রাহকের নাম:</span>
              <span className="font-bold text-stone-800">{name}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">ফোন নম্বর:</span>
              <span className="font-bold text-stone-800">{completedOrder.customerPhone}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-500">পেমেন্ট মেথড:</span>
              <span className="font-bold text-stone-800">{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#6B352A] pt-1">
              <span>সর্বমোট প্রদেয়:</span>
              <span>৳{completedOrder.grandTotal}</span>
            </div>
          </div>

          {paymentMethod !== 'COD' && (
            <div className="bg-amber-50 p-4 rounded-xl text-xs text-amber-900 border border-amber-200 space-y-1 text-left">
              <p className="font-bold">
                💳 {paymentMethod} পেমেন্ট সংক্রান্ত তথ্য:
              </p>
              <p>
                আমাদের অফিসিয়াল <strong>{paymentMethod}</strong> নম্বর: <strong className="font-mono text-[#6B352A]">01861007427</strong> (ব্যক্তিগত/মার্চেন্ট)। পেমেন্ট রেফারেন্সে আপনার অর্ডার আইডি <strong>{completedOrder.orderId}</strong> উল্লেখ করুন।
              </p>
            </div>
          )}

          {/* Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate(`/track-order?id=${completedOrder.orderId}&phone=${completedOrder.customerPhone}`)}
              className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <Truck className="w-4 h-4" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </button>

            <button
              onClick={() => navigate(`/invoice/${completedOrder.invoiceId}?phone=${completedOrder.customerPhone}`)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>ইনভয়েস দেখুন / প্রিন্ট</span>
            </button>
          </div>

          <div>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-stone-500 hover:text-[#6B352A] font-semibold underline"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no items in cart
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800">চেকআউট করার মতো কোনো পণ্য কার্টে নেই</h2>
        <p className="text-xs text-stone-500">অনুগ্রহ করে আগে আপনার পছন্দের পণ্য কার্টে যোগ করুন।</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-6 py-2.5 rounded-full"
        >
          হোমপেজে যান
        </button>
      </div>
    );
  }

  // Estimated delivery preview for client UI
  const estimatedDelivery = deliveryZone === 'cox_bazar'
    ? (subtotal < 1000 ? 100 : 0)
    : (subtotal < 1500 ? 150 : 0);

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const estimatedTotal = Math.max(0, subtotal - couponDiscount + estimatedDelivery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858]">
          চেকআউট ও ডেলিভারি তথ্য
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          ক্যাশ অন ডেলিভারিতে অর্ডার করতে নিচের সঠিক তথ্য পূরণ করুন
        </p>
      </div>

      {orderError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2F4858] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#6B352A] text-[#FFF1A6] text-xs flex items-center justify-center font-sans font-bold">1</span>
              গ্রাহকের তথ্য
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোহাম্মদ করিম"
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01861007427"
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                  />
                  <span className="text-[10px] text-stone-400">ডেলিভারির জন্য সক্রিয় নম্বর দিন</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বিকল্প মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address & Shipping */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2F4858] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#6B352A] text-[#FFF1A6] text-xs flex items-center justify-center font-sans font-bold">2</span>
              ডেলিভারি ঠিকানা
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    জেলা <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                  >
                    {popularDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    থানা / উপজেলা / এলাকা
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="যেমন: কক্সবাজার সদর / ধানমন্ডি"
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  পূর্ণাঙ্গ বাড়ির ঠিকানা / রোড / বাসা নম্বর <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাড়ি নম্বর, রোড নম্বর, ফ্ল্যাট বা পরিচিত ল্যান্ডমার্ক..."
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  অর্ডার সংক্রান্ত বিশেষ নোট (যদি থাকে)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2F4858] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#6B352A] text-[#FFF1A6] text-xs flex items-center justify-center font-sans font-bold">3</span>
              পেমেন্ট পদ্ধতি নির্বাচন করুন
            </h2>

            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-[#6B352A] bg-amber-50/50 ring-1 ring-[#6B352A]'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-700" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-800 block">
                      ক্যাশ অন ডেলিভারি (Cash on Delivery)
                    </span>
                    <span className="text-[11px] text-stone-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</span>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'COD'} readOnly />
              </label>

              <label
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'bKash'
                    ? 'border-[#E2136E] bg-pink-50/50 ring-1 ring-[#E2136E]'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#E2136E]" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-800 block">
                      বিকাশ (bKash): 01861007427
                    </span>
                    <span className="text-[11px] text-stone-500">ব্যক্তিগত নম্বরে সেন্ড মানি</span>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'bKash'} readOnly />
              </label>

              <label
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#F7941D] bg-orange-50/50 ring-1 ring-[#F7941D]'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#F7941D]" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-800 block">
                      নগদ (Nagad): 01861007427
                    </span>
                    <span className="text-[11px] text-stone-500">ব্যক্তিগত নম্বরে সেন্ড মানি</span>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'Nagad'} readOnly />
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2F4858] border-b border-stone-100 pb-3">
              অর্ডারের সারসংক্ষেপ ({items.length} টি পণ্য)
            </h3>

            {/* Item snapshots list */}
            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const effective = Math.max(0, item.product.price - item.product.discount);
                return (
                  <div key={item.product.productId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 max-w-[220px]">
                      <img
                        src={item.product.images?.[0] || ''}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-stone-800 truncate block">
                          {item.product.bengaliName}
                        </span>
                        <span className="text-stone-400 text-[10px]">
                          {item.quantity}x @ ৳{effective}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-800">
                      ৳{effective * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="কুপন কোড (AQSA50)"
                  className="flex-1 bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
                >
                  {couponLoading ? 'যাচাই...' : 'প্রয়োগ'}
                </button>
              </div>

              {appliedCoupon && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center justify-between">
                  <span>{appliedCoupon.message}</span>
                  <button
                    type="button"
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="text-stone-400 hover:text-red-600 text-xs ml-2"
                  >
                    বাদ দিন
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-1.5 text-[11px] text-red-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>পণ্য মূল্য (সাবটোটাল):</span>
                <span className="font-bold text-stone-800">৳{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>কুপন ছাড় ({appliedCoupon.code}):</span>
                  <span className="font-bold">-৳{appliedCoupon.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ ({deliveryZone === 'cox_bazar' ? "কক্সবাজার" : "অন্যান্য জেলা"}):</span>
                <span className={`font-bold ${estimatedDelivery === 0 ? 'text-emerald-700' : 'text-stone-800'}`}>
                  {estimatedDelivery === 0 ? 'ফ্রি (FREE)' : `৳${estimatedDelivery}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#6B352A] pt-3 border-t border-stone-200">
                <span>সর্বমোট প্রদেয়:</span>
                <span>৳{estimatedTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6B352A] hover:bg-[#52271E] disabled:bg-stone-400 text-[#FFF1A6] font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFF1A6] border-t-transparent rounded-full animate-spin" />
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>অর্ডার কনফার্ম করুন (৳{estimatedTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Trust box */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/60 text-xs text-stone-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>নিরাপদ ও বিশ্বস্ত শপিং</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              আপনার সমস্ত তথ্য অত্যন্ত সুরক্ষিত থাকে। কোনো ভুল পণ্য গেলে দ্রুত পরিবর্তনের সুবিধা রয়েছে।
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
