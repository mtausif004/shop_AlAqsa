import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Tag, Sparkles } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await fetchProducts();
      setProducts(all.filter((p) => p.offer || p.discount > 0));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="bg-[#6B352A] text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF1A6] text-[#6B352A] px-3 py-1 rounded-full text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>সীমিত সময়ের স্পেশাল অফার</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#FFF1A6]">
            বিশেষ মূল্যছাড় ও অফার সমূহ
          </h1>
          <p className="text-xs sm:text-sm text-stone-200">
            কক্সবাজারের আসল বার্মিজ ফুডস ও স্কিন কেয়ার পণ্যে আকর্ষণীয় ডিসকাউন্ট উপভোগ করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.productId} product={p} />
        ))}
      </div>
    </div>
  );
};
