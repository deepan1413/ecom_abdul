import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
        toast.success('Added to cart');
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
        toast.success('Removed from cart');
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Merge local cart with server cart after login
      mergeWithServerCart: async (serverCart) => {
        const localItems = get().items;
        
        if (!serverCart || serverCart.length === 0) {
          // No server cart, sync local to server
          if (localItems.length > 0) {
            try {
              await userService.updateCart(localItems);
            } catch (error) {
              console.error('Failed to sync cart to server:', error);
            }
          }
          return;
        }
        
        // Merge: combine local and server, sum quantities for duplicates
        const mergedMap = new Map();
        
        serverCart.forEach((item) => {
          mergedMap.set(item.product.id, item);
        });
        
        localItems.forEach((item) => {
          const existing = mergedMap.get(item.product.id);
          if (existing) {
            mergedMap.set(item.product.id, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            mergedMap.set(item.product.id, item);
          }
        });
        
        const mergedItems = Array.from(mergedMap.values());
        set({ items: mergedItems });
        
        // Sync merged cart back to server
        try {
          await userService.updateCart(mergedItems);
        } catch (error) {
          console.error('Failed to sync merged cart to server:', error);
        }
      },
      
      syncToServer: async () => {
        try {
          await userService.updateCart(get().items);
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },
    }),
    {
      name: STORAGE_KEYS.CART,
    }
  )
);
