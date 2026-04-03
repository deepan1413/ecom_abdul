import api from './api';
import { API_ENDPOINTS } from '@/constants';

// Cache for products to avoid refetching
let productsCache = null;

export const productService = {
  getProducts: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get(
      `${API_ENDPOINTS.PRODUCTS}${params.toString() ? `?${params.toString()}` : ''}`
    );
    
    // Cache the products
    if (response.data.products) {
      productsCache = response.data.products;
    }
    
    return response.data;
  },

  getProductById: async (id) => {
    // Try direct endpoint first
    try {
      const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
      return response.data;
    } catch (error) {
      // If 404, try to find from cached products or fetch all
      if (error.response?.status === 404) {
        if (!productsCache) {
          const allProducts = await productService.getProducts({});
          productsCache = allProducts.products || [];
        }
        const product = productsCache.find(p => p.id === id || p._id === id || String(p.id) === String(id));
        if (product) {
          return product;
        }
      }
      throw error;
    }
  },

  searchProducts: async (query) => {
    const response = await api.get(
      `${API_ENDPOINTS.PRODUCTS}?search=${encodeURIComponent(query)}`
    );
    return response.data.products || [];
  },

  getProductsByCategory: async (category) => {
    const response = await api.get(
      `${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}`
    );
    return response.data.products || [];
  },
};
