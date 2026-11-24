import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './common/middlewares/error.middleware.js';
import { bmiRoutes } from './modules/bmi/bmi.routes.js';

export function createApp(): Hono {
  const app = new Hono();

  // Middlewares globais
  if (env.NODE_ENV !== 'test') {
    app.use('*', logger());
  }

  app.use(
    '*',
    cors({
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Health check endpoints
  const healthHandler = (c: Context) =>
    c.json({
      status: 'ok',
      service: 'bmi-api',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });

  app.get('/health', healthHandler);
  app.get('/api/v1/health', healthHandler);

  // Módulos da API (prefixo /api/v1)
  app.route('/api/v1/bmi', bmiRoutes);

  // Handlers centralizados
  app.onError(errorHandler);
  app.notFound(notFoundHandler);

  return app;
}

export const app = createApp();
