import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { orderService } from '@/services';
import { Layout } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate, cn } from '@/utils';
import { useState } from 'react';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'warning', label: 'Pending' },
  processing: { icon: Package, color: 'info', label: 'Processing' },
  shipped: { icon: Truck, color: 'primary', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'success', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'danger', label: 'Cancelled' },
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Package className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Sign in to view orders
            </h2>
            <p className="text-surface-500 mb-6">
              You need to be signed in to view your order history.
            </p>
            <Link to="/auth?redirect=/orders">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
            My Orders
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-24" />
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Package className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No orders yet
            </h2>
            <p className="text-surface-500 mb-6">
              Start shopping to create your first order.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="hover:shadow-soft transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-100 dark:bg-surface-700">
                      <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-surface-100">
                        Order #{order.id?.slice(-8) || 'N/A'}
                      </p>
                      <p className="text-sm text-surface-500">
                        {formatDate(order.createdAt || new Date())}
                      </p>
                      <p className="text-sm text-surface-500 mt-1">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center gap-4">
                    <Badge variant={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.total || 0)}
                    </span>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 overflow-x-auto">
                    {order.items.slice(0, 4).map((item, index) => (
                      <img
                        key={index}
                        src={item.product?.image || item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
