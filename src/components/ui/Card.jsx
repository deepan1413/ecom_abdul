import { cn } from '@/utils';

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700',
        hover && 'transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
