import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ChevronLeft, Shield, Check } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/stores';
import { checkoutService, orderService } from '@/services';
import { Layout } from '@/components/layout';
import { Button, Card, Input } from '@/components/ui';
import { formatCurrency } from '@/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Kuwait',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items, navigate]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const orderData = {
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: shippingInfo,
      total,
    };

    try {
      const order = await orderService.createOrder(orderData);
      const orderId = order?.id || order?._id || order?.orderId || order?.order_id;

      if (!orderId) {
        throw new Error('Order was created but no order ID was returned');
      }

      const response = await checkoutService.createCheckoutSession({ order_id: orderId });
      
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+965 1234 5678"
                    required
                  />
                  <Input
                    label="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, apartment..."
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Method */}
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Shipping Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-lg border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium">Standard Delivery</p>
                        <p className="text-sm text-surface-500">3-5 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </label>
                </div>
              </Card>

              {/* Payment */}
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Payment
                  </h2>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-surface-100 dark:bg-surface-800">
                  <Shield className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    You will be redirected to a secure payment page to complete your purchase.
                  </p>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-3 pb-4 border-b border-surface-200 dark:border-surface-700">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image_url || item.product.image || item.product.images?.[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-surface-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 py-4 border-b border-surface-200 dark:border-surface-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Tax (5%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  leftIcon={<Check className="w-5 h-5" />}
                >
                  Place Order
                </Button>

                <p className="text-xs text-center text-surface-500 mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
