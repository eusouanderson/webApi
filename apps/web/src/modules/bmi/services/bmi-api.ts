import type {
  CalculateBmiInput,
  BmiResultData,
  CalculateBmiSuccessResponse,
  ApiErrorResponse,
} from '../types/bmi.types.js';
import { BmiApiError } from './bmi-api.types.js';

export interface BmiApiClient {
  calculate(input: CalculateBmiInput): Promise<BmiResultData>;
}

export class BmiApiService implements BmiApiClient {
  constructor(private readonly baseUrl: string = '/api/v1') {}

  /**
   * Envia os dados para a API calcular o IMC.
   * Não realiza cálculos localmente.
   */
  public async calculate(input: CalculateBmiInput): Promise<BmiResultData> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/bmi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(input),
      });
    } catch {
      throw new BmiApiError({
        code: 'NETWORK_ERROR',
        message: 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
      });
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new BmiApiError({
        code: 'RESPONSE_PARSE_ERROR',
        message: 'O servidor retornou uma resposta em formato inválido.',
        statusCode: response.status,
      });
    }

    if (
      !response.ok ||
      (payload && typeof payload === 'object' && 'success' in payload && !payload.success)
    ) {
      const errorPayload = payload as ApiErrorResponse;
      throw new BmiApiError({
        code: errorPayload.error?.code ?? 'API_ERROR',
        message: errorPayload.error?.message ?? 'Ocorreu um erro ao processar o cálculo.',
        details: errorPayload.error?.details ?? [],
        statusCode: response.status,
      });
    }

    const successPayload = payload as CalculateBmiSuccessResponse;
    return successPayload.data;
  }
}

export const bmiApiService = new BmiApiService();
