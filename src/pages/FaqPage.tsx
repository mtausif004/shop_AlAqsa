import React, { useState } from 'react';
import { FAQS } from '../data/initialData';
import { HelpCircle, ChevronRight, Phone } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#FFF1A6] text-[#6B352A] flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-[#2F4858]">
          সচরাচর জিজ্ঞাসা (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          আল আকসা বার্মিজ শপ সংক্রান্ত সাধারণ প্রশ্নের উত্তর
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-3">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border border-stone-200/80 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-800 hover:text-[#6B352A] transition"
            >
              <span>{faq.q}</span>
              <ChevronRight
                className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                  openIdx === idx ? 'rotate-90 text-[#6B352A]' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 animate-fadeIn">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200 text-center space-y-3">
        <h3 className="font-bold text-sm text-stone-800">অন্য কোনো প্রশ্ন আছে?</h3>
        <p className="text-xs text-stone-500">আমাদের কাস্টমার কেয়ারে সরাসরি কল করুন</p>
        <a
          href="tel:+8801861007427"
          className="inline-flex items-center gap-2 bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-5 py-2.5 rounded-full shadow"
        >
          <Phone className="w-4 h-4" />
          <span>01861007427</span>
        </a>
      </div>
    </div>
  );
};
