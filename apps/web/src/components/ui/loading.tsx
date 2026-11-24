import React from 'react';
import { cn } from '../../lib/utils.js';

export interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  label = 'Calculando...',
  size = 'md',
  className,
}) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center justify-center gap-2 text-slate-600', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-sky-600 border-t-transparent',
          sizeMap[size],
        )}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
};
