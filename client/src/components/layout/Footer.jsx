import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FiCpu />
              </div>
              <span className="text-white font-extrabold">ShopSmart </span>
            </div>
            <p className="text-sm leading-relaxed">
              Intelligent E-Commerce platform , natural language search, and real-time order tracking.
            </p>
            <div className="flex gap-4 text-xl text-gray-400">
              <a href="#" className="hover:text-indigo-400"><FiGithub /></a>
              <a href="#" className="hover:text-indigo-400"><FiTwitter /></a>
              <a href="#" className="hover:text-indigo-400"><FiInstagram /></a>
              <a href="#" className="hover:text-indigo-400"><FiLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=electronics" className="hover:text-indigo-400">Electronics & Laptops</Link></li>
              <li><Link to="/products?category=smartphones" className="hover:text-indigo-400">Smartphones</Link></li>
              <li><Link to="/products?category=sports" className="hover:text-indigo-400">Sports & Footwear</Link></li>
              <li><Link to="/products?category=gaming" className="hover:text-indigo-400">Gaming Consoles</Link></li>
              <li><Link to="/products?category=headphones" className="hover:text-indigo-400">Audio & Headphones</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-indigo-400">My Account & Orders</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400">Saved Wishlist</Link></li>
              <li><a href="#tracking" className="hover:text-indigo-400">Order Tracking</a></li>
              <li><a href="#help" className="hover:text-indigo-400">AI Assistant Help</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Smart & Updated</h4>
            <p className="text-xs mb-4">Subscribe for exclusive flash sale coupons and product drops.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 w-full"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 ShopSmart . Built for recruitment excellence.</p>
          <div className="flex gap-6">
            <span>Stripe Payments</span>
            <span>JWT Auth</span>
            <span>MySQL 8.0</span>
            <span>Python Flask</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
