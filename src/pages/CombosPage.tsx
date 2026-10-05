import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { fetchCombos, fetchProducts } from '../services/api';
import { Combo, Product } from '../types';
import { useCart } from '../context/CartContext';
import { Flame, Check, ArrowRight } from 'lucide-react';

export const CombosPage: React.FC = () => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [comList, prodList] = await Promise.all([
        fetchCombos(),
        fetchProducts()
      ]);
      setCombos(comList);
      setProducts(prodList);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddComboToCart = (combo: Combo) => {
    // Add all constituent products of this combo to cart
    combo.productIds.forEach((pid) => {
      const p = products.find((prod) => prod.productId === pid);
      if (p) addToCart(p, 1);
    });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="bg-gradient-to-r from-[#6B352A] to-[#8E493B] text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-[#FFF1A6] text-[#6B352A] px-3 py-1 rounded-full text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>সুপার ভ্যালু প্যাক</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#FFF1A6]">
            বার্মিজ স্পেশাল কম্বো অফার
          </h1>
          <p className="text-xs sm:text-sm text-stone-200">
            একাধিক পছন্দের পণ্য একসাথে কিনুন বিশাল সাশ্রয়ে!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((combo) => (
          <div
            key={combo.comboId}
            className="bg-white rounded-3xl overflow-hidden shadow-xs border border-stone-200/80 flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-stone-100">
              <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                ৳{combo.discount} সাশ্রয়
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-[#2F4858]">
                  {combo.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {combo.description}
                </p>

                {/* Items in Combo */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-bold text-stone-700 block">কম্বোতে যা যা থাকছে:</span>
                  {combo.productIds.map((pid) => {
                    const prod = products.find((p) => p.productId === pid);
                    return (
                      <div key={pid} className="flex items-center gap-2 text-xs text-stone-600 bg-[#FAF7F2] p-2 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{prod?.bengaliName || pid}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#6B352A]">
                    ৳{combo.comboPrice}
                  </span>
                  <span className="text-sm line-through text-stone-400">
                    ৳{combo.originalPrice}
                  </span>
                </div>

                <button
                  onClick={() => handleAddComboToCart(combo)}
                  className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow transition active:scale-95"
                >
                  <span>কম্বো অর্ডার করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
