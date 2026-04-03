import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Souqii
              </span>
            </Link>
            <p className="text-surface-400 mb-4">
              Your one-stop shop for electronics, PC parts, and more. 
              Quality products at competitive prices.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/products?category=${category.id}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-400 transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>Kuwait City, Kuwait</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href="tel:+96512345678" className="hover:text-primary-400 transition-colors">
                  +965 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href="mailto:support@souqii.com" className="hover:text-primary-400 transition-colors">
                  support@souqii.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 text-sm">
            © {new Date().getFullYear()} Souqii. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
