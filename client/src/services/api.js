import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Service API methods
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getFlashSale: () => api.get('/products/flash-sale'),
  searchAI: (query) => api.get('/products/search/ai', { params: { q: query } }),
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
  getCategories: () => api.get('/categories'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  removeCartItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post('/wishlist/move-to-cart', { product_id: productId }),
};
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  downloadInvoice: (id) => api.get(`/invoice/${id}`, { responseType: 'blob' }),
};

export const paymentAPI = {
  createIntent: (orderId) => api.post('/payments/create-intent', { order_id: orderId }),
  confirmPayment: (data) => api.post('/payments/confirm', data),
};

export const couponAPI = {
  validateCoupon: (code, subtotal) => api.post('/coupons/validate', { code, subtotal }),
  getActiveCoupons: () => api.get('/coupons/active'),
};

export const reviewAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (data) => api.post('/reviews', data),
};

export const chatbotAPI = {
  sendMessage: (message, history) => api.post('/chatbot/message', { message, history }),
};

export const adminAPI = {
  getDashboardKPIs: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getRevenueAnalytics: () => api.get('/analytics/revenue'),
  getTopProductsAnalytics: () => api.get('/analytics/top-products'),
  getCustomerMetrics: () => api.get('/analytics/customer-metrics'),
  getCategoryDistribution: () => api.get('/analytics/category-distribution'),
};

export default api;
