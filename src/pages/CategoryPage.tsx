import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchProducts, fetchCategories } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Filter, ChevronRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const categorySlug = params.categorySlug;
  const initialSubcategory = params.subcategorySlug || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategoryData() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);

        if (isMounted) {
          setCategories(cats);
          const foundCat = cats.find(
            (c) => c.slug.toLowerCase() === (categorySlug || '').toLowerCase()
          );
          setCurrentCategory(foundCat || null);

          // Filter products belonging to this category
          const filtered = prods.filter(
            (p) => p.categoryId.toLowerCase() === (categorySlug || '').toLowerCase()
          );
          setProducts(filtered);
          setLoading(false);

          if (foundCat) {
            document.title = `${foundCat.bengaliName} | Al Aqsa Burmese Shop`;
          }
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    }
    loadCategoryData();
    return () => { isMounted = false; };
  }, [categorySlug]);

  const displayedProducts = products
    .filter((p) => {
      if (selectedSubcategory === 'all') return true;
      return p.subcategoryId === selectedSubcategory;
    })
    .sort((a, b) => {
      const priceA = a.price - a.discount;
      const priceB = b.price - b.discount;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#6B352A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-stone-600">ক্যাটাগরি পণ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Category Header Hero */}
      <div className="relative bg-[#6B352A] text-white rounded-3xl p-6 sm:p-10 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <nav className="flex items-center gap-1.5 text-xs text-amber-200/80 mb-2">
            <button onClick={() => navigate('/')} className="hover:text-white">হোম</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">{currentCategory?.bengaliName || categorySlug}</span>
          </nav>

          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#FFF1A6]">
            {currentCategory?.bengaliName || 'বার্মিজ পণ্য'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200">
            {currentCategory?.englishName || 'Authentic Burmese Collection'}
          </p>
        </div>

        {currentCategory?.image && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none">
            <img src={currentCategory.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6B352A] to-transparent" />
          </div>
        )}
      </div>

      {/* Subcategory Filter Tabs */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedSubcategory === 'all'
                ? 'bg-[#6B352A] text-[#FFF1A6] shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            সবগুলো ({products.length})
          </button>
          {currentCategory.subcategories.map((sub) => {
            const count = products.filter((p) => p.subcategoryId === sub).length;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedSubcategory === sub
                    ? 'bg-[#6B352A] text-[#FFF1A6] shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {sub} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs text-xs">
        <span className="font-semibold text-stone-600">
          মোট <strong className="text-[#6B352A]">{displayedProducts.length}</strong> টি পণ্য পাওয়া গেছে
        </span>

        <div className="flex items-center gap-2">
          <span className="text-stone-400 hidden sm:inline">সাজান:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#6B352A]"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">মূল্য: কম থেকে বেশি</option>
            <option value="price-high">মূল্য: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
          <p className="text-sm font-semibold text-stone-600">
            এই সাবক্যাটাগরিতে বর্তমানে কোনো পণ্য স্টক নেই।
          </p>
          <button
            onClick={() => setSelectedSubcategory('all')}
            className="text-xs font-bold text-[#6B352A] hover:underline"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
