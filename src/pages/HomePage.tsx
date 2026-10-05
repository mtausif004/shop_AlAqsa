import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchProducts, fetchCategories, fetchBanners, fetchCombos } from '../services/api';
import { Product, Category, Banner, Combo } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FAQS } from '../data/initialData';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  Award,
  Tag,
  ShieldCheck,
  Truck,
  HelpCircle,
  MapPin,
  ArrowRight,
  Phone
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prodList, catList, banList, comList] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchBanners(),
          fetchCombos()
        ]);
        if (isMounted) {
          setProducts(prodList);
          setCategories(catList);
          setBanners(banList);
          setCombos(comList);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Banner autoplay
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const featuredProducts = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);
  const offerProducts = products.filter((p) => p.offer || p.discount > 0);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-[#6B352A] overflow-hidden">
        {banners.length > 0 && (
          <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
            {banners.map((banner, idx) => (
              <div
                key={banner.bannerId}
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
                  idx === activeBannerIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with Dark Vignette */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transition-transform duration-10000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#52271E] via-[#52271E]/75 to-transparent" />

                {/* Banner Content */}
                <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 z-20 max-w-2xl text-white space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#FFF1A6] text-[#6B352A] px-3.5 py-1 rounded-full text-xs font-extrabold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>কক্সবাজারের আসল বার্মিজ পণ্য</span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFF1A6] leading-tight tracking-tight">
                    {banner.title}
                  </h1>

                  <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl font-normal">
                    {banner.subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigate(banner.link || '/category/pickle-chutney')}
                      className="bg-[#FFF1A6] hover:bg-[#F7E47B] text-[#6B352A] font-extrabold px-6 py-3 rounded-full text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
                    >
                      <span>{banner.cta || 'পণ্য দেখুন'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="tel:+8801861007427"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition"
                    >
                      <Phone className="w-4 h-4 text-[#FFF1A6]" />
                      <span>01861007427</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setActiveBannerIdx((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                  aria-label="পূর্ববর্তী ব্যানার"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveBannerIdx((prev) => (prev + 1) % banners.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                  aria-label="পরবর্তী ব্যানার"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveBannerIdx(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeBannerIdx ? 'w-6 bg-[#FFF1A6]' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`ব্যানার ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Categories Grid (9 Main Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> পণ্য ক্যাটাগরি
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858] mt-1">
              আমাদের জনপ্রিয় ক্যাটাগরি সমূহ
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            কক্সবাজারের আসল স্বাদের সমাহার
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.categoryId}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/60 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={cat.image}
                  alt={cat.bengaliName}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-lg text-[#FFF1A6] leading-tight">
                    {cat.bengaliName}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-200 font-medium opacity-90">
                    {cat.englishName}
                  </p>
                </div>
              </div>

              {/* Subcategories pill hint */}
              <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span className="truncate pr-2 font-medium">
                  {cat.subcategories.slice(0, 2).join(' • ')}
                  {cat.subcategories.length > 2 && ' ...'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#6B352A] shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> স্পেশাল কালেকশন
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858] mt-1">
              সেরা বৈশিষ্ট্যমণ্ডিত পণ্য (Featured)
            </h2>
          </div>
          <button
            onClick={() => navigate('/category/pickle-chutney')}
            className="text-xs font-bold text-[#6B352A] hover:underline flex items-center gap-1"
          >
            সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* Combos & Super Value Pack Banner */}
      {combos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#6B352A] to-[#8E493B] text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-[#FFF1A6] text-[#6B352A] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                <Flame className="w-3.5 h-3.5" /> সুপার সেভার কম্বো প্যাক
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#FFF1A6]">
                {combos[0].name}
              </h2>
              <p className="text-sm text-stone-200 leading-relaxed">
                {combos[0].description}
              </p>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-[#FFF1A6]">
                  ৳{combos[0].comboPrice}
                </span>
                <span className="text-base line-through text-amber-200/70">
                  ৳{combos[0].originalPrice}
                </span>
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  ৳{combos[0].discount} সাশ্রয়
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/combo')}
                  className="bg-[#FFF1A6] text-[#6B352A] hover:bg-[#F7E47B] font-extrabold px-6 py-3 rounded-full text-sm shadow-md transition active:scale-95"
                >
                  কম্বো বিস্তারিত দেখুন
                </button>
              </div>
            </div>

            {/* Decorative Side Image */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-2/5">
              <img
                src={combos[0].image}
                alt={combos[0].name}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6B352A] to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-stone-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> সর্বাধিক বিক্রিত
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858] mt-1">
              গ্রাহকদের সবচেয়ে পছন্দের বার্মিজ পণ্য (Best Sellers)
            </h2>
          </div>
          <button
            onClick={() => navigate('/category/sweet-tamarind')}
            className="text-xs font-bold text-[#6B352A] hover:underline flex items-center gap-1"
          >
            সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      {/* Special Offers Section */}
      {offerProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-stone-200/80 pb-4">
            <div>
              <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> আকর্ষণীয় মূল্যছাড়
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858] mt-1">
                বিশেষ ছাড়ের পণ্যসমূহ (Exclusive Offers)
              </h2>
            </div>
            <button
              onClick={() => navigate('/offers')}
              className="text-xs font-bold text-[#6B352A] hover:underline flex items-center gap-1"
            >
              সব অফার দেখুন <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {offerProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Exact Approved About Us Section from Section 11 */}
      <section className="bg-white py-14 border-y border-stone-200/70">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#6B352A] border border-[#6B352A]/20 px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের পরিচিতি</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2F4858]">
            আল আকসা বার্মিজ শপ – কক্সবাজার
          </h2>

          {/* Approved exact copy without alterations */}
          <div className="text-sm sm:text-base text-stone-700 leading-relaxed space-y-4 text-left sm:text-justify bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-xs">
            <p className="font-medium text-stone-800">
              “আমরা নিয়ে এসেছি শতভাগ অথেনটিক, প্রিমিয়াম এবং মুখরোচক বার্মিজ ও ইমপোর্টেড পণ্যের এক বিশাল সমাহার। ঘরে বসেই আসল বার্মিজ ও থাই পণ্যের খাঁটি স্বাদ এবং মানসম্মত স্কিন কেয়ারের অভিজ্ঞতা পেতে এখন থেকে আমরা আছি আপনাদের পাশেই।
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-[#6B352A] text-base border-b border-stone-200 pb-1">
                আমাদের পেজে যা যা পাবেন:
              </h3>

              <div>
                <h4 className="font-bold text-stone-800">মুখরোচক ফুড ও স্ন্যাক্স:</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  ঐতিহ্যবাহী বার্মিজ আচার, চাটনি, সুস্বাদু জেলি, গামি, সফ্ট ক্যান্ডি, প্রিমিয়াম ড্রাই ফ্রুট, সাকুরা প্লাম এবং থাইল্যান্ডের বিখ্যাত মিষ্টি তেঁতুল।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-800">চকলেট ও প্রিমিয়াম বেভারেজ:</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  এক্সক্লুসিভ ইমপোর্টেড চকলেট এবং এনার্জেটিক বার্মিজ Rich Coffee।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-800">স্কিন কেয়ার ও বিউটি:</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  খাঁটি চন্দন, প্রাকৃতিক থানাকা, বার্মিজ চন্দন লোশনসহ নানা ধরনের বিউটি ও স্কিন কেয়ার আইটেম।
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-800">হেলথ কেয়ার:</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  বিশ্বস্ত ও জেনুইন বার্মিজ ক্যালসিয়াম সাপ্লিমেন্ট।
                </p>
              </div>
            </div>

            <p className="font-medium text-stone-800 pt-2 border-t border-stone-200">
              খাঁটি পণ্যের গুণগত মান এবং সেরা সার্ভিস প্রদানই আমাদের মূল লক্ষ্য। আপনাদের প্রতিটি অর্ডার পৌঁছে যাবে দেশের যেকোনো প্রান্তে দ্রুততম সময়ে হোম ডেলিভারির মাধ্যমে।”
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#6B352A]" />
              দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট (ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#6B352A]" />
              হটলাইন: 01861007427
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> সচরাচর জিজ্ঞাসা
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2F4858]">
            সাধারণ প্রশ্ন ও উত্তর (FAQ)
          </h2>
          <p className="text-xs text-stone-500">
            অর্ডার, ডেলিভারি ও পেমেন্ট সম্পর্কিত সাধারণ তথ্যাবলী
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-800 hover:text-[#6B352A] transition"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                    activeFaq === idx ? 'rotate-90 text-[#6B352A]' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
