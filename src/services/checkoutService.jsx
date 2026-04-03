import api from './api';
import { API_ENDPOINTS } from '@/constants';

export const checkoutService = {
  createCheckoutSession: async (data) => {
    const response = await api.post(API_ENDPOINTS.CHECKOUT, data);
    return response.data;
  },

  redirectToCheckout: async (data) => {
    const { checkoutUrl } = await checkoutService.createCheckoutSession(data);
    window.location.href = checkoutUrl;
  },
};
