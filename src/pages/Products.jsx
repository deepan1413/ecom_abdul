import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { useProductStore } from '@/stores';
import { Layout } from '@/components/layout';
import { ProductGrid, ProductFilters } from '@/components/product';
import { Button } from '@/components/ui';
import { cn } from '@/utils';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const { products, isLoading, filters, setFilters, fetchProducts, pagination, setPage } = useProductStore();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (category || search) {
      setFilters({
        category: category || '',
        search: search || '',
      });
    }
    fetchProducts();
  }, [searchParams, setFilters, fetchProducts]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100">
              {filters.search
                ? `Search results for "${filters.search}"`
                : filters.category
                ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                : 'All Products'}
            </h1>
            <p className="text-surface-500 mt-1">
              {pagination.total} products found
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="md:hidden"
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              columns={viewMode === 'list' ? 2 : 3} 
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      'w-10 h-10 rounded-lg font-medium transition-colors',
                      pagination.page === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <ProductFilters showMobile onClose={() => setShowFilters(false)} />
        )}
      </div>
    </Layout>
  );
}
