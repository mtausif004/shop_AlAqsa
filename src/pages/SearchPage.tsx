import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchProducts } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, X, Sparkles } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { path } = useRouter();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract ?q= from URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      setQuery(q);
    }
  }, [path]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const prods = await fetchProducts();
      setProducts(prods);
      setLoading(false);
    }
    load();
  }, []);

  const searchResults = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      p.bengaliName.toLowerCase().includes(q) ||
      p.englishName.toLowerCase().includes(q) ||
      p.productId.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryId.toLowerCase().includes(q) ||
      p.subcategoryId.toLowerCase().includes(q) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(q))
    );
  });

  const popularSuggestions = ['আচার', 'তেঁতুল', 'বালাচাও', 'থানাকা', 'কফি', 'চকলেট', 'সাকুরা প্লাম'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Search Input Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200/80 max-w-3xl mx-auto space-y-4">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2F4858] text-center">
          বার্মিজ পণ্য অনুসন্ধান করুন
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="পণ্য, ক্যাটাগরি অথবা উপাদান লিখে খুঁজুন..."
            className="w-full bg-[#FAF7F2] text-stone-800 placeholder-stone-400 pl-11 pr-10 py-3 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B352A] shadow-inner"
          />
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-stone-400 font-medium">জনপ্রিয় সার্চ:</span>
          {popularSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => setQuery(sug)}
              className="bg-stone-100 hover:bg-[#FFF1A6] text-stone-700 hover:text-[#6B352A] px-3 py-1 rounded-full font-semibold transition"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="font-bold text-sm sm:text-base text-stone-700">
            {query ? `"${query}" এর জন্য সার্চ ফলাফল (${searchResults.length})` : `সকল পণ্য (${searchResults.length})`}
          </h2>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
            <p className="text-sm font-semibold text-stone-600">
              দুঃখিত, আপনার সার্চকৃত শব্দের সাথে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <p className="text-xs text-stone-400">
              দয়া করে বানানটি পরীক্ষা করুন অথবা উপরের জনপ্রিয় কিওয়ার্ডগুলো দিয়ে চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
