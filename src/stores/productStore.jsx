import { create } from 'zustand';
import { productService } from '@/services/productService';

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: 'popular',
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        sort: 'popular',
      },
    });
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const pagination = get().pagination;
      
      const response = await productService.getProducts({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      set({
        products: response.products || [],
        pagination: {
          ...pagination,
          total: response.total || 0,
          totalPages: response.totalPages || 1,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await productService.getProducts({ featured: true, limit: 8 });
      set({ featuredProducts: response.products || [] });
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ selectedProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({ 
        error: error.message || 'Failed to fetch product', 
        isLoading: false 
      });
      throw error;
    }
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
    get().fetchProducts();
  },

  searchProducts: async (query) => {
    set({ isLoading: true });
    try {
      const products = await productService.searchProducts(query);
      return products;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
}));
