import React from 'react';
import { cn } from '../../lib/utils.js';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  className,
  children,
  ...props
}) => {
  return (
    <header className={cn('mb-8 text-center sm:text-left', className)} {...props}>
      {badge && <div className="mb-2 inline-flex items-center">{badge}</div>}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      {children}
    </header>
  );
};
