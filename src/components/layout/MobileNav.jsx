import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Sparkles } from 'lucide-react';
import { useCartStore, useAIStore } from '@/stores';
import { cn } from '@/utils';

export default function MobileNav() {
  const cartItems = useCartStore((state) => state.items);
  const openChat = useAIStore((state) => state.openChat);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/products', icon: Search, label: 'Browse' },
    { action: openChat, icon: Sparkles, label: 'AI', special: true },
    { to: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <div className={cn(
                  'p-2 rounded-full',
                  item.special && 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full h-full relative',
                  isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-surface-500 dark:text-surface-400'
                )
              }
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
