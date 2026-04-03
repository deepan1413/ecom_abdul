import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/stores';
import { cn, formatCurrency, getDiscountPercentage } from '@/utils';
import { Rating, Badge, Button } from '../ui';

export default function ProductCard({ product, className }) {
  const [imageError, setImageError] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const inWishlist = isInWishlist(product.id);
  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const imageUrl = product.image_url || product.image || product.images?.[0] || '/placeholder.jpg';

  return (
    <div
      className={cn(
        'group bg-white dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700',
        'transition-all duration-300 hover:shadow-soft hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-100 dark:bg-surface-700">
        <Link to={`/products/${product.id}`}>
          <img
            src={imageError ? '/placeholder.jpg' : imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <Badge variant="danger" className="absolute top-2 left-2">
            -{discount}%
          </Badge>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleItem(product)}
            className={cn(
              'p-2 rounded-full bg-white dark:bg-surface-800 shadow-md transition-colors',
              inWishlist 
                ? 'text-red-500' 
                : 'text-surface-600 dark:text-surface-400 hover:text-red-500'
            )}
          >
            <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
          </button>
          <Link
            to={`/products/${product.id}`}
            className="p-2 rounded-full bg-white dark:bg-surface-800 shadow-md text-surface-600 dark:text-surface-400 hover:text-primary-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            fullWidth
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">
            {product.category}
          </p>
        )}

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-surface-900 dark:text-surface-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <Rating value={product.rating} size="sm" />
            <span className="text-xs text-surface-500">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-surface-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
