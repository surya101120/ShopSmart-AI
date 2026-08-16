import { create } from 'zustand';
import { wishlistAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await wishlistAPI.getWishlist();
      if (res.data.success) {
        set({ items: res.data.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (product) => {
    const { items } = get();
    const exists = items.some(i => i.product_id === product.id || i.product?.id === product.id);

    try {
      if (exists) {
        await wishlistAPI.removeFromWishlist(product.id);
        toast.success('Removed from Wishlist ❤️');
      } else {
        await wishlistAPI.addToWishlist(product.id);
        toast.success('Saved to Wishlist ❤️');
      }
      get().fetchWishlist();
    } catch (err) {
      toast.error('Wishlist update failed');
    }
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some(i => i.product_id === productId || i.product?.id === productId);
  }
}));
