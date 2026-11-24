import { useState, useCallback } from 'react';
import type { CalculateBmiInput, BmiResultData } from '../types/bmi.types.js';
import { bmiApiService, type BmiApiClient } from '../services/bmi-api.js';
import { BmiApiError } from '../services/bmi-api.types.js';
import type { UseBmiCalculatorReturn } from './use-bmi-calculator.types.js';

export function useBmiCalculator(client: BmiApiClient = bmiApiService): UseBmiCalculatorReturn {
  const [data, setData] = useState<BmiResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BmiApiError | null>(null);

  const calculate = useCallback(
    async (input: CalculateBmiInput): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await client.calculate(input);
        setData(result);
        return true;
      } catch (err) {
        if (err instanceof BmiApiError) {
          setError(err);
        } else {
          setError(
            new BmiApiError({
              code: 'UNEXPECTED_ERROR',
              message: 'Ocorreu um erro imprevisto ao calcular o IMC.',
            }),
          );
        }
        setData(null);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [client],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    calculate,
    reset,
  };
}
