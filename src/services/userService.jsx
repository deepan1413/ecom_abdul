import api from './api';
import { API_ENDPOINTS } from '@/constants';

export const userService = {
  getUserDetails: async () => {
    const response = await api.get(API_ENDPOINTS.USER_DETAILS);
    return response.data;
  },

  updateUserDetails: async (data) => {
    const response = await api.put(API_ENDPOINTS.USER_DETAILS, data);
    return response.data;
  },

  updateCart: async (cart) => {
    await api.put(API_ENDPOINTS.USER_DETAILS, { cart });
  },

  updateWishlist: async (wishlist) => {
    await api.put(API_ENDPOINTS.USER_DETAILS, { wishlist });
  },

  addAddress: async (address) => {
    const response = await api.post(`${API_ENDPOINTS.USER_DETAILS}/address`, address);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    await api.delete(`${API_ENDPOINTS.USER_DETAILS}/address/${addressId}`);
  },
};
