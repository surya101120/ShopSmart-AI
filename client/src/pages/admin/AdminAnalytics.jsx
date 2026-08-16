import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiDatabase, FiTrendingUp, FiUsers, FiDollarSign, FiPercent } from 'react-icons/fi';

export default function AdminAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [mRes, topRes] = await Promise.all([
          adminAPI.getCustomerMetrics(),
          adminAPI.getTopProductsAnalytics()
        ]);
        if (mRes.data.success) setMetrics(mRes.data.data);
        if (topRes.data.success) setTopProducts(topRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto p-10 text-center text-gray-400">Executing SQL Analytics Queries...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-800 pb-6">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
          <FiDatabase /> Advanced SQL Engine Analytics
        </span>
        <h1 className="text-3xl font-black text-white">Sales & Customer Lifetime Value (CLV)</h1>
        <p className="text-xs text-gray-400 mt-1">Calculated via MySQL CTEs, Window Functions (DENSE_RANK), and Group By HAVING queries</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Average Order Value (AOV)</span>
          <p className="text-3xl font-black text-indigo-400">₹{metrics?.average_order_value}</p>
        </div>

        <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
          <p className="text-3xl font-black text-emerald-400">₹{metrics?.total_revenue?.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Repeat Customers</span>
          <p className="text-3xl font-black text-purple-400">{metrics?.repeat_customers}</p>
        </div>

        <div className="p-6 bg-gray-900/60 border border-gray-800 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Repeat Customer Rate</span>
          <p className="text-3xl font-black text-pink-400">{metrics?.repeat_customer_rate}%</p>
        </div>
      </div>

      {/* SQL Code Showcase Box for Recruiters */}
      <div className="p-6 bg-gray-950 border border-indigo-500/30 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
          <FiDatabase /> Recruiter Spotlight: MySQL Window Function Query Executed
        </h3>
        <pre className="p-4 bg-gray-900 rounded-2xl text-xs text-emerald-400 overflow-x-auto font-mono">
{`WITH ProductSales AS (
  SELECT 
    p.id, p.name, p.brand,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.total_price) AS total_revenue,
    DENSE_RANK() OVER (ORDER BY SUM(oi.total_price) DESC) as sales_rank
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status NOT IN ('cancelled', 'refunded')
  GROUP BY p.id, p.name, p.brand
)
SELECT id, name, brand, units_sold, total_revenue, sales_rank
FROM ProductSales WHERE sales_rank <= 10;`}
        </pre>
      </div>
    </div>
  );
}
