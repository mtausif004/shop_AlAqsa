import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Phone, MapPin, Menu, X, PackageCheck, Flame, Tag } from 'lucide-react';

export const Header: React.FC = () => {
  const { navigate, route } = useRouter();
  const { totalItemsCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#6B352A] text-white shadow-md">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#52271E] text-xs py-1.5 px-4 text-center border-b border-[#6B352A]/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-[#FFF1A6] text-[#6B352A] px-2 py-0.5 rounded text-[11px] font-bold">
              কক্সবাজারের আসল বার্মিজ পণ্য
            </span>
            <span className="hidden sm:inline text-amber-100/90">
              সারা দেশে ক্যাশ অন হোম ডেলিভারি ও দ্রুত সার্ভিস!
            </span>
          </div>
          <div className="flex items-center gap-4 text-amber-100 text-[11px] mx-auto sm:mx-0">
            <a href="tel:+8801861007427" className="flex items-center gap-1 hover:text-[#FFF1A6] transition">
              <Phone className="w-3 h-3 text-[#FFF1A6]" />
              হটলাইন: 01861007427
            </a>
            <span className="text-amber-100/40">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FFF1A6]" />
              লাবণী পয়েন্ট, কক্সবাজার
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF1A6] to-[#F7E47B] text-[#6B352A] flex items-center justify-center font-bold text-xl shadow-inner border border-amber-200 group-hover:scale-105 transition-transform">
            AQ
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#FFF1A6] leading-none">
              Al Aqsa Burmese Shop
            </span>
            <span className="text-xs text-amber-100/90 font-medium tracking-wide">
              আল আকসা বার্মিজ শপ • কক্সবাজার
            </span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আচার, তেঁতুল, বালাচাও, থানাকা বা পণ্য খুঁজুন..."
              className="w-full bg-[#FAF7F2] text-[#2F4858] placeholder-stone-400 pl-4 pr-10 py-2 rounded-full text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#FFF1A6] shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#6B352A] text-[#FFF1A6] p-1.5 rounded-full hover:bg-[#52271E] transition"
              title="খুঁজুন"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Tracking Button */}
          <button
            onClick={() => navigate('/track-order')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              route === 'track-order'
                ? 'bg-[#FFF1A6] text-[#6B352A] border-[#FFF1A6]'
                : 'border-amber-200/40 text-amber-100 hover:bg-[#52271E]'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-[#FFF1A6]" />
            <span>অর্ডার ট্র্যাক</span>
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-[#FFF1A6] text-[#6B352A] hover:bg-[#F7E47B] font-bold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-sm transition active:scale-95"
            title="শপিং ব্যাগ"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">কার্ট</span>
            {totalItemsCount > 0 && (
              <span className="bg-[#2F4858] text-[#FFF1A6] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-amber-100 hover:bg-[#52271E] focus:outline-none"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <nav className="hidden md:block bg-[#592B21] border-t border-[#6B352A]/60 px-4 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1.5 overflow-x-auto">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-1 rounded-md transition ${route === 'home' ? 'text-[#FFF1A6] font-bold' : 'text-amber-100/90 hover:text-[#FFF1A6]'}`}
            >
              হোম
            </button>
            <button
              onClick={() => navigate('/category/pickle-chutney')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              আচার ও চাটনি
            </button>
            <button
              onClick={() => navigate('/category/sweet-tamarind')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              মিষ্টি তেঁতুল
            </button>
            <button
              onClick={() => navigate('/category/balachaw')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              বালাচাও
            </button>
            <button
              onClick={() => navigate('/category/chandan-thanaka')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              চন্দন ও থানাকা
            </button>
            <button
              onClick={() => navigate('/category/coffee-healthcare')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              বার্মিজ কফি
            </button>
            <button
              onClick={() => navigate('/category/chocolate-confectionery')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              চকলেট
            </button>
            <button
              onClick={() => navigate('/category/dry-foods-nuts')}
              className="px-3 py-1 text-amber-100/90 hover:text-[#FFF1A6] rounded-md transition"
            >
              ড্রাই ফুডস
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/offers')}
              className="flex items-center gap-1 text-[#FFF1A6] hover:underline font-bold"
            >
              <Tag className="w-3.5 h-3.5" />
              অফার
            </button>
            <button
              onClick={() => navigate('/combo')}
              className="flex items-center gap-1 text-[#FFF1A6] hover:underline font-bold"
            >
              <Flame className="w-3.5 h-3.5" />
              কম্বো প্যাক
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#52271E] border-t border-[#6B352A] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আচার, তেঁতুল, বালাচাও খুঁজুন..."
              className="w-full bg-[#FAF7F2] text-[#2F4858] placeholder-stone-400 pl-4 pr-10 py-2 rounded-lg text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#6B352A] text-[#FFF1A6] p-1.5 rounded-md"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm pt-2">
            <button
              onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              🏠 হোম
            </button>
            <button
              onClick={() => { navigate('/track-order'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              📦 অর্ডার ট্র্যাক
            </button>
            <button
              onClick={() => { navigate('/category/pickle-chutney'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              আচার ও চাটনি
            </button>
            <button
              onClick={() => { navigate('/category/sweet-tamarind'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              মিষ্টি তেঁতুল
            </button>
            <button
              onClick={() => { navigate('/category/balachaw'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              স্পেশাল বালাচাও
            </button>
            <button
              onClick={() => { navigate('/category/chandan-thanaka'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              চন্দন ও থানাকা
            </button>
            <button
              onClick={() => { navigate('/category/coffee-healthcare'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              বার্মিজ কফি
            </button>
            <button
              onClick={() => { navigate('/category/chocolate-confectionery'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              চকলেট
            </button>
            <button
              onClick={() => { navigate('/category/dry-foods-nuts'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-amber-100 hover:text-[#FFF1A6]"
            >
              ড্রাই ফুডস ও বাদাম
            </button>
            <button
              onClick={() => { navigate('/offers'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded bg-[#6B352A]/60 text-[#FFF1A6] font-bold"
            >
              🏷️ স্পেশাল অফার
            </button>
          </div>

          <div className="pt-2 border-t border-amber-900/50 flex justify-between text-xs text-amber-200">
            <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>আমাদের সম্পর্কে</button>
            <button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}>যোগাযোগ</button>
            <button onClick={() => { navigate('/faq'); setMobileMenuOpen(false); }}>সাধারণ জিজ্ঞাসা</button>
          </div>
        </div>
      )}
    </header>
  );
};
