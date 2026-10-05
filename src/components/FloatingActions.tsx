import React from 'react';
import { Phone, MessageCircle, PackageCheck } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const FloatingActions: React.FC = () => {
  const { navigate, route } = useRouter();

  if (route === 'admin') return null;

  return (
    <div className="fixed bottom-6 right-5 z-30 flex flex-col gap-2.5 no-print items-end">
      {/* Quick Track Order Bubble */}
      <button
        onClick={() => navigate('/track-order')}
        className="bg-[#2F4858] text-[#FFF1A6] hover:bg-[#233744] shadow-lg rounded-full px-3.5 py-2 flex items-center gap-1.5 text-xs font-bold transition hover:scale-105"
        title="অর্ডার ট্র্যাকিং"
      >
        <PackageCheck className="w-4 h-4" />
        <span className="hidden sm:inline">অর্ডার ট্র্যাক</span>
      </button>

      {/* Direct Phone Call */}
      <a
        href="tel:+8801861007427"
        className="bg-[#6B352A] text-[#FFF1A6] hover:bg-[#52271E] shadow-xl w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110"
        title="সরাসরি কল করুন: 01861007427"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp Chat */}
      <a
        href="https://wa.me/8801861007427?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%86%E0%A6%B2%20%E0%A6%86%E0%A6%95%E0%A6%B8%E0%A6%BE%20%E0%A6%AC%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AE%E0%A6%BF%E0%A6%9C%20%E0%A6%B6%E0%A6%AA%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%AA%E0%A6%A3%E0%A7%8D%E0%A6%AF%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white hover:bg-[#20ba59] shadow-2xl w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110"
        title="WhatsApp এ সরাসরি কথা বলুন"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
