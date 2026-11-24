import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  details?: Array<{ field?: string; message: string }>;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Erro na operação',
  message,
  details = [],
  className,
}) => {
  if (!message && details.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border border-rose-200 bg-rose-50/80 p-4 text-rose-800 transition-all',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          {title && <h3 className="text-sm font-semibold text-rose-900">{title}</h3>}
          {message && <p className="text-sm text-rose-700">{message}</p>}
          {details.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-rose-600">
              {details.map((detail, idx) => (
                <li key={idx}>
                  {detail.field ? <strong className="font-medium">{detail.field}: </strong> : null}
                  {detail.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
