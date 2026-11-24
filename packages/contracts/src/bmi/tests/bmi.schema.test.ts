import { describe, it, expect } from 'vitest';
import {
  calculateBmiInputSchema,
  calculateBmiSuccessResponseSchema,
  apiErrorResponseSchema,
} from '../bmi.schema.js';

describe('Contracts — BMI Schemas', () => {
  describe('calculateBmiInputSchema', () => {
    it('should validate a valid input successfully', () => {
      const validPayload = { weight: 80, height: 1.75 };
      const parsed = calculateBmiInputSchema.safeParse(validPayload);

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.weight).toBe(80);
        expect(parsed.data.height).toBe(1.75);
      }
    });

    it('should reject missing weight', () => {
      const payload = { height: 1.75 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const error = parsed.error.format();
        expect(error.weight?._errors).toBeDefined();
        expect(error.weight?._errors[0]).toBe('O peso é obrigatório.');
      }
    });

    it('should reject missing height', () => {
      const payload = { weight: 70 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const error = parsed.error.format();
        expect(error.height?._errors).toBeDefined();
        expect(error.height?._errors[0]).toBe('A altura é obrigatória.');
      }
    });

    it('should reject string numbers (no silent coercion)', () => {
      const payload = { weight: '80', height: '1.75' };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
    });

    it('should reject zero weight and height', () => {
      const payload = { weight: 0, height: 0 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const error = parsed.error.format();
        expect(error.weight?._errors[0]).toBe('O peso deve ser maior que zero.');
        expect(error.height?._errors[0]).toBe('A altura deve ser maior que zero.');
      }
    });

    it('should reject negative weight and height', () => {
      const payload = { weight: -70, height: -1.75 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
    });

    it('should reject NaN values', () => {
      const payload = { weight: NaN, height: 1.75 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
    });

    it('should reject non-finite (Infinity) values', () => {
      const payload = { weight: Infinity, height: 1.75 };
      const parsed = calculateBmiInputSchema.safeParse(payload);

      expect(parsed.success).toBe(false);
    });
  });

  describe('calculateBmiSuccessResponseSchema', () => {
    it('should validate standard success response', () => {
      const response = {
        success: true,
        data: {
          weight: 80,
          height: 1.75,
          bmi: 26.12,
          classification: 'Sobrepeso' as const,
        },
      };

      const parsed = calculateBmiSuccessResponseSchema.safeParse(response);
      expect(parsed.success).toBe(true);
    });

    it('should reject invalid classification', () => {
      const response = {
        success: true,
        data: {
          weight: 80,
          height: 1.75,
          bmi: 26.12,
          classification: 'Invalido',
        },
      };

      const parsed = calculateBmiSuccessResponseSchema.safeParse(response);
      expect(parsed.success).toBe(false);
    });
  });

  describe('apiErrorResponseSchema', () => {
    it('should validate structured error response', () => {
      const errorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados informados são inválidos.',
          details: [{ field: 'weight', message: 'O peso deve ser maior que zero.' }],
        },
      };

      const parsed = apiErrorResponseSchema.safeParse(errorResponse);
      expect(parsed.success).toBe(true);
    });
  });
});
