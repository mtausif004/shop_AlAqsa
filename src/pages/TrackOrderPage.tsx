import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { trackOrder } from '../services/api';
import {
  PackageCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertCircle,
  Phone,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { navigate, path } = useRouter();

  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingData, setTrackingData] = useState<any | null>(null);

  // Preload from URL params if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlId = urlParams.get('id');
      const urlPhone = urlParams.get('phone');
      if (urlId) setOrderId(urlId);
      if (urlPhone) setPhone(urlPhone);

      if (urlId && urlPhone) {
        performTracking(urlId, urlPhone);
      }
    }
  }, [path]);

  const performTracking = async (id: string, ph: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await trackOrder(id, ph);
      if (res.success && res.data) {
        setTrackingData(res.data);
      } else {
        setError(res.error || 'অর্ডার ট্র্যাক করা সম্ভব হয়নি। তথ্য যাচাই করুন।');
        setTrackingData(null);
      }
    } catch (e: any) {
      setError('সার্ভারে সাময়িক সমস্যা দেখা দিয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError('অর্ডার আইডি এবং ফোন নম্বর উভয়ই প্রদান করা আবশ্যক।');
      return;
    }
    performTracking(orderId.trim(), phone.trim());
  };

  // Order lifecycle step definitions
  const steps = [
    { key: 'New', label: 'অর্ডার প্লেসড' },
    { key: 'Confirmed', label: 'কনফার্মড' },
    { key: 'Processing', label: 'প্রসেসিং' },
    { key: 'Ready to Ship', label: 'প্যাকেজিং সম্পন্ন' },
    { key: 'Shipped', label: 'কুরিয়ারে হস্তান্তর' },
    { key: 'In Transit', label: 'অন দ্য ওয়ে' },
    { key: 'Out for Delivery', label: 'ডেলিভারিতে বের হয়েছে' },
    { key: 'Delivered', label: 'ডেলিভার্ড' }
  ];

  const getCurrentStepIndex = (status: string) => {
    const idx = steps.findIndex((s) => s.key.toLowerCase() === (status || '').toLowerCase());
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#FFF1A6] text-[#6B352A] flex items-center justify-center mx-auto shadow-xs">
          <PackageCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F4858]">
          লাইভ অর্ডার ট্র্যাকিং
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          আপনার অর্ডার আইডি এবং বুকিংয়ের ফোন নম্বর প্রদান করে পার্সেলের সর্বশেষ অবস্থা যাচাই করুন
        </p>
      </div>

      {/* Tracking Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                অর্ডার আইডি <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="AQ-20261005-0001"
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ফোন নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01861007427"
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B352A]"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B352A] hover:bg-[#52271E] disabled:bg-stone-400 text-[#FFF1A6] font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition"
          >
            {loading ? (
              <span>যাচাই করা হচ্ছে...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>অর্ডার খুঁজুন ও ট্র্যাক করুন</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Verified Tracking Results */}
      {trackingData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6 animate-fadeIn">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#6B352A]">
                  {trackingData.orderId}
                </span>
                <span className="bg-[#6B352A] text-[#FFF1A6] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {trackingData.orderStatus}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                গ্রাহক: <strong>{trackingData.customerName}</strong> ({trackingData.maskedPhone})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/invoice/${trackingData.invoiceId || trackingData.orderId}?phone=${phone}`)}
                className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5 text-[#6B352A]" />
                <span>ইনভয়েস দেখুন</span>
              </button>
            </div>
          </div>

          {/* CRITICAL FEATURE: Tracking URL Priority (Admin Custom URL or Courier URL) */}
          {trackingData.trackingUrl ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>লাইভ কুরিয়ার ট্র্যাকিং লিঙ্ক প্রস্তুত!</span>
              </div>
              <p className="text-xs text-emerald-700">
                আপনার পার্সেলটি কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে। সরাসরি কুরিয়ার সাইটে পার্সেল ট্র্যাক করতে নিচের লিঙ্কে ক্লিক করুন:
              </p>
              {trackingData.trackingNumber && (
                <p className="text-xs font-mono text-stone-600">
                  ট্র্যাকিং নম্বর: <strong>{trackingData.trackingNumber}</strong>
                </p>
              )}
              <div className="pt-1">
                <a
                  href={trackingData.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                >
                  <span>কুরিয়ার ওয়েবসাইটে সরাসরি ট্র্যাক করুন</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                অর্ডারটি প্যাকেজিং প্রক্রিয়ায় রয়েছে। কুরিয়ারে হস্তান্তর ও ট্র্যাকিং লিঙ্ক সংযুক্ত হওয়া মাত্র এখানে সরাসরি ট্র্যাকিং বাটন দেখতে পাবেন।
              </span>
            </div>
          )}

          {/* Progress Timeline */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <h3 className="font-bold text-sm text-stone-800">অর্ডার স্ট্যাটাস অগ্রগতি</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {trackingData.statusTimeline && trackingData.statusTimeline.length > 0 ? (
                trackingData.statusTimeline.map((item: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center ring-4 ring-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-800 block">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-stone-400 block font-mono">
                        {item.timestamp}
                      </span>
                      {item.note && (
                        <p className="text-xs text-stone-600 mt-0.5">{item.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-stone-500">
                  বর্তমান স্ট্যাটাস: {trackingData.orderStatus} ({trackingData.createdAt})
                </div>
              )}
            </div>
          </div>

          {/* Safe Summary Info */}
          <div className="bg-stone-50 p-4 rounded-2xl text-xs text-stone-600 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-stone-400 block text-[10px]">অর্ডার তারিখ:</span>
              <span className="font-medium text-stone-800">{trackingData.createdAt}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">পেমেন্ট স্ট্যাটাস:</span>
              <span className="font-medium text-stone-800">{trackingData.paymentStatus}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">ডেলিভারি এলাকা:</span>
              <span className="font-medium text-stone-800">{trackingData.deliveryZone}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">সর্বমোট মূল্য:</span>
              <span className="font-bold text-[#6B352A]">৳{trackingData.grandTotal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
