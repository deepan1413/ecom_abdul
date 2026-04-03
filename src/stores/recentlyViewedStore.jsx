import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

const MAX_RECENT_ITEMS = 10;

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const filtered = items.filter((item) => item.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
        set({ items: updated });
      },
      
      clearItems: () => {
        set({ items: [] });
      },
    }),
    {
      name: STORAGE_KEYS.RECENTLY_VIEWED,
    }
  )
);
