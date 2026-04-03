import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw, Cpu, Monitor } from 'lucide-react';
import { useProductStore, useAIStore } from '@/stores';
import { ProductGrid } from '@/components/product';
import { Button, Card } from '@/components/ui';
import { Layout } from '@/components/layout';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over 50 KD',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
];

const FEATURED_CATEGORIES = [
  { id: 'cpu', name: 'Processors', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
  { id: 'gpu', name: 'Graphics Cards', icon: Monitor, color: 'from-purple-500 to-pink-500' },
  { id: 'ram', name: 'Memory', icon: Cpu, color: 'from-orange-500 to-red-500' },
];

export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts, isLoading } = useProductStore();
  const { openChat } = useAIStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Build Your Dream PC with{' '}
              <span className="text-accent-300">AI-Powered</span> Recommendations
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Get personalized PC part suggestions, compatibility checks, and budget-optimized builds with our intelligent shopping assistant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={openChat}
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="bg-white text-primary-600 hover:bg-white/90"
              >
                Try AI Assistant
              </Button>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" />
      </section>

      {/* Features Bar */}
      <section className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-200 dark:divide-surface-700">
            {FEATURES.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 py-6 md:px-6">
                <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-surface-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {FEATURED_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[3/2]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <category.icon className="w-12 h-12 mb-3 transform group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1">Shop Now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-12 md:py-16 bg-surface-100 dark:bg-surface-800/50">
        <div className="container mx-auto px-4">
          <Card padding="lg" className="!bg-gradient-to-r from-primary-600 to-accent-600 text-white border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-white/10">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI PC Build Assistant</h3>
                  <p className="text-white/80">
                    Get personalized recommendations, compatibility checks, and budget optimization
                  </p>
                </div>
              </div>
              <Button
                onClick={openChat}
                size="lg"
                className="bg-white text-primary-600 hover:bg-white/90 whitespace-nowrap"
              >
                Start Building
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} columns={4} />
        </div>
      </section>
    </Layout>
  );
}
