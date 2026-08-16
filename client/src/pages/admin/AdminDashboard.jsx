import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [kpiRes, revRes, topRes, catRes, ordersRes] = await Promise.all([
          adminAPI.getDashboardKPIs(),
          adminAPI.getRevenueAnalytics(),
          adminAPI.getTopProductsAnalytics(),
          adminAPI.getCategoryDistribution(),
          adminAPI.getOrders()
        
        ]);

        if (kpiRes.data.success) setKpis(kpiRes.data.data);
        if (revRes.data.success) setRevenueData(revRes.data.data);
        if (topRes.data.success) setTopProducts(topRes.data.data);
        if (catRes.data.success) setCategoryDist(catRes.data.data);
        if (ordersRes.data.success) setOrders(ordersRes.data.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }


  loadAdminData();
}, []);

const handleStatusChange = async (id, status) => {
    try {
        const res = await adminAPI.updateOrderStatus(id, status);

        if (res.data.success) {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id
                        ? { ...order, status: status }
                        : order
                )
            );
        }
    } catch (err) {
        console.error("Failed to update order status:", err);
    }
};

  if (loading) return <div className="max-w-7xl mx-auto p-10 text-center text-gray-400">Loading Admin Dashboard...</div>;

  // Revenue Line Chart Data
  const lineChartData = {
    labels: revenueData.map((d) => d.month_name || d.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData.map((d) => d.revenue),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Category Doughnut Data
  const doughnutData = {
    labels: categoryDist.map((c) => c.category),
    datasets: [
      {
        data: categoryDist.map((c) => c.product_count),
        backgroundColor: ['#6366F1', '#A855F7', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Store Analytics</span>
          <h1 className="text-3xl font-black text-white">Recruiter Admin Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary text-xs py-2 px-4">Manage Products</Link>
          <Link to="/admin/analytics" className="btn-primary text-xs py-2 px-4">SQL Sales Analytics</Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <FiDollarSign className="text-xl" />
          </div>
          <p className="text-2xl font-black text-white">₹{kpis?.total_revenue?.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <FiShoppingBag className="text-xl" />
          </div>
          <p className="text-2xl font-black text-white">{kpis?.total_orders}</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-pink-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Users</span>
            <FiUsers className="text-xl" />
          </div>
          <p className="text-2xl font-black text-white">{kpis?.total_users}</p>
        </div>

        <div className="p-5 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Alerts</span>
            <FiAlertTriangle className="text-xl" />
          </div>
          <p className="text-2xl font-black text-white">{kpis?.low_stock_alerts} Products</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FiBarChart2 className="text-indigo-400" /> Monthly Revenue Trend
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white">Product Category Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Orders Management */}
<div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
    <h3 className="text-sm font-bold text-white">
        Recent Orders
    </h3>

    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-gray-400 uppercase">
                <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="p-3 font-bold text-indigo-400">
                            {order.order_number || `#${order.id}`}
                        </td>

                        <td className="p-3">
                            {order.user_id}
                        </td>

                        <td className="p-3">
                            ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="p-3 capitalize">
                            {order.status}
                        </td>

                        <td className="p-3">
                            <select
                                value={order.status || ""}
                                onChange={(e) =>
                                    handleStatusChange(
                                        order.id,
                                        e.target.value
                                    )
                                }
                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="confirmed">Confirmed</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">
                                    Out for Delivery
                                </option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

      {/* Top Products Table */}
      <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white">Top Performing Products (Ranked by Revenue)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-950 text-gray-400 uppercase font-bold">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Product</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Units Sold</th>
                <th className="p-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topProducts.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-bold text-indigo-400">#{p.rank}</td>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <img src={p.thumbnail} alt="" className="w-7 h-7 rounded object-cover" />
                    {p.name}
                  </td>
                  <td className="p-3 text-gray-400">{p.brand}</td>
                  <td className="p-3 font-bold">{p.units_sold}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">₹{p.total_revenue?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
