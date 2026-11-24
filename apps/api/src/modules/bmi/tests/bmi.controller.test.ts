import { describe, it, expect, vi } from 'vitest';
import { BmiController } from '../bmi.controller.js';
import { BmiService } from '../bmi.service.js';
import { AppError } from '../../../common/errors/app-error.js';
import type { Context } from 'hono';

describe('BmiController — Unit Tests', () => {
  it('deve chamar o service com dados validados e retornar status 200 com envelope', async () => {
    const mockService = new BmiService();
    const calculateSpy = vi.spyOn(mockService, 'calculate');
    const controller = new BmiController(mockService);

    const mockContext = {
      req: {
        json: vi.fn().mockResolvedValue({ weight: 70, height: 1.75 }),
      },
      json: vi.fn((body, status) => ({ body, status })),
    } as unknown as Context;

    const response = (await controller.calculate(mockContext)) as any;

    expect(calculateSpy).toHaveBeenCalledWith({ weight: 70, height: 1.75 });
    expect(mockContext.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          weight: 70,
          height: 1.75,
          bmi: 22.86,
          classification: 'Normal',
        }),
      }),
      200,
    );
    expect(response.status).toBe(200);
  });

  it('deve lançar AppError 400 se o body da requisição for JSON inválido', async () => {
    const controller = new BmiController();
    const mockContext = {
      req: {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      },
    } as unknown as Context;

    await expect(controller.calculate(mockContext)).rejects.toThrow(AppError);
  });
});
