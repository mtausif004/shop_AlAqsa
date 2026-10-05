import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="text-center space-y-2">
        <ShieldCheck className="w-10 h-10 text-[#6B352A] mx-auto" />
        <h1 className="font-serif text-3xl font-extrabold text-[#2F4858]">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-xs text-stone-500">আল আকসা বার্মিজ শপ – গ্রাহকের তথ্যের সুরক্ষা ও গোপনীয়তা</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-stone-200/80 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h2 className="font-bold text-base text-stone-900">১. সংগৃহীত তথ্য</h2>
        <p>
          অর্ডার ডেলিভারির সুবিধার্থে আমরা শুধুমাত্র গ্রাহকের নাম, ফোন নম্বর, বিকল্প ফোন নম্বর (যদি দেন) এবং ডেলিভারির ঠিকানা সংগ্রহ করি। আমরা কখনোই গ্রাহকের ব্যক্তিগত পাসওয়ার্ড বা ব্যাংক কার্ডের গোপনীয় তথ্য সংরক্ষণ করি না।
        </p>

        <h2 className="font-bold text-base text-stone-900 pt-2">২. তথ্যের ব্যবহার</h2>
        <p>
          আপনার প্রদত্ত তথ্য শুধুমাত্র পার্সেল ডেলিভারি, ট্র্যাকিং আপডেট এবং প্রয়োজনীয় কাস্টমার সার্ভিসের কাজে ব্যবহৃত হয়। আমরা কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি বা শেয়ার করি না।
        </p>

        <h2 className="font-bold text-base text-stone-900 pt-2">৩. কুকিজ ও লোকাল স্টোরেজ</h2>
        <p>
          গ্রাহকের সুবিধার্থে কেবল শপিং কার্ট এবং ব্রাউজিং পছন্দ সংরক্ষণে ব্রাউজারের লোকাল স্টোরেজ সাময়িকভাবে ব্যবহৃত হয়।
        </p>

        <h2 className="font-bold text-base text-stone-900 pt-2">৪. যোগাযোগ</h2>
        <p>
          গোপনীয়তা নীতি সংক্রান্ত কোনো প্রশ্ন থাকলে সরাসরি আমাদের হটলাইনে যোগাযোগ করতে পারেন: +8801861007427
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="text-center space-y-2">
        <FileText className="w-10 h-10 text-[#6B352A] mx-auto" />
        <h1 className="font-serif text-3xl font-extrabold text-[#2F4858]">
          ব্যবহারের শর্তাবলী (Terms & Conditions)
        </h1>
        <p className="text-xs text-stone-500">আল আকসা বার্মিজ শপ – অর্ডার ও ডেলিভারি নীতিমালা</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-stone-200/80 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <h2 className="font-bold text-base text-stone-900">১. অর্ডার কনফার্মেশন</h2>
        <p>
          ওয়েবসাইটে অর্ডার প্লেস করার পর আমাদের প্রতিনিধি ফোন কলের মাধ্যমে অর্ডার নিশ্চিত করতে পারেন। ফোন নম্বর সঠিক ও সচল থাকা গ্রাহকের দায়িত্ব।
        </p>

        <h2 className="font-bold text-base text-stone-900 pt-2">২. ডেলিভারি ও চার্জ</h2>
        <p>
          কক্সবাজার সদর এলাকায় ১০০০ টাকার নিচে অর্ডারে ডেলিভারি চার্জ ১০০ টাকা (১০০০ টাকার উপরে ফ্রি)। কক্সবাজারের বাইরে ১৫০০ টাকার নিচে অর্ডারে ডেলিভারি চার্জ ১৫০ টাকা (১৫০০ টাকার উপরে ফ্রি)। ওজন বা পার্সেলের আকার অনুযায়ী অ্যাডমিন চূড়ান্ত চার্জ নির্ধারণের অধিকার রাখে।
        </p>

        <h2 className="font-bold text-base text-stone-900 pt-2">৩. মূল্য ও পণ্যের প্রাপ্যতা</h2>
        <p>
          পণ্যের মূল্য ও স্টক চূড়ান্তভাবে সার্ভার কর্তৃক যাচাই করা হয়। কোনো কারণে পণ্যের স্টক শেষ হয়ে গেলে গ্রাহককে অবিলম্বে অবহিত করা হবে।
        </p>
      </div>
    </div>
  );
};
