import { z } from 'zod';
import {
  calculateBmiInputSchema,
  bmiResultDataSchema,
  calculateBmiSuccessResponseSchema,
  apiErrorDetailSchema,
  apiErrorResponseSchema,
} from './bmi.schema.js';
import { BMI_CLASSIFICATIONS } from './bmi.constants.js';

export type BmiClassification =
  (typeof BMI_CLASSIFICATIONS)[keyof typeof BMI_CLASSIFICATIONS];

export type CalculateBmiInput = z.infer<typeof calculateBmiInputSchema>;

export type BmiResultData = z.infer<typeof bmiResultDataSchema>;

export type CalculateBmiSuccessResponse = z.infer<typeof calculateBmiSuccessResponseSchema>;

export type ApiErrorDetail = z.infer<typeof apiErrorDetailSchema>;

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export type CalculateBmiResponse = CalculateBmiSuccessResponse | ApiErrorResponse;
