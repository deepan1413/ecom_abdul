export const API_BASE_URL = '';

export const API_ENDPOINTS = {
  SIGNUP: '/api/auth/signup',
  SIGNIN: '/api/auth/signin',
  PRODUCTS: '/api/products',
  USER_DETAILS: '/api/userDetails',
  ORDERS: '/api/orders',
  CHECKOUT: '/api/checkout',
  PAYMENT_WEBHOOK: '/api/webhooks/payment',
  AI: '/api/ai',
  TELEGRAM: '/api/telegram',
  TEST: '/api/test',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'souqii_auth_token',
  USER: 'souqii_user',
  CART: 'souqii_cart',
  WISHLIST: 'souqii_wishlist',
  RECENTLY_VIEWED: 'souqii_recently_viewed',
  THEME: 'souqii_theme',
};

export const CATEGORIES = [
  { id: 'cpu', name: 'Processors (CPU)', icon: 'Cpu' },
  { id: 'gpu', name: 'Graphics Cards (GPU)', icon: 'Monitor' },
  { id: 'motherboard', name: 'Motherboards', icon: 'CircuitBoard' },
  { id: 'ram', name: 'Memory (RAM)', icon: 'MemoryStick' },
  { id: 'storage', name: 'Storage (SSD/HDD)', icon: 'HardDrive' },
  { id: 'psu', name: 'Power Supplies (PSU)', icon: 'Zap' },
  { id: 'case', name: 'PC Cases', icon: 'Box' },
  { id: 'cooling', name: 'Cooling & Fans', icon: 'Fan' },
  { id: 'peripherals', name: 'Peripherals', icon: 'Keyboard' },
  { id: 'monitors', name: 'Monitors', icon: 'Monitor' },
];

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const CURRENCY = {
  code: 'KWD',
  symbol: 'KD',
  name: 'Kuwaiti Dinar',
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
