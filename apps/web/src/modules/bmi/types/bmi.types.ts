export type {
  BmiClassification,
  CalculateBmiInput,
  BmiResultData,
  CalculateBmiSuccessResponse,
  ApiErrorDetail,
  ApiErrorResponse,
  CalculateBmiResponse,
} from '@repo/contracts';

export interface BmiFormValues {
  weight: number | '';
  height: number | '';
}
