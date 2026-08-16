import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderAPI, paymentAPI } from '../services/api';
import { FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const couponCode = location.state?.couponCode;

  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or stripe
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: 'Raj Kumar',
    phone: '9876543210',
    address_line1: 'Flat 402, Green Valley Apartments',
    address_line2: 'Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await orderAPI.createOrder({
        shipping_address: address,
        payment_method: paymentMethod,
        coupon_code: couponCode
      });

      if (res.data.success) {
        const order = res.data.data;

        // If Stripe payment
        if (paymentMethod === 'stripe') {
          const payRes = await paymentAPI.createIntent(order.id);
          if (payRes.data.success) {
            // Confirm test payment directly for demonstration
            await paymentAPI.confirmPayment({
              order_id: order.id,
              payment_id: payRes.data.data.payment_id
            });
          }
        }

        toast.success('Order Placed Successfully! 🎉');
        clearCart();
        navigate(`/orders/${order.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-black text-white">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiTruck className="text-indigo-400" /> Shipping Address
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                required
                className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
                className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={address.address_line1}
                onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                required
                className="col-span-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
                className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
                className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiCreditCard className="text-indigo-400" /> Select Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-gray-800 text-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">Cash on Delivery</span>
                  {paymentMethod === 'cod' && <FiCheckCircle className="text-indigo-400" />}
                </div>
                <span className="text-[10px] text-gray-500 mt-2">Pay when order arrives</span>
              </label>

              <label
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-gray-800 text-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">Stripe Test Payment</span>
                  {paymentMethod === 'stripe' && <FiCheckCircle className="text-indigo-400" />}
                </div>
                <span className="text-[10px] text-gray-500 mt-2">Instant online checkout</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Place Order */}
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-6 h-fit">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-4">Checkout Total</h3>

          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹{cart.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{cart.gst_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{cart.shipping_cost}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-black text-white border-t border-gray-800 pt-4">
            <span>Total Payable</span>
            <span className="text-indigo-400">₹{cart.total_amount?.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold shadow-xl shadow-indigo-600/30"
          >
            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
