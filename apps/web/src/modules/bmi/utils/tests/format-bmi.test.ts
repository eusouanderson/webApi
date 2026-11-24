import { describe, it, expect } from 'vitest';
import {
  formatBmiValue,
  formatWeight,
  formatHeight,
  getClassificationConfig,
} from '../format-bmi.js';
import { BMI_CLASSIFICATIONS } from '@repo/contracts';

describe('format-bmi utils', () => {
  it('deve formatar valor de IMC com 2 casas decimais no padrão PT-BR', () => {
    expect(formatBmiValue(22.86)).toBe('22,86');
    expect(formatBmiValue(26.1)).toBe('26,10');
  });

  it('deve formatar peso com sufixo kg', () => {
    expect(formatWeight(80)).toBe('80 kg');
    expect(formatWeight(75.5)).toBe('75,5 kg');
  });

  it('deve formatar altura com sufixo m e duas casas decimais', () => {
    expect(formatHeight(1.75)).toBe('1,75 m');
    expect(formatHeight(1.8)).toBe('1,80 m');
  });

  it('deve retornar configuração visual adequada para cada categoria', () => {
    const magreza = getClassificationConfig(BMI_CLASSIFICATIONS.MAGREZA);
    expect(magreza.label).toBe('Magreza');
    expect(magreza.badgeVariant).toBe('info');

    const normal = getClassificationConfig(BMI_CLASSIFICATIONS.NORMAL);
    expect(normal.label).toBe('Normal');
    expect(normal.badgeVariant).toBe('success');

    const sobrepeso = getClassificationConfig(BMI_CLASSIFICATIONS.SOBREPESO);
    expect(sobrepeso.label).toBe('Sobrepeso');
    expect(sobrepeso.badgeVariant).toBe('warning');

    const obesidade = getClassificationConfig(BMI_CLASSIFICATIONS.OBESIDADE);
    expect(obesidade.label).toBe('Obesidade');
    expect(obesidade.badgeVariant).toBe('danger');
  });
});
