import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiBox } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category_id: 9,
    brand: '',
    price: '',
    original_price: '',
    stock: 20,
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProducts({ per_page: 20 });
      if (res.data.success) setProducts(res.data.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.createProduct(formData);
      if (res.data.success) {
        toast.success('Product Created!');
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Product Inventory Management</h1>
          <p className="text-xs text-gray-400">Add, edit, or remove products and set stock alerts</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4">
          <FiPlus /> Add New Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                  className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
                />
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-100"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2 px-4 text-xs">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4 text-xs">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-950 text-gray-400 font-bold uppercase">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <img src={p.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                  {p.name}
                </td>
                <td className="p-4 text-gray-400">{p.brand}</td>
                <td className="p-4 font-bold text-emerald-400">₹{p.price}</td>
                <td className="p-4">
                  <span className={`font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-gray-300'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300">
                    <FiTrash2 className="inline text-base" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
