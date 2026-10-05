import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2F4858]">
          যোগাযোগ ও শোরুম
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          আল আকসা বার্মিজ শপ – যেকোনো প্রশ্ন, বাল্ক অর্ডার বা সহায়তায় আমরা আছি আপনার পাশে
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#6B352A]">
            সরাসরি যোগাযোগের ঠিকানা
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#6B352A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold mb-0.5">শোরুম ও দোকান:</strong>
                <span>দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট ( ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার সদর, কক্সবাজার।</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#6B352A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold mb-0.5">হটলাইন ও WhatsApp:</strong>
                <a href="tel:+8801861007427" className="text-[#6B352A] font-bold hover:underline">
                  +8801861007427
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#6B352A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold mb-0.5">ইমেইল:</strong>
                <a href="mailto:shop@alaqsaburmeseshop.com" className="text-[#6B352A] hover:underline">
                  shop@alaqsaburmeseshop.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#6B352A] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold mb-0.5">শোরুম খোলার সময়:</strong>
                <span>সপ্তাহের ৭ দিনই সকাল ৯:০০ টা থেকে রাত ১১:০০ টা পর্যন্ত খোলা।</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/8801861007427"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ সরাসরি বার্তা পাঠান</span>
            </a>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#2F4858]">
            আমাদের বার্তা পাঠান
          </h2>
          <p className="text-xs text-stone-500">
            আপনার নাম ও বার্তা লিখে পাঠান, আমাদের টিম দ্রুত উত্তর দেবে।
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('ধন্যবাদ! আপনার বার্তাটি গৃহীত হয়েছে।');
            }}
            className="space-y-3 pt-2"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">আপনার নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: সাকিব আল হাসান"
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">ফোন নম্বর</label>
              <input
                type="tel"
                required
                placeholder="01861007427"
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">বার্তা / প্রশ্ন</label>
              <textarea
                required
                rows={3}
                placeholder="কী জানতে চান বিস্তারিত লিখুন..."
                className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
