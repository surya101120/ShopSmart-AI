// App-wide constants for ShopSmart AI

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

export const GST_RATE = 0.18;
export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_COST = 49;
export const ITEMS_PER_PAGE = 12;

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/30' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30' },
  packed: { label: 'Packed', color: 'text-indigo-400', bg: 'bg-indigo-400/20', border: 'border-indigo-400/30' },
  shipped: { label: 'Shipped', color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/30' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/30' },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/30' },
  refunded: { label: 'Refunded', color: 'text-gray-400', bg: 'bg-gray-400/20', border: 'border-gray-400/30' },
};

export const PAYMENT_METHODS = {
  stripe: { label: 'Credit / Debit Card', icon: '💳' },
  cod: { label: 'Cash on Delivery', icon: '💵' },
  upi: { label: 'UPI', icon: '📱' },
  netbanking: { label: 'Net Banking', icon: '🏦' },
};

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'discount', label: 'Discount' },
  { value: 'popularity', label: 'Popularity' },
];

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻', slug: 'electronics', subcategories: ['Laptops', 'Smartphones', 'Tablets', 'Cameras', 'Audio', 'Wearables'] },
  { id: 'fashion', name: 'Fashion', icon: '👗', slug: 'fashion', subcategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Jewellery'] },
  { id: 'home', name: 'Home & Kitchen', icon: '🏠', slug: 'home-kitchen', subcategories: ['Furniture', 'Bedding', 'Kitchen', 'Decor', 'Appliances', 'Tools'] },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', slug: 'sports', subcategories: ['Gym Equipment', 'Outdoor', 'Cricket', 'Football', 'Cycling', 'Yoga'] },
  { id: 'beauty', name: 'Beauty & Health', icon: '💄', slug: 'beauty', subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrances', 'Supplements', 'Wellness'] },
  { id: 'books', name: 'Books', icon: '📚', slug: 'books', subcategories: ['Fiction', 'Non-Fiction', 'Academic', 'Children', 'Comics', 'Self-Help'] },
  { id: 'toys', name: 'Toys & Games', icon: '🧸', slug: 'toys', subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'STEM Toys', 'Outdoor', 'Video Games'] },
  { id: 'automotive', name: 'Automotive', icon: '🚗', slug: 'automotive', subcategories: ['Car Accessories', 'Tools', 'Cleaning', 'Safety', 'Tires', 'Electronics'] },
  { id: 'grocery', name: 'Grocery', icon: '🛒', slug: 'grocery', subcategories: ['Snacks', 'Beverages', 'Staples', 'Organic', 'Dairy', 'Frozen'] },
  { id: 'pets', name: 'Pets', icon: '🐾', slug: 'pets', subcategories: ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Animals', 'Reptiles'] },
];

export const BRANDS = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Boat', 'OnePlus',
  'Lenovo', 'HP', 'Dell', 'Asus', 'Puma', 'Bose', 'JBL', 'Xiaomi',
];

export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Brown', value: '#92400E' },
];

export const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
export const SIZES_SHOES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

export const DISCOUNT_RANGES = [
  { label: '10% or more', value: 10 },
  { label: '20% or more', value: 20 },
  { label: '30% or more', value: 30 },
  { label: '50% or more', value: 50 },
  { label: '70% or more', value: 70 },
];

export const RATING_OPTIONS = [4, 3, 2, 1];

export const ADDRESS_TYPES = ['Home', 'Work', 'Other'];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export const CHART_COLORS = {
  primary: 'rgba(99, 102, 241, 0.8)',
  secondary: 'rgba(168, 85, 247, 0.8)',
  accent: 'rgba(236, 72, 153, 0.8)',
  success: 'rgba(16, 185, 129, 0.8)',
  warning: 'rgba(245, 158, 11, 0.8)',
  danger: 'rgba(239, 68, 68, 0.8)',
  gradients: {
    indigo: ['rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.1)'],
    purple: ['rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.1)'],
    pink: ['rgba(236, 72, 153, 0.8)', 'rgba(236, 72, 153, 0.1)'],
  },
};

export const TOAST_DURATION = 3000;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'shopsmart_token',
  REFRESH_TOKEN: 'shopsmart_refresh_token',
  CART: 'shopsmart_cart',
  WISHLIST: 'shopsmart_wishlist',
  RECENTLY_VIEWED: 'shopsmart_recently_viewed',
  THEME: 'shopsmart_theme',
};

export const MAX_CART_QUANTITY = 10;
export const MAX_REVIEW_IMAGES = 5;
export const MAX_IMAGE_SIZE_MB = 5;

export const QUICK_ACTIONS = [
  { label: 'Find laptops under ₹50k', query: 'laptops under 50000' },
  { label: '🔥 Best deals today', query: 'best deals today' },
  { label: '📦 Track my order', query: 'track order' },
  { label: '👟 New arrivals in shoes', query: 'new arrivals shoes' },
];
