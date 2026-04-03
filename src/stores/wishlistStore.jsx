import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        
        if (!exists) {
          set({ items: [...items, product] });
          toast.success('Added to wishlist');
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        toast.success('Removed from wishlist');
      },
      
      toggleItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: STORAGE_KEYS.WISHLIST,
    }
  )
);
