import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/stores';
import { Layout } from '@/components/layout';
import { Card, Button, Badge, Rating } from '@/components/ui';
import { formatCurrency, getDiscountPercentage } from '@/utils';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Heart className="w-10 h-10 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-surface-500 mb-6">
              Save items you love by clicking the heart icon on any product.
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
            My Wishlist ({items.length} items)
          </h1>
          <Button
            variant="ghost"
            onClick={clearWishlist}
            className="text-red-500 hover:text-red-600"
          >
            Clear All
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((product) => {
            const discount = getDiscountPercentage(product.price, product.originalPrice);
            const imageUrl = product.image_url || product.image || product.images?.[0] || '/placeholder.jpg';

            return (
              <Card key={product.id} padding="none" hover>
                {/* Image */}
                <div className="relative aspect-square">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  {discount > 0 && (
                    <Badge variant="danger" className="absolute top-2 left-2">
                      -{discount}%
                    </Badge>
                  )}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-surface-800 shadow-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {product.category && (
                    <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                  )}

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-surface-900 dark:text-surface-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {product.rating !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <Rating value={product.rating} size="sm" />
                    </div>
                  )}

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

                  <Button
                    fullWidth
                    size="sm"
                    className="mt-4"
                    onClick={() => handleAddToCart(product)}
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
