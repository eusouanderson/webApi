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
  classification: import('@repo/contracts').BmiClassification;
  rawBmi: number;
}
