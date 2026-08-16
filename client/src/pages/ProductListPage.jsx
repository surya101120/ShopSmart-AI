import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { FiFilter, FiSearch, FiSliders } from 'react-icons/fi';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let res;
        if (search) {
          res = await productAPI.searchAI(search);
          if (res.data.success) {
            setProducts(res.data.data.items || []);
          }
        } else {
          res = await productAPI.getProducts({
            category,
            brand,
            min_price: minPrice,
            max_price: maxPrice,
            sort
          });
          if (res.data.success) {
            setProducts(res.data.data.items || []);
          }
        }

        const catRes = await productAPI.getCategories();
        if (catRes.data.success) setCategories(catRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [search, category, brand, minPrice, maxPrice, sort]);

  const updateFilter = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">
            {search ? `AI Search: "${search}"` : category ? `Category: ${category}` : 'Product Catalog'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">Showing {products.length} products matching your criteria</p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-gray-900/40 border border-gray-800 p-5 rounded-2xl h-fit">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
            <FiSliders /> Filter Products
          </h3>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Category</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => updateFilter('category', '')}
                className={`block w-full text-left py-1.5 px-2 rounded-lg ${!category ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter('category', c.slug)}
                  className={`block w-full text-left py-1.5 px-2 rounded-lg ${category === c.slug ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Max Price (₹)</h4>
            <input
              type="number"
              placeholder="e.g. 60000"
              value={maxPrice}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => setSearchParams({})}
            className="w-full py-2 text-xs font-semibold text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all"
          >
            Clear All Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 6].map((n) => (
                <div key={n} className="h-80 bg-gray-900/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-gray-800">
              <FiSearch className="text-4xl text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
              <p className="text-xs text-gray-400">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
