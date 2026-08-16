import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMic, FiMoon, FiSun, FiMenu, FiX, FiCpu } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      navigate(`/products?search=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Could not catch voice. Try again.');
    };
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <FiCpu className="text-xl animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            ShopSmart <span className="text-indigo-500 font-extrabold text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10">AI</span>
          </span>
        </Link>

        {/* AI Powered Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="AI Search e.g. 'Gaming Laptop under ₹60,000' or 'Nike Shoes'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-700/60 rounded-2xl py-3 pl-12 pr-24 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />

            <div className="absolute right-3 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Voice Search"
                className={`p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-all ${isListening ? 'text-red-500 animate-bounce' : ''}`}
              >
                <FiMic className="text-lg" />
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <Link to="/products" className="hidden lg:block text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">
            Catalog
          </Link>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative text-gray-300 hover:text-pink-400 transition-colors p-2">
            <FiHeart className="text-2xl" />
            {wishlistItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-300 hover:text-indigo-400 transition-colors p-2">
            <FiShoppingCart className="text-2xl" />
            {cart?.item_count > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {cart.item_count}
              </span>
            )}
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative group">
              <Link to="/profile" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-800/60 transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl py-2 hidden group-hover:block transition-all">
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-gray-200 truncate">{user?.name}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Profile & Orders</Link>
                <Link to="/admin" className="block px-4 py-2 text-sm text-indigo-400 font-semibold hover:bg-gray-800">Admin Dashboard</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 text-sm rounded-xl">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-2xl text-gray-300">
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-800 pt-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-100"
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
