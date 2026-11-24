import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBmiCalculator } from '../use-bmi-calculator.js';
import type { BmiApiClient } from '../../services/bmi-api.js';
import { BmiApiError } from '../../services/bmi-api.types.js';

describe('useBmiCalculator hook', () => {
  it('deve inicializar com estado limpo', () => {
    const { result } = renderHook(() => useBmiCalculator());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve atualizar o estado com sucesso quando o cálculo é realizado', async () => {
    const mockClient: BmiApiClient = {
      calculate: vi.fn().mockResolvedValue({
        weight: 80,
        height: 1.75,
        bmi: 26.12,
        classification: 'Sobrepeso',
      }),
    };

    const { result } = renderHook(() => useBmiCalculator(mockClient));

    let success = false;
    await act(async () => {
      success = await result.current.calculate({ weight: 80, height: 1.75 });
    });

    expect(success).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({
      weight: 80,
      height: 1.75,
      bmi: 26.12,
      classification: 'Sobrepeso',
    });
  });

  it('deve atualizar o estado de erro quando o serviço falhar', async () => {
    const mockClient: BmiApiClient = {
      calculate: vi.fn().mockRejectedValue(
        new BmiApiError({
          code: 'VALIDATION_ERROR',
          message: 'Peso inválido.',
        }),
      ),
    };

    const { result } = renderHook(() => useBmiCalculator(mockClient));

    let success = true;
    await act(async () => {
      success = await result.current.calculate({ weight: 0, height: 1.75 });
    });

    expect(success).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe('Peso inválido.');
  });

  it('deve resetar o estado quando reset for chamado', async () => {
    const mockClient: BmiApiClient = {
      calculate: vi.fn().mockResolvedValue({
        weight: 70,
        height: 1.75,
        bmi: 22.86,
        classification: 'Normal',
      }),
    };

    const { result } = renderHook(() => useBmiCalculator(mockClient));

    await act(async () => {
      await result.current.calculate({ weight: 70, height: 1.75 });
    });

    expect(result.current.data).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
