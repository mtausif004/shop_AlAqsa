import React from 'react';
import { Product } from '../types';
import { useRouter } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Zap, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();

  const effectivePrice = Math.max(0, product.price - product.discount);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80';

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/70 flex flex-col cursor-pointer relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-[#6B352A] text-[#FFF1A6] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            ৳{product.discount} ছাড়
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-[#2F4858] text-[#FFF1A6] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            বেস্ট সেলার
          </span>
        )}
      </div>

      {/* Origin / Weight Badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="bg-stone-900/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full">
          {product.weight} {product.unit}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={mainImage}
          alt={product.bengaliName}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-stone-500 font-medium tracking-wide mb-1 flex items-center justify-between">
            <span>{product.brand}</span>
            <span className="text-[10px] text-stone-400 font-mono">{product.productId}</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-[#2F4858] group-hover:text-[#6B352A] line-clamp-2 transition leading-snug">
            {product.bengaliName}
          </h3>

          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
            {product.englishName}
          </p>
        </div>

        {/* Pricing & Stock */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base sm:text-lg font-extrabold text-[#6B352A]">
              ৳{effectivePrice}
            </span>
            {product.mrp > effectivePrice && (
              <span className="text-xs text-stone-400 line-through">
                ৳{product.mrp}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleAddToCart}
              className="bg-[#FAF7F2] hover:bg-[#FFF1A6] text-[#6B352A] border border-[#6B352A]/20 font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition active:scale-95"
              title="ব্যাগে যোগ করুন"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>কার্ট</span>
            </button>
            <button
              onClick={handleQuickBuy}
              className="bg-[#6B352A] hover:bg-[#52271E] text-[#FFF1A6] font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition active:scale-95 shadow-sm"
              title="সরাসরি অর্ডার করুন"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>অর্ডার</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
