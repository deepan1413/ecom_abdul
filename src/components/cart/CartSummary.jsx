import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Shield, Truck } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/stores';
import { formatCurrency } from '@/utils';
import { Button, Card } from '../ui';

export default function CartSummary() {
  const navigate = useNavigate();
  const { items, getSubtotal } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Card className="sticky top-24">
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 pb-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex justify-between">
          <span className="text-surface-600 dark:text-surface-400">
            Subtotal ({items.length} items)
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-600 dark:text-surface-400">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-600 dark:text-surface-400">Tax (5%)</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between py-4 border-b border-surface-200 dark:border-surface-700">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 50 && (
        <div className="py-4 border-b border-surface-200 dark:border-surface-700">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
            Add {formatCurrency(50 - subtotal)} more for free shipping!
          </p>
          <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <Button
        fullWidth
        size="lg"
        onClick={handleCheckout}
        disabled={items.length === 0}
        leftIcon={<ShoppingBag className="w-5 h-5" />}
        className="mt-4"
      >
        {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
      </Button>

      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2 text-sm text-surface-500 mb-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-500">
          <Truck className="w-4 h-4 text-primary-500" />
          <span>Free shipping on orders over 50 KD</span>
        </div>
      </div>
    </Card>
  );
}
