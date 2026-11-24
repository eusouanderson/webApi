import type { CalculateBmiInput } from '../../types/bmi.types.js';

export interface BmiFormProps {
  onSubmit: (data: CalculateBmiInput) => void | Promise<unknown>;
  onReset?: () => void;
  isLoading?: boolean;
}
