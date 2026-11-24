import { serve } from '@hono/node-server';
import { app } from './app.js';
import { env } from './config/env.js';

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`🚀 BMI API Server running at http://localhost:${info.port}`);
    console.log(`🏥 Health check: http://localhost:${info.port}/api/v1/health`);
    console.log(`📊 Endpoint IMC: POST http://localhost:${info.port}/api/v1/bmi`);
  },
);
