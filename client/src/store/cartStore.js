import { create } from 'zustand';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  cart: {
    items: [],
    subtotal: 0,
    gst_amount: 0,
    shipping_cost: 0,
    total_amount: 0,
    item_count: 0
  },
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartAPI.getCart();
      if (res.data.success) {
        set({ cart: res.data.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, color = null, size = null) => {
    try {
      const res = await cartAPI.addToCart({ product_id: productId, quantity, color, size });
      if (res.data.success) {
        toast.success('Added to cart!');
        get().fetchCart();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item to cart');
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      get().fetchCart();
    } catch (err) {
      toast.error('Failed to update cart');
    }
  },

  removeItem: async (itemId) => {
    try {
      await cartAPI.removeCartItem(itemId);
      toast.success('Item removed');
      get().fetchCart();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
      set({
        cart: { items: [], subtotal: 0, gst_amount: 0, shipping_cost: 0, total_amount: 0, item_count: 0 }
      });
    } catch (err) {
      console.error(err);
    }
  }
}));
