import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchInvoice } from '../services/api';
import { Printer, ArrowLeft, ShieldCheck, MapPin, Phone, Mail, Globe } from 'lucide-react';

export const InvoicePage: React.FC = () => {
  const { params, navigate, path } = useRouter();
  const invoiceId = params.invoiceId;

  const [phone, setPhone] = useState('');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract phone query parameter if passed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const p = urlParams.get('phone') || '';
      if (p) {
        setPhone(p);
        loadInvoiceData(p);
      }
    }
  }, [invoiceId, path]);

  const loadInvoiceData = async (userPhone: string) => {
    if (!invoiceId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchInvoice(invoiceId, userPhone);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error || 'ইনভয়েস খুঁজে পাওয়া যায়নি অথবা ফোন নম্বর মেলেনি।');
      }
    } catch (e: any) {
      setError('সার্ভারে সমস্যা দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      loadInvoiceData(phone.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#6B352A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-stone-600">ইনভয়েস তৈরি হচ্ছে...</p>
      </div>
    );
  }

  // If data not loaded yet, require phone verification for privacy
  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF1A6] text-[#6B352A] flex items-center justify-center mx-auto font-bold text-lg">
            INV
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-800">
            ইনভয়েস ভেরিফিকেশন
          </h2>
          <p className="text-xs text-stone-500">
            গ্রাহকের তথ্যের গোপনীয়তার স্বার্থে অর্ডারের ফোন নম্বরটি যাচাই করুন।
          </p>

          <form onSubmit={handlePhoneVerification} className="space-y-3 pt-2">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="অর্ডারের ফোন নম্বর (যেমন: 01861007427)"
              className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
            />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-2.5 rounded-xl text-xs shadow transition"
            >
              ইনভয়েস দেখুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { shop, invoice } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <button
          onClick={() => navigate('/track-order')}
          className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#6B352A] font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>অর্ডার ট্র্যাকিংয়ে ফিরুন</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট / PDF সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Printable Area */}
      <div className="printable-area bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#6B352A] text-[#FFF1A6] font-bold flex items-center justify-center text-base">
                AQ
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#6B352A]">
                {shop.name}
              </h1>
            </div>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              {shop.address}
            </p>
            <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
              <div>হটলাইন: <strong>{shop.hotline}</strong> | ইমেইল: {shop.email}</div>
              <div>ওয়েবসাইট: {shop.domain}</div>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block bg-[#FAF7F2] text-[#6B352A] border border-amber-200 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              অফিসিয়াল ইনভয়েস
            </span>
            <div className="font-mono text-base font-extrabold text-stone-800">
              {invoice.invoiceId}
            </div>
            <div className="text-xs text-stone-500 font-mono">
              অর্ডার: {invoice.orderId}
            </div>
            <div className="text-xs text-stone-400">
              তারিখ: {invoice.createdAt}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200/80 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider block">গ্রাহকের বিবরণ:</span>
            <div className="font-bold text-sm text-stone-800">{invoice.customerName}</div>
            <div className="text-stone-600 font-mono">মোবাইল: {invoice.phone}</div>
            {invoice.alternativePhone && <div className="text-stone-500">বিকল্প নম্বর: {invoice.alternativePhone}</div>}
            <div className="text-stone-600 pt-1 leading-relaxed">
              ঠিকানা: {invoice.address}, {invoice.district}
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider block">ডেলিভারি ও পেমেন্ট:</span>
            <div>পেমেন্ট মেথড: <strong className="text-stone-800">{invoice.paymentMethod}</strong></div>
            <div>পেমেন্ট স্ট্যাটাস: <strong className="text-stone-800">{invoice.paymentStatus}</strong></div>
            <div>অর্ডার স্ট্যাটাস: <strong className="text-[#6B352A]">{invoice.orderStatus}</strong></div>
            <div>ডেলিভারি জোন: <strong>{invoice.deliveryZone}</strong></div>
            {invoice.courierName && <div>কুরিয়ার: <strong>{invoice.courierName}</strong></div>}
            {invoice.trackingNumber && <div>ট্র্যাকিং নম্বর: <strong className="font-mono">{invoice.trackingNumber}</strong></div>}
          </div>
        </div>

        {/* Product Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-300 text-stone-600 uppercase text-[11px] tracking-wider">
                <th className="py-2.5 font-bold">#</th>
                <th className="py-2.5 font-bold">পণ্য বিবরণ</th>
                <th className="py-2.5 font-bold text-center">পরিমাণ</th>
                <th className="py-2.5 font-bold text-right">একক মূল্য</th>
                <th className="py-2.5 font-bold text-right">মোট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {invoice.items?.map((item: any, idx: number) => (
                <tr key={idx} className="py-2">
                  <td className="py-3 text-stone-400 font-mono">{idx + 1}</td>
                  <td className="py-3">
                    <div className="font-bold text-stone-800">{item.productName}</div>
                    <div className="text-[10px] text-stone-400 font-mono">আইডি: {item.productId} • {item.weight}</div>
                  </td>
                  <td className="py-3 text-center font-bold text-stone-700">{item.quantity}</td>
                  <td className="py-3 text-right text-stone-600">৳{item.unitPrice}</td>
                  <td className="py-3 text-right font-bold text-stone-800">৳{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Subtotals & Grand Total */}
        <div className="border-t-2 border-stone-200 pt-4 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>সাবটোটাল:</span>
              <span className="font-bold">৳{invoice.subtotal}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>ডিসকাউন্ট:</span>
                <span className="font-bold">-৳{invoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold">{invoice.deliveryCharge === 0 ? 'ফ্রি' : `৳${invoice.deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#6B352A] pt-2 border-t border-stone-300">
              <span>সর্বমোট প্রদেয়:</span>
              <span>৳{invoice.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer / Disclaimer */}
        <div className="pt-8 border-t border-stone-200 text-center space-y-2 text-[11px] text-stone-500">
          <p className="font-medium text-stone-700">
            আল আকসা বার্মিজ শপ থেকে পণ্য ক্রয়ের জন্য আপনাকে ধন্যবাদ!
          </p>
          <p>
            যেকোনো অভিযোগ বা সহায়তায় আমাদের হটলাইনে সরাসরি যোগাযোগ করুন: +8801861007427
          </p>
          <div className="text-[10px] text-stone-400 pt-2 font-mono">
            Generated automatically by Al Aqsa Burmese Shop Web System
          </div>
        </div>
      </div>
    </div>
  );
};
