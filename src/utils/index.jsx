export function cn(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x.trim() !== '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatCurrency(amount, currency = 'KWD') {
  return new Intl.NumberFormat('en-KW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

export function truncate(str, length) {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function getDiscountPercentage(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function getStockStatus(stock) {
  if (stock > 10) return { label: 'In Stock', color: 'success' };
  if (stock > 0) return { label: `Only ${stock} left`, color: 'warning' };
  return { label: 'Out of Stock', color: 'danger' };
}
