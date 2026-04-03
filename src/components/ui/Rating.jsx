import { Star } from 'lucide-react';
import { cn } from '@/utils';

export default function Rating({ value, max = 5, size = 'md', showValue = false, className }) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.floor(value)
              ? 'text-amber-400 fill-amber-400'
              : i < value
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-surface-300 dark:text-surface-600'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-surface-600 dark:text-surface-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
