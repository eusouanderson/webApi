import { Hono } from 'hono';
import { BmiController, bmiController } from './bmi.controller.js';

export function createBmiRoutes(controller: BmiController = bmiController): Hono {
  const router = new Hono();

  // POST /api/v1/bmi
  router.post('/', controller.calculate);

  return router;
}

export const bmiRoutes = createBmiRoutes();
