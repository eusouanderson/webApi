import type { ApiErrorDetail } from '../types/bmi.types.js';

export interface BmiApiErrorOptions {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  statusCode?: number;
}

export class BmiApiError extends Error {
  public readonly code: string;
  public readonly details: ApiErrorDetail[];
  public readonly statusCode?: number;

  constructor({ code, message, details = [], statusCode }: BmiApiErrorOptions) {
    super(message);
    this.name = 'BmiApiError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}
