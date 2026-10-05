import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#2F4858] text-white pt-12 pb-8 border-t-4 border-[#6B352A] no-print">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#385566] p-6 rounded-2xl shadow-sm border border-stone-600/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF1A6]">১০০% অথেনটিক পণ্য</h4>
              <p className="text-xs text-stone-300">মিয়ানমার ও থাইল্যান্ডের আসল আমদানি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF1A6]">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-stone-300">সারা বাংলাদেশে দ্রুত হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF1A6]">নিরাপদ প্যাকেজিং</h4>
              <p className="text-xs text-stone-300">পণ্য অক্ষত থাকার সর্বোচ্চ নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#6B352A] text-[#FFF1A6] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#FFF1A6]">সরাসরি হটলাইন</h4>
              <p className="text-xs text-stone-300">যেকোনো সহায়তায়: 01861007427</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1A6] text-[#6B352A] flex items-center justify-center font-bold text-lg">
              AQ
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#FFF1A6] leading-tight">
                Al Aqsa Burmese Shop
              </h3>
              <p className="text-xs text-stone-300">আল আকসা বার্মিজ শপ</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-300">
            কক্সবাজার লাবণী পয়েন্টের ঐতিহ্যবাহী বার্মিজ ও থাই পণ্যের নির্ভরযোগ্য প্রতিষ্ঠান। ঘরে বসেই আসল স্বাদ ও খাঁটি রূপচর্চার পণ্য পৌঁছে দিচ্ছি আপনার ঠিকানায়।
          </p>

          <div className="pt-2 flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/14vuvr483L1/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#6B352A] text-white flex items-center justify-center transition"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Messenger */}
            <a
              href="https://m.me/61593972884460"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#6B352A] text-white flex items-center justify-center transition"
              title="Messenger"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.093.304 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26L10.74 8.78l3.13 3.259 5.889-3.259-6.568 6.183z"/></svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com/@alaqsaburmeshop"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#6B352A] text-white flex items-center justify-center transition"
              title="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.18 2.09 2.35 2.27 1.18.23 2.45-.25 3.18-1.2.49-.6.75-1.37.75-2.16.02-4.87.01-9.74.01-14.61z"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div>
          <h4 className="font-bold text-sm text-[#FFF1A6] mb-3 uppercase tracking-wider">
            জনপ্রিয় ক্যাটাগরি
          </h4>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>
              <button onClick={() => navigate('/category/pickle-chutney')} className="hover:text-[#FFF1A6] transition">
                আচার ও চাটনি
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/sweet-tamarind')} className="hover:text-[#FFF1A6] transition">
                মিষ্টি তেঁতুল (বক্স ও প্যাকেট)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/balachaw')} className="hover:text-[#FFF1A6] transition">
                কক্সবাজার স্পেশাল বালাচাও
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/chandan-thanaka')} className="hover:text-[#FFF1A6] transition">
                খাঁটি চন্দন ও থানাকা
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/coffee-healthcare')} className="hover:text-[#FFF1A6] transition">
                বার্মিজ রিচ কফি ও হেলথ কেয়ার
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/dry-foods-nuts')} className="hover:text-[#FFF1A6] transition">
                সাকুরা প্লাম ও ড্রাই ফুডস
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Info */}
        <div>
          <h4 className="font-bold text-sm text-[#FFF1A6] mb-3 uppercase tracking-wider">
            কাস্টমার সাপোর্ট
          </h4>
          <ul className="space-y-2 text-xs text-stone-300">
            <li>
              <button onClick={() => navigate('/track-order')} className="hover:text-[#FFF1A6] transition font-semibold text-amber-200">
                📦 অর্ডার ট্র্যাকিং
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-[#FFF1A6] transition">
                আমাদের সম্পর্কে
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-[#FFF1A6] transition">
                যোগাযোগ ও শোরুম
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/faq')} className="hover:text-[#FFF1A6] transition">
                সাধারণ জিজ্ঞাসা (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy')} className="hover:text-[#FFF1A6] transition">
                গোপনীয়তা নীতি (Privacy Policy)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/terms')} className="hover:text-[#FFF1A6] transition">
                ব্যবহারের শর্তাবলী (Terms)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Shop Address & Hotline */}
        <div>
          <h4 className="font-bold text-sm text-[#FFF1A6] mb-3 uppercase tracking-wider">
            শোরুমের ঠিকানা
          </h4>
          <div className="space-y-3 text-xs text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FFF1A6] shrink-0 mt-0.5" />
              <span>
                দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট ( ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার সদর, কক্সবাজার।
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#FFF1A6] shrink-0" />
              <a href="tel:+8801861007427" className="hover:text-[#FFF1A6]">
                +8801861007427 (হটলাইন / WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#FFF1A6] shrink-0" />
              <a href="mailto:shop@alaqsaburmeseshop.com" className="hover:text-[#FFF1A6]">
                shop@alaqsaburmeseshop.com
              </a>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-[#6B352A] text-[#FFF1A6] px-2.5 py-1 rounded text-[11px] font-semibold">
                বিকাশ ও নগদ: 01861007427
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Copyright & Discreet Admin Access */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-stone-600/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
        <div>
          © {new Date().getFullYear()} <span className="text-[#FFF1A6] font-semibold">Al Aqsa Burmese Shop</span>. সর্বস্বত্ব সংরক্ষিত।
        </div>
        <div className="flex items-center gap-4">
          <span>কক্সবাজার, বাংলাদেশ</span>
          <span className="text-stone-600">|</span>
          <button
            onClick={() => navigate('/SecurePanel-Aqsa')}
            className="flex items-center gap-1 text-stone-500 hover:text-amber-200 text-[11px] transition"
            title="অ্যাডমিন প্যানেল"
          >
            <Lock className="w-3 h-3" />
            <span>Secure Panel</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
