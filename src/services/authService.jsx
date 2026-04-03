import api from './api';
import { API_ENDPOINTS } from '@/constants';

export const authService = {
  signUp: async (data) => {
    const response = await api.post(API_ENDPOINTS.SIGNUP, data);
    return response.data;
  },

  signIn: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.SIGNIN, credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.USER_DETAILS);
    return response.data.user;
  },
};
