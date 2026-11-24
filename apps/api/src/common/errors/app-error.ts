import { API_ERROR_CODES } from '@repo/contracts';

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES] | string;

export interface AppErrorOptions {
  code: ApiErrorCode;
  message: string;
  statusCode: number;
  details?: Array<{ field?: string; message: string }>;
}

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details: Array<{ field?: string; message: string }>;

  constructor({ code, message, statusCode, details = [] }: AppErrorOptions) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public static badRequest(
    message: string,
    details: Array<{ field?: string; message: string }> = [],
  ): AppError {
    return new AppError({
      code: API_ERROR_CODES.BAD_REQUEST,
      message,
      statusCode: 400,
      details,
    });
  }

  public static validation(
    message = 'Dados informados são inválidos.',
    details: Array<{ field?: string; message: string }> = [],
  ): AppError {
    return new AppError({
      code: API_ERROR_CODES.VALIDATION_ERROR,
      message,
      statusCode: 400,
      details,
    });
  }

  public static notFound(message = 'Recurso não encontrado.'): AppError {
    return new AppError({
      code: API_ERROR_CODES.NOT_FOUND,
      message,
      statusCode: 404,
    });
  }

  public static internal(message = 'Ocorreu um erro interno inesperado no servidor.'): AppError {
    return new AppError({
      code: API_ERROR_CODES.INTERNAL_ERROR,
      message,
      statusCode: 500,
    });
  }
}
