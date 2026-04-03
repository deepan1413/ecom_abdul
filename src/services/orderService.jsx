import api from './api';
import { API_ENDPOINTS } from '@/constants';

export const orderService = {
  getOrders: async () => {
    const response = await api.get(API_ENDPOINTS.ORDERS);
    return response.data.orders || [];
  },

  getOrderById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post(API_ENDPOINTS.ORDERS, orderData);
    return response.data;
  },
};
