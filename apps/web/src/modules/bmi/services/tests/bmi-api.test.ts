import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BmiApiService } from '../bmi-api.js';
import { BmiApiError } from '../bmi-api.types.js';

describe('BmiApiService — Unit Tests', () => {
  let service: BmiApiService;

  beforeEach(() => {
    service = new BmiApiService('/api/v1');
    vi.restoreAllMocks();
  });

  it('deve retornar dados de sucesso quando o backend responde 200 OK', async () => {
    const mockSuccessResponse = {
      success: true,
      data: {
        weight: 80,
        height: 1.75,
        bmi: 26.12,
        classification: 'Sobrepeso',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockSuccessResponse),
    } as unknown as Response);

    const result = await service.calculate({ weight: 80, height: 1.75 });

    expect(fetch).toHaveBeenCalledWith('/api/v1/bmi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ weight: 80, height: 1.75 }),
    });

    expect(result).toEqual(mockSuccessResponse.data);
  });

  it('deve lançar BmiApiError quando o servidor retornar 400 com erro de validação', async () => {
    const mockErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados informados são inválidos.',
        details: [{ field: 'weight', message: 'O peso deve ser maior que zero.' }],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue(mockErrorResponse),
    } as unknown as Response);

    await expect(service.calculate({ weight: -5, height: 1.75 })).rejects.toThrow(BmiApiError);

    try {
      await service.calculate({ weight: -5, height: 1.75 });
    } catch (err) {
      const error = err as BmiApiError;
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details[0]?.field).toBe('weight');
      expect(error.statusCode).toBe(400);
    }
  });

  it('deve lançar BmiApiError com código NETWORK_ERROR quando fetch falhar', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(service.calculate({ weight: 70, height: 1.75 })).rejects.toThrow(
      'Não foi possível conectar ao servidor.',
    );
  });
});
