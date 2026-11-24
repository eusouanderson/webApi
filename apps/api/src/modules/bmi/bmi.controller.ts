import type { Context } from 'hono';
import { AppError } from '../../common/errors/app-error.js';
import { calculateBmiInputSchema } from './bmi.schema.js';
import { type BmiService, bmiService } from './bmi.service.js';
import type { CalculateBmiSuccessResponse } from './bmi.types.js';

export class BmiController {
  constructor(private readonly service: BmiService = bmiService) {}

  /**
   * Endpoint POST /api/v1/bmi
   * Lê a requisição, valida os dados, executa o cálculo via Service e retorna resposta 200 OK.
   */
  public calculate = async (c: Context): Promise<Response> => {
    const rawBody = await c.req.json().catch(() => {
      throw AppError.badRequest('Formato de JSON inválido na requisição.');
    });

    // Validação estrita via Zod Schema do contrato compartilhado
    const validatedInput = calculateBmiInputSchema.parse(rawBody);

    // Delegação para a regra de negócio do Service
    const data = this.service.calculate(validatedInput);

    const responseBody: CalculateBmiSuccessResponse = {
      success: true,
      data,
    };

    return c.json(responseBody, 200);
  };
}

export const bmiController = new BmiController();
