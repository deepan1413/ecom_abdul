import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Heart, Menu, X, 
  Sun, Moon, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuthStore, useCartStore, useThemeStore, useWishlistStore, useAIStore, useProductStore } from '@/stores';
import { useDebounce, useOnClickOutside } from '@/hooks';
import { cn } from '@/utils';
import { CATEGORIES } from '@/constants';
import Button from '../ui/Button';

export default function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openChat } = useAIStore();
  const { searchProducts } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  useOnClickOutside(searchRef, () => setShowSearch(false));
  useOnClickOutside(userMenuRef, () => setShowUserMenu(false));
  useOnClickOutside(categoriesRef, () => setShowCategories(false));

  useEffect(() => {
    if (debouncedSearch.length > 2) {
      searchProducts(debouncedSearch).then(setSearchResults);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [debouncedSearch, searchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Souqii
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                {/* AI Mode Button */}
                <button
                  type="button"
                  onClick={openChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:opacity-90 transition-opacity"
                  title="AI Assistant"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 6).map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                  >
                    <img
                      src={product.image_url || product.image || product.images?.[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {product.price} KD
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="block p-3 text-center text-primary-600 dark:text-primary-400 hover:bg-surface-50 dark:hover:bg-surface-700 border-t border-surface-200 dark:border-surface-700"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  View all results
                </Link>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <ChevronDown className={cn('w-4 h-4 transition-transform hidden sm:block', showUserMenu && 'rotate-180')} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-2 animate-fade-in">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                        <p className="font-medium text-surface-900 dark:text-surface-100">
                          {user.name || user.email}
                        </p>
                        <p className="text-sm text-surface-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Orders
                      </Link>
                      <hr className="my-2 border-surface-200 dark:border-surface-700" />
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="block px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth?mode=signup"
                        className="block px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="hidden md:flex items-center gap-6 h-12 text-sm">
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Menu className="w-4 h-4" />
              All Categories
              <ChevronDown className={cn('w-4 h-4 transition-transform', showCategories && 'rotate-180')} />
            </button>

            {showCategories && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 py-2 animate-fade-in z-50">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700"
                    onClick={() => setShowCategories(false)}
                  >
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            All Products
          </Link>
          <Link to="/products?category=cpu" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            CPUs
          </Link>
          <Link to="/products?category=gpu" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            GPUs
          </Link>
          <Link to="/products?category=motherboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Motherboards
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-surface-900 z-50 animate-fade-in">
          <div className="p-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                />
                <button
                  type="button"
                  onClick={openChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <nav className="space-y-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="block px-4 py-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-4 py-3 mt-4 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
