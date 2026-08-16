import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiUser, FiMail, FiLock, FiPhone, FiCpu } from 'react-icons/fi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password, phone);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl mx-auto shadow-lg shadow-indigo-500/30">
            <FiCpu />
          </div>
          <h2 className="text-2xl font-black text-white">Create Account</h2>
          <p className="text-xs text-gray-400">Join ShopSmart  for personalized recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Raj Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100"
              />
              <FiUser className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="raj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100"
              />
              <FiMail className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
            <div className="relative">
              <input
                type="text"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100"
              />
              <FiPhone className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/30"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
