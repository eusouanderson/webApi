import { z } from 'zod';
import { BMI_CLASSIFICATION_VALUES } from './bmi.constants.js';

/**
 * Schema para validação do payload de entrada do cálculo de IMC.
 * Garante número estrito, maior que zero, finito e não aceita strings vazias ou NaN.
 */
export const calculateBmiInputSchema = z.object({
  weight: z
    .number({
      required_error: 'O peso é obrigatório.',
      invalid_type_error: 'O peso deve ser um número válido.',
    })
    .positive('O peso deve ser maior que zero.')
    .finite('O peso deve ser um número finito.')
    .max(1000, 'O peso informado excede o limite aceito.'),
  height: z
    .number({
      required_error: 'A altura é obrigatória.',
      invalid_type_error: 'A altura deve ser um número válido.',
    })
    .positive('A altura deve ser maior que zero.')
    .finite('A altura deve ser um número finito.')
    .max(3.5, 'A altura informada excede o limite aceito.'),
});

/**
 * Schema para os dados de resultado do cálculo de IMC.
 */
export const bmiResultDataSchema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  bmi: z.number().positive(),
  classification: z.enum(BMI_CLASSIFICATION_VALUES),
});

/**
 * Schema de resposta de sucesso (200 OK).
 */
export const calculateBmiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: bmiResultDataSchema,
});

/**
 * Schema de detalhe de erro de validação ou de campo.
 */
export const apiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

/**
 * Schema de resposta padronizada de erro.
 */
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(apiErrorDetailSchema),
  }),
});
