import React, { useState } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiShoppingBag } from 'react-icons/fi';
import { chatbotAPI } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi! I'm ShopSmart  assistant. Ask me anything like 'Which laptop is best for coding?' or 'Show me Nike shoes under ₹10,000'!",
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await chatbotAPI.sendMessage(userMsg, []);
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.reply,
            products: res.data.recommended_products || []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I am having trouble connecting right now. Try again later.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 ring-4 ring-indigo-500/20"
        >
          <FiCpu className="text-2xl animate-pulse" />
          <span className="font-bold text-sm hidden sm:inline">AI Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 border border-gray-800 w-80 sm:w-96 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FiCpu className="text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-sm">ShopSmart AI Assistant</h4>
                <span className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online & Powered by Gemini
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-200 border border-gray-700/60 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Attached Recommended Products */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-1.5 w-full">
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <FiShoppingBag /> Recommended Products
                    </p>
                    {msg.products.map((p) => (
                      <Link
                        key={p.id}
                        to={`/products/${p.slug || p.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 p-2 bg-gray-950 border border-gray-800 rounded-xl hover:border-indigo-500 transition-all"
                      >
                        <img src={p.thumbnail} alt={p.name} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 truncate">
                          <p className="text-xs font-semibold text-gray-200 truncate">{p.name}</p>
                          <p className="text-xs text-indigo-400 font-bold">₹{p.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1 text-gray-400 text-xs bg-gray-800/50 p-2 rounded-xl w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-gray-950 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all"
            >
              <FiSend className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
