import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { fetchProductById, fetchProducts } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  Zap,
  Phone,
  MessageCircle,
  Share2,
  ShieldCheck,
  Truck,
  CheckCircle,
  ChevronRight,
  Star,
  Plus,
  Minus,
  Sparkles,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { addToCart } = useCart();
  const productId = params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      try {
        const prod = await fetchProductById(productId);
        if (isMounted) {
          setProduct(prod);
          setSelectedImageIdx(0);
          setQuantity(1);
          setLoading(false);

          if (prod) {
            // Update document title for SEO
            document.title = `${prod.bengaliName} | Al Aqsa Burmese Shop`;
            // Fetch related
            const all = await fetchProducts(prod.categoryId);
            setRelatedProducts(all.filter((p) => p.productId !== prod.productId).slice(0, 4));
          }
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6B352A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-stone-600">পণ্যের বিবরণ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-[#6B352A] flex items-center justify-center mx-auto font-bold text-2xl">
          ?
        </div>
        <h2 className="text-2xl font-bold text-stone-800">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-stone-500">
          প্রদত্ত আইডি অনুযায়ী কোনো পণ্য আমাদের ক্যাটালগে নেই অথবা সাময়িকভাবে অনুপলব্ধ।
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-6 py-2.5 rounded-full hover:bg-[#52271E] transition"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  const effectivePrice = Math.max(0, product.price - product.discount);
  const images = product.images && product.images.length > 0
    ? product.images.slice(0, 4)
    : ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) return;
    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-[#6B352A]">হোম</button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button onClick={() => navigate(`/category/${product.categoryId}`)} className="hover:text-[#6B352A]">
          {product.categoryId}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-800 font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.bengaliName}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-4 sm:p-8 rounded-3xl shadow-xs border border-stone-200/80">
        {/* Left Column: Gallery (up to 4 images) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
            <img
              src={images[selectedImageIdx]}
              alt={product.bengaliName}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-3 py-1 rounded-full shadow-md">
                ৳{product.discount} ছাড়
              </span>
            )}
            <span className="absolute top-3 right-3 bg-stone-900/60 backdrop-blur-xs text-white font-medium text-xs px-2.5 py-1 rounded-full">
              {product.weight} {product.unit}
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImageIdx === idx
                      ? 'border-[#6B352A] ring-2 ring-[#6B352A]/20 scale-102'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`থাম্বনেইল ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Security & Authenticity guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-stone-200/60 flex items-center gap-2.5 text-xs text-stone-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>১০০% খাঁটি বার্মিজ ও থাই পণ্যের নিশ্চয়তা</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-stone-200/60 flex items-center gap-2.5 text-xs text-stone-700">
              <Truck className="w-5 h-5 text-[#6B352A] shrink-0" />
              <span>কক্সবাজার থেকে সারাদেশে ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#6B352A] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                {product.brand}
              </span>
              <span className="text-xs font-mono text-stone-400">
                আইডি: {product.productId}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2F4858] leading-tight">
              {product.bengaliName}
            </h1>

            <p className="text-sm text-stone-500 font-medium">
              {product.englishName}
            </p>

            {/* Rating Stars & Stock */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1.5 font-bold text-stone-700">(৫.০)</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                ইন স্টক ({product.stock} টি অবশিষ্ট)
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-200/70 flex items-baseline gap-3 my-4">
              <span className="text-3xl font-extrabold text-[#6B352A]">
                ৳{effectivePrice}
              </span>
              {product.mrp > effectivePrice && (
                <span className="text-base text-stone-400 line-through">
                  ৳{product.mrp}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  ৳{product.discount} সেভ
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Key Specs Table */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                <span className="text-stone-400 block text-[10px]">ওজন / পরিমাণ:</span>
                <span className="font-bold text-stone-800">{product.weight} {product.unit}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                <span className="text-stone-400 block text-[10px]">উৎস (Origin):</span>
                <span className="font-bold text-stone-800">{product.origin}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-stone-700">পরিমাণ নির্বাচন করুন:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-sm text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-medium">
                  মোট মূল্য: <strong className="text-[#6B352A] text-sm">৳{effectivePrice * quantity}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-[#FAF7F2] hover:bg-[#FFF1A6] text-[#6B352A] border-2 border-[#6B352A] font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
              >
                <Zap className="w-4 h-4" />
                <span>সরাসরি অর্ডার করুন</span>
              </button>
            </div>

            {/* Quick Contact & Share row */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <a
                href={`https://wa.me/8801861007427?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি ${product.bengaliName} (আইডি: ${product.productId}) সম্পর্কে জানতে/অর্ডার করতে চাই।`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp অর্ডার</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-stone-600 hover:text-[#6B352A] font-semibold bg-stone-100 px-3 py-1.5 rounded-lg transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'লিঙ্ক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Full Description, Ingredients & Usage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center gap-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2F4858] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6B352A]" />
            পণ্যের পূর্ণাঙ্গ বিবরণ ও উপাদান
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>{product.description}</p>

          {product.ingredients && (
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200/70">
              <h3 className="font-bold text-stone-800 mb-1">উপাদানসমূহ:</h3>
              <p className="text-stone-600">{product.ingredients}</p>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2 text-stone-500 text-xs">
            <MapPin className="w-4 h-4 text-[#6B352A]" />
            <span>শোরুমের ঠিকানা: দোকান # ০৬, ছাতা মার্কেট, লাবণী পয়েন্ট, কক্সবাজার সদর</span>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200/80 space-y-6">
        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2F4858] flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          গ্রাহকদের মূল্যবান মতামত ও পর্যালোচনা
        </h2>

        {/* Existing approved reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-800">রাকিবুল হাসান (ঢাকা)</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              “কক্সবাজার বেড়াতে গিয়ে আল আকসা দোকান থেকে নিয়েছিলাম, এবার অনলাইনে অর্ডার করলাম। একদম সেম খাঁটি স্বাদ ও চমৎকার প্যাকেজিং পেয়েছি।”
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-stone-800">নুসরাত জাহান (চট্টগ্রাম)</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              “পণ্যটির কোয়ালিটি অত্যন্ত প্রিমিয়াম। বিশেষ করে দ্রুত হোম ডেলিভারি ও ভালো প্যাকেজিংয়ের জন্য ধন্যবাদ।”
            </p>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="pt-4 border-t border-stone-200">
          <h3 className="font-bold text-sm text-stone-800 mb-3">আপনার রিভিউ লিখুন:</h3>

          {reviewSubmitted ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-semibold border border-emerald-200">
              ✅ আপনার মূল্যবান রিভিউ সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর এটি প্রদর্শিত হবে। ধন্যবাদ!
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
                >
                  <option value={5}>৫ স্টার (অসাধারণ)</option>
                  <option value={4}>৪ স্টার (ভালো)</option>
                  <option value={3}>৩ স্টার (মোটামুটি)</option>
                </select>
              </div>
              <textarea
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="পণ্য সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
              />
              <button
                type="submit"
                className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
              >
                রিভিউ জমা দিন
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="font-serif text-xl font-bold text-[#2F4858]">
              সম্পর্কিত আরও বার্মিজ পণ্য
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
