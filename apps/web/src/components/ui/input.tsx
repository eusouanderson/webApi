import React from 'react';
import { cn } from '../../lib/utils.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-50 disabled:cursor-not-allowed',
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/20'
            : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500/20',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
