import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores';
import { Layout } from '@/components/layout';
import { CartItem, CartSummary } from '@/components/cart';
import { Button, Card } from '@/components/ui';

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Your cart is empty
            </h2>
            <p className="text-surface-500 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
            Shopping Cart ({items.length} items)
          </h1>
          <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600">
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card padding="none">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </Card>

            {/* Continue Shopping */}
            <Link to="/products" className="inline-flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 hover:underline">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
}
