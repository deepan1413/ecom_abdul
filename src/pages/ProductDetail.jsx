import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, Share2, ChevronRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { useProductStore, useCartStore, useWishlistStore, useRecentlyViewedStore } from '@/stores';
import { Layout } from '@/components/layout';
import { ProductGallery, ProductGrid } from '@/components/product';
import { Button, Badge, Rating, Card } from '@/components/ui';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency, getStockStatus, getDiscountPercentage, cn } from '@/utils';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { selectedProduct: product, fetchProductById, isLoading, products } = useProductStore();
  const { addItem: addToCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addToRecentlyViewed } = useRecentlyViewedStore();
  
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then((product) => {
        if (product) {
          addToRecentlyViewed(product);
        }
      });
    }
  }, [id, fetchProductById, addToRecentlyViewed]);

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ProductDetailSkeleton />
        </div>
      </Layout>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const stockStatus = getStockStatus(product.stock || 10);
  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const images = product.images || (product.image_url ? [product.image_url] : product.image ? [product.image] : []);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-surface-900 dark:text-surface-100 truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={images} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              {product.category && (
                <Badge variant="primary">{product.category}</Badge>
              )}
              {discount > 0 && (
                <Badge variant="danger">-{discount}% OFF</Badge>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="flex items-center gap-3">
                <Rating value={product.rating} showValue />
                <span className="text-surface-500">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-surface-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  stockStatus.color === 'success' && 'bg-green-500',
                  stockStatus.color === 'warning' && 'bg-amber-500',
                  stockStatus.color === 'danger' && 'bg-red-500'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  stockStatus.color === 'success' && 'text-green-600 dark:text-green-400',
                  stockStatus.color === 'warning' && 'text-amber-600 dark:text-amber-400',
                  stockStatus.color === 'danger' && 'text-red-600 dark:text-red-400'
                )}
              >
                {stockStatus.label}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                className="flex-1"
              >
                Add to Cart
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => toggleItem(product)}
                className={inWishlist ? 'text-red-500' : ''}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </Button>

              <Button variant="secondary" size="lg" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <Card padding="sm" className="!bg-surface-50 dark:!bg-surface-800/50">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Free Shipping</span>
                  <span className="text-surface-500 text-xs">Over 50 KD</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Warranty</span>
                  <span className="text-surface-500 text-xs">12 Months</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-5 h-5 text-accent-500" />
                  <span className="font-medium">Easy Returns</span>
                  <span className="text-surface-500 text-xs">30 Days</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </Layout>
  );
}
