import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';
import { FiStar, FiShoppingCart, FiHeart, FiShield, FiTruck, FiRotateCcw, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState({ frequently_bought_together: [], similar_products: [] });
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await productAPI.getProduct(slug);
        console.log("SLUG:", slug);
        console.log("PRODUCT RESPONSE:", res.data);
        
        if (res.data.success) {
          const p = res.data.data;
          setProduct(p);
          setSelectedImage(p.thumbnail || p.images?.[0] || '');
          if (p.colors?.length) setSelectedColor(p.colors[0]);
          if (p.sizes?.length) setSelectedSize(p.sizes[0]);

          // Fetch recommendations and reviews
          const [recRes, revRes] = await Promise.all([
            productAPI.getRecommendations(p.id),
            reviewAPI.getProductReviews(p.id)
          ]);
          if (recRes.data.success) setRecommendations(recRes.data.data);
          if (revRes.data.success) setReviews(revRes.data.data.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error('Please provide review title and body');
      return;
    }
    try {
      const res = await reviewAPI.createReview({
        product_id: product.id,
        rating: newRating,
        title: newTitle,
        body: newBody
      });
      if (res.data.success) {
        toast.success('Review submitted!');
        setNewTitle('');
        setNewBody('');
        // Refresh reviews
        const revRes = await reviewAPI.getProductReviews(product.id);
        if (revRes.data.success) setReviews(revRes.data.data.items || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto p-8 text-center text-gray-400">Loading Product...</div>;
  if (!product) return <div className="max-w-7xl mx-auto p-8 text-center text-red-400">Product not found</div>;

  const isSaved = isInWishlist(product.id);
  const images = product.images || [product.thumbnail];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-indigo-500 scale-105' : 'border-gray-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs & Buy Box */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{product.brand}</span>
            <h1 className="text-3xl font-black text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center text-yellow-400 font-bold">
                <FiStar className="fill-current mr-1" /> {product.avg_rating || 4.5}
              </div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">{product.review_count || 12} customer reviews</span>
              <span className="text-gray-500">|</span>
              <span className={product.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex items-baseline gap-4">
            <span className="text-3xl font-black text-white">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <span className="text-sm text-gray-500 line-through">
                ₹{parseFloat(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-gray-400 ml-auto">+ 18% GST Applicable</span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color: {selectedColor}</h4>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedColor === c ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-gray-800 text-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Size: {selectedSize}</h4>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      selectedSize === s ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-gray-800 text-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="flex gap-4 pt-4">
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white px-2 font-bold">-</button>
              <span className="text-sm font-bold text-white px-3">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-white px-2 font-bold">+</button>
            </div>

            <button
              onClick={() => addToCart(product.id, quantity, selectedColor, selectedSize)}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
            >
              <FiShoppingCart /> Add to Shopping Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border transition-all ${
                isSaved ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'border-gray-800 text-gray-400 hover:text-pink-400'
              }`}
            >
              <FiHeart className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together (Amazon Style Recs) */}
      {recommendations.frequently_bought_together?.length > 0 && (
        <section className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            Frequently Bought Together <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">AI Combo</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendations.frequently_bought_together.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Product Reviews */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-white">Customer Reviews</h3>
        
        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-gray-200">Write a Product Review</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className={`text-2xl ${star <= newRating ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Review Title (e.g. Excellent quality!)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100"
          />
          <textarea
            rows="3"
            placeholder="Write your review experience..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-100"
          />
          <button type="submit" className="btn-primary py-2 px-6 text-sm">Submit Review</button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to write one!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-200">{rev.user_name || 'Verified Customer'}</span>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <h5 className="text-sm font-bold text-white">{rev.title}</h5>
                <p className="text-xs text-gray-400">{rev.body}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
