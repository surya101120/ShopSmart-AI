import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import OrderStepper from '../components/ui/OrderStepper';
import { FiDownload, FiPackage, FiTruck, FiMapPin, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await orderAPI.getOrder(orderId);
        if (res.data.success) setOrder(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    try {
      const res = await orderAPI.downloadInvoice(orderId);
      
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${order.order_number}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF Invoice downloaded successfully'); 
    } catch (err) {
      console.error(err);
      toast.error('Failed to download invoice'); 
    }
  };

  const handleCancelOrder = async () => {
  try {
    const res = await orderAPI.cancelOrder(orderId);

    if (res.data.success) {
      toast.success("Order cancelled successfully");
      setOrder(res.data.data);
    }
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.message || "Failed to cancel order"
    );
  }
};

  if (loading) return <div className="max-w-4xl mx-auto p-10 text-center text-gray-400">Loading Order Details...</div>;
  if (!order) return <div className="max-w-4xl mx-auto p-10 text-center text-red-400">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Order Details</span>
          <h1 className="text-2xl font-black text-white">{order.order_number}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Placed on {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
        </div>

        <button
        onClick={handleDownloadInvoice}
        className="btn-secondary flex items-center gap-2 text-xs py-2 px-4"
        >
          <FiDownload /> Download PDF Invoice
          </button>
          
          {order.status?.toLowerCase() !== "cancelled" && (
            <button
            onClick={handleCancelOrder}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
            >
              Cancel Order
              </button>
          )}
      </div>

      {/* Visual Tracking Stepper */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-200">Live Order Tracking</h3>
        <OrderStepper status={order.status} updatedAt={order.updated_at} />
      </div>

      {/* Items List */}
      <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FiPackage className="text-indigo-400" /> Purchased Items
        </h3>
        <div className="divide-y divide-gray-800">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={item.thumbnail} alt="" className="w-12 h-12 object-cover rounded-xl bg-gray-950" />
                <div>
                  <h4 className="font-bold text-gray-200">{item.product_name}</h4>
                  <p className="text-gray-400">Qty: {item.quantity} × ₹{item.unit_price}</p>
                </div>
              </div>
              <span className="font-bold text-white">₹{item.total_price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Price Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <FiMapPin className="text-indigo-400" /> Delivery Address
          </h4>
          <p className="text-gray-300 font-semibold">{order.shipping_address?.name}</p>
          <p className="text-gray-400">{order.shipping_address?.address_line1}, {order.shipping_address?.address_line2}</p>
          <p className="text-gray-400">{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
          <p className="text-gray-400">Phone: {order.shipping_address?.phone}</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-2 text-xs">
          <h4 className="font-bold text-white border-b border-gray-800 pb-2">Payment Summary</h4>
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>GST (18%)</span>
            <span>₹{order.gst_amount}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span>₹{order.shipping_cost}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-indigo-400 pt-2 border-t border-gray-800">
            <span>Total Paid ({order.payment_method.toUpperCase()})</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
