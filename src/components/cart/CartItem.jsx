import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores';
import { formatCurrency } from '@/utils';
import { Button } from '../ui';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const imageUrl = product.image_url || product.image || product.images?.[0] || '/placeholder.jpg';

  return (
    <div className="flex gap-4 p-4 border-b border-surface-200 dark:border-surface-700 last:border-0">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-surface-900 dark:text-surface-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <p className="text-sm text-surface-500 mt-1">{product.category}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="p-1 rounded-md border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-1 rounded-md border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(product.price * quantity)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-surface-500">
                {formatCurrency(product.price)} each
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(product.id)}
        className="flex-shrink-0 text-surface-400 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
