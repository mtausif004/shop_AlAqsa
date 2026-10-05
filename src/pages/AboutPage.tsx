import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FFF1A6] text-[#6B352A] px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>আমাদের পরিচিতি</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2F4858]">
          আল আকসা বার্মিজ শপ – কক্সবাজার
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          ঐতিহ্যবাহী আসল বার্মিজ ও ইমপোর্টেড পণ্যের নির্ভরযোগ্য অনলাইন ঠিকানা
        </p>
      </div>

      {/* Approved Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
        <p className="font-medium text-stone-800 text-justify">
          “আমরা নিয়ে এসেছি শতভাগ অথেনটিক, প্রিমিয়াম এবং মুখরোচক বার্মিজ ও ইমপোর্টেড পণ্যের এক বিশাল সমাহার। ঘরে বসেই আসল বার্মিজ ও থাই পণ্যের খাঁটি স্বাদ এবং মানসম্মত স্কিন কেয়ারের অভিজ্ঞতা পেতে এখন থেকে আমরা আছি আপনাদের পাশেই।
        </p>

        <div className="space-y-4 pt-2">
          <h2 className="font-bold text-[#6B352A] text-lg border-b border-stone-200 pb-2">
            আমাদের পেজে যা যা পাবেন:
          </h2>

          <div className="space-y-1">
            <h3 className="font-bold text-stone-800">মুখরোচক ফুড ও স্ন্যাক্স:</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              ঐতিহ্যবাহী বার্মিজ আচার, চাটনি, সুস্বাদু জেলি, গামি, সফ্ট ক্যান্ডি, প্রিমিয়াম ড্রাই ফ্রুট, সাকুরা প্লাম এবং থাইল্যান্ডের বিখ্যাত মিষ্টি তেঁতুল।
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-stone-800">চকলেট ও প্রিমিয়াম বেভারেজ:</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              এক্সক্লুসিভ ইমপোর্টেড চকলেট এবং এনার্জেটিক বার্মিজ Rich Coffee।
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-stone-800">স্কিন কেয়ার ও বিউটি:</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              খাঁটি চন্দন, প্রাকৃতিক থানাকা, বার্মিজ চন্দন লোশনসহ নানা ধরনের বিউটি ও স্কিন কেয়ার আইটেম।
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-stone-800">হেলথ কেয়ার:</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              বিশ্বস্ত ও জেনুইন বার্মিজ ক্যালসিয়াম সাপ্লিমেন্ট।
            </p>
          </div>
        </div>

        <p className="font-medium text-stone-800 pt-3 border-t border-stone-200 text-justify">
          খাঁটি পণ্যের গুণগত মান এবং সেরা সার্ভিস প্রদানই আমাদের মূল লক্ষ্য। আপনাদের প্রতিটি অর্ডার পৌঁছে যাবে দেশের যেকোনো প্রান্তে দ্রুততম সময়ে হোম ডেলিভারির মাধ্যমে।”
        </p>
      </div>

      {/* Business Coordinates Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 text-center space-y-2">
          <MapPin className="w-6 h-6 text-[#6B352A] mx-auto" />
          <h4 className="font-bold text-xs text-stone-800">শোরুমের ঠিকানা</h4>
          <p className="text-[11px] text-stone-600 leading-snug">
            দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট ( ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 text-center space-y-2">
          <Phone className="w-6 h-6 text-[#6B352A] mx-auto" />
          <h4 className="font-bold text-xs text-stone-800">হটলাইন ও WhatsApp</h4>
          <p className="text-[11px] text-stone-600 font-mono">
            +8801861007427
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 text-center space-y-2">
          <Truck className="w-6 h-6 text-[#6B352A] mx-auto" />
          <h4 className="font-bold text-xs text-stone-800">হোম ডেলিভারি</h4>
          <p className="text-[11px] text-stone-600">
            ক্যাশ অন ডেলিভারি (সারা বাংলাদেশ)
          </p>
        </div>
      </div>
    </div>
  );
};
