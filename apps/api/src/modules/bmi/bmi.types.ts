import type { BmiClassification } from '@repo/contracts';

export type {
  BmiClassification,
  CalculateBmiInput,
  BmiResultData,
  CalculateBmiSuccessResponse,
  ApiErrorDetail,
  ApiErrorResponse,
  CalculateBmiResponse,
} from '@repo/contracts';

export interface BmiCalculationResult {
  weight: number;
  height: number;
  bmi: number;
  classification: BmiClassification;
  rawBmi: number;
}
