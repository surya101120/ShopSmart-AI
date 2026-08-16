import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiTrendingUp, FiCheckCircle, FiStar, FiArrowRight, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../services/api';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, trendRes, flashRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getTrending(),
          productAPI.getFlashSale()
        ]);
        if (featRes.data.success) setFeaturedProducts(featRes.data.data);
        if (trendRes.data.success) setTrendingProducts(trendRes.data.data);
        if (flashRes.data.success) setFlashSaleProducts(flashRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-gray-950 via-indigo-950/20 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold text-xs mb-6 uppercase tracking-wider">
            <FiZap className="animate-bounce" /> AI-Powered Shopping Experience
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6">
            Shop Smarter with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-8">
            Experience smart recommendations, natural language search, instant checkout, and real-time order tracking.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Explore Catalog <FiArrowRight />
            </Link>
            <Link to="/products?category=gaming" className="btn-secondary">
              Flash Deals 🔥
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-gray-800/80 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800">
              <FiTruck className="text-indigo-400 text-2xl" />
              <div>
                <h4 className="text-xs font-bold text-gray-200">Free Express Shipping</h4>
                <p className="text-[10px] text-gray-400">On orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800">
              <FiShield className="text-indigo-400 text-2xl" />
              <div>
                <h4 className="text-xs font-bold text-gray-200">Stripe Payment Security</h4>
                <p className="text-[10px] text-gray-400">256-bit Encrypted Checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800">
              <FiRotateCcw className="text-indigo-400 text-2xl" />
              <div>
                <h4 className="text-xs font-bold text-gray-200">7 Days Easy Return</h4>
                <p className="text-[10px] text-gray-400">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800">
              <FiZap className="text-indigo-400 text-2xl" />
              <div>
                <h4 className="text-xs font-bold text-gray-200">AI Search Engine</h4>
                <p className="text-[10px] text-gray-400">Understands human language</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          Shop by <span className="text-indigo-400">Category</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Laptops & Computers', slug: 'laptops', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
            { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
            { name: 'Footwear & Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
            { name: 'Gaming Consoles', slug: 'gaming', image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${cat.slug}`}
              className="group relative h-40 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition-all shadow-lg"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent p-4 flex items-end">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              Flash <span className="text-red-500">Sale 🔥</span>
            </h2>
            <span className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-3 py-1 rounded-full">
              Ends in 05h 42m
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {flashSaleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Trending <span className="text-indigo-400">Products 🚀</span>
          </h2>
          <Link to="/products" className="text-xs font-semibold text-indigo-400 hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
