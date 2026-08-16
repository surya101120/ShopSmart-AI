import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { couponAPI } from '../services/api';
import { FiTrash2, FiTag, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await couponAPI.validateCoupon(couponCode, cart.subtotal);
      if (res.data.success) {
        setAppliedDiscount(res.data.data.discount_amount);
        setCouponApplied(true);
        toast.success(`Coupon '${res.data.data.code}' Applied!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    }
  };

console.log("CART DATA:", cart);
console.log("CART ITEMS:", cart.items);
console.log("CART TOTAL:", cart.total_amount);

const finalTotal = Math.max(
  0,
  (cart.total_amount || 0) - appliedDiscount
);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 text-3xl mx-auto">
          <FiShoppingBag />
        </div>
        <h2 className="text-3xl font-black text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">Explore our AI catalog and find amazing products to fill your cart.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white">Shopping Cart ({cart.item_count} Items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex items-center gap-4">
              <img src={item.product?.thumbnail} alt="" className="w-20 h-20 object-cover rounded-xl bg-gray-950" />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{item.product?.name}</h4>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">₹{item.unit_price} each</p>
                {(item.color || item.size) && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {item.color && `Color: ${item.color}`} {item.size && `| Size: ${item.size}`}
                  </p>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-gray-950 border border-gray-800 rounded-xl px-2 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 text-gray-400 font-bold hover:text-white">-</button>
                <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 text-gray-400 font-bold hover:text-white">+</button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="text-sm font-black text-white">₹{item.total_price}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs mt-1">
                  <FiTrash2 className="inline" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-6 h-fit">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-4">Order Summary</h3>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Coupon Code (e.g. WELCOME20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 uppercase"
              />
              <FiTag className="absolute right-3 top-2.5 text-gray-500 text-sm" />
            </div>
            <button
              type="submit"
              disabled={couponApplied}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50"
            >
              Apply
            </button>
          </form>

          {/* Calculation breakdown */}
          <div className="space-y-3 text-xs text-gray-300 border-b border-gray-800 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">₹{cart.subtotal}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Coupon Discount</span>
                <span>-₹{appliedDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{cart.gst_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Cost</span>
              <span>{cart.shipping_cost === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${cart.shipping_cost}`}</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-black text-white">
            <span>Grand Total</span>
            <span className="text-indigo-400">₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { couponCode: couponApplied ? couponCode : null } })}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
          >
            Proceed to Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
