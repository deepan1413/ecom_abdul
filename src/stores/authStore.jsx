import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import { authService } from '@/services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      signUp: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signUp(data);
          set({ 
            user: response.user, 
            token: response.token, 
            isLoading: false 
          });
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          return response;
        } catch (error) {
          const message = error.response?.data?.message || 'Sign up failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      signIn: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signIn(credentials);
          set({ 
            user: response.user, 
            token: response.token, 
            isLoading: false 
          });
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
          return response;
        } catch (error) {
          const message = error.response?.data?.message || 'Sign in failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      signOut: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      },
      
      isAuthenticated: () => {
        return !!get().token;
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
