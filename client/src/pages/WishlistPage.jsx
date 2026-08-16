import React, { useEffect } from 'react';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { items, fetchWishlist, isLoading } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isLoading) return <div className="max-w-7xl mx-auto p-10 text-center text-gray-400">Loading Wishlist...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-800 pb-6">
        <FiHeart className="text-3xl text-pink-500 fill-current" />
        <div>
          <h1 className="text-3xl font-black text-white">My Wishlist</h1>
          <p className="text-xs text-gray-400">Your saved favorite items ({items.length})</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 border border-gray-800 rounded-3xl space-y-4">
          <p className="text-sm text-gray-400">You haven't saved any items to your wishlist yet.</p>
          <Link to="/products" className="btn-primary inline-block text-xs py-2.5 px-6">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product || item} />
          ))}
        </div>
      )}
    </div>
  );
}
