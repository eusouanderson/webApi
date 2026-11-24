import type { ErrorHandler, NotFoundHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { API_ERROR_CODES, type ApiErrorResponse } from '@repo/contracts';

/**
 * Handler centralizado de erros da API.
 * Garante contrato padronizado de erro HTTP sem expor stack trace em produção.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  // 1. Erro de validação Zod
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    const responseBody: ApiErrorResponse = {
      success: false,
      error: {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Dados informados são inválidos.',
        details,
      },
    };

    return c.json(responseBody, 400);
  }

  // 2. Erro de aplicação conhecido (AppError)
  if (err instanceof AppError) {
    const responseBody: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };

    // Cast status code to Hono ContentfulStatusCode
    return c.json(responseBody, err.statusCode as 400 | 404 | 500);
  }

  // 3. Erro de parsing de JSON malformado
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    const responseBody: ApiErrorResponse = {
      success: false,
      error: {
        code: API_ERROR_CODES.BAD_REQUEST,
        message: 'Formato de JSON inválido na requisição.',
        details: [],
      },
    };

    return c.json(responseBody, 400);
  }

  // 4. Erros não previstos (500 Internal Server Error)
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled Server Error:', err);
  }

  const responseBody: ApiErrorResponse = {
    success: false,
    error: {
      code: API_ERROR_CODES.INTERNAL_ERROR,
      message: 'Ocorreu um erro interno inesperado no servidor.',
      details: [],
    },
  };

  return c.json(responseBody, 500);
};

/**
 * Handler para rotas inexistentes (404 Not Found).
 */
export const notFoundHandler: NotFoundHandler = (c) => {
  const responseBody: ApiErrorResponse = {
    success: false,
    error: {
      code: API_ERROR_CODES.NOT_FOUND,
      message: `Rota '${c.req.method} ${c.req.path}' não encontrada.`,
      details: [],
    },
  };

  return c.json(responseBody, 404);
};
