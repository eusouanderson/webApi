import type { CalculateBmiInput, BmiResultData } from '../types/bmi.types.js';
import type { BmiApiError } from '../services/bmi-api.types.js';

export interface UseBmiCalculatorState {
  data: BmiResultData | null;
  isLoading: boolean;
  error: BmiApiError | null;
}

export interface UseBmiCalculatorReturn extends UseBmiCalculatorState {
  calculate: (input: CalculateBmiInput) => Promise<boolean>;
  reset: () => void;
}
