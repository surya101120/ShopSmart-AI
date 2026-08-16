import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isSaved = isInWishlist(product.id);

  const price = floatVal(product.price);
  const originalPrice = floatVal(product.original_price);
  const hasDiscount = originalPrice > price;

  function floatVal(val) {
    return typeof val === 'number' ? val : parseFloat(val || 0);
  }

  return (
    <div className="group relative bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between">
      {/* Product Image + Badges */}
      <div className="relative aspect-square overflow-hidden bg-gray-950">
        <img
          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500/90 text-white font-black text-xs px-2.5 py-1 rounded-full backdrop-blur-md shadow-md">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved ? 'bg-pink-500 text-white' : 'bg-gray-900/70 text-gray-300 hover:text-pink-400'
          }`}
        >
          <FiHeart className={isSaved ? 'fill-current text-sm' : 'text-sm'} />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{product.brand}</span>
          <Link to={`/products/${product.slug || product.id}`}>
            <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 hover:text-indigo-300 transition-colors mt-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 text-xs text-yellow-400">
          <div className="flex items-center">
            <FiStar className="fill-current" />
            <span className="ml-1 font-bold text-gray-200">{product.avg_rating || 4.5}</span>
          </div>
          <span className="text-gray-500">({product.review_count || 12})</span>
        </div>

        {/* Pricing + Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
          <div>
            <div className="text-lg font-black text-white">
              ₹{price.toLocaleString('en-IN')}
            </div>
            {hasDiscount && (
              <div className="text-xs text-gray-500 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product.id, 1)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            title="Add to Cart"
          >
            <FiShoppingCart className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
