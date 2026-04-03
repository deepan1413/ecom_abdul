import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useProductStore } from '@/stores';
import { CATEGORIES, SORT_OPTIONS } from '@/constants';
import { cn } from '@/utils';
import { Button, Input } from '../ui';

export default function ProductFilters({ showMobile = false, onClose }) {
  const { filters, setFilters, clearFilters, fetchProducts } = useProductStore();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    fetchProducts();
    if (onClose) onClose();
  };

  const handleClear = () => {
    clearFilters();
    setLocalFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'popular',
    });
    fetchProducts();
  };

  const content = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-surface-900 dark:text-surface-100 mb-3">
          Category
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-lg transition-colors',
              !localFilters.category
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'hover:bg-surface-100 dark:hover:bg-surface-800'
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg transition-colors',
                localFilters.category === category.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-surface-900 dark:text-surface-100 mb-3">
          Price Range (KD)
        </h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium text-surface-900 dark:text-surface-100 mb-3">
          Sort By
        </h4>
        <select
          value={localFilters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button variant="secondary" onClick={handleClear} className="flex-1">
          Clear
        </Button>
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50">
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-surface-900 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
      {content}
    </div>
  );
}
