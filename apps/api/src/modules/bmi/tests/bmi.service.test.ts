import { describe, it, expect, beforeEach } from 'vitest';
import { BmiService } from '../bmi.service.js';
import { BMI_CLASSIFICATIONS } from '../bmi.constants.js';

describe('BmiService — Unit Tests', () => {
  let service: BmiService;

  beforeEach(() => {
    service = new BmiService();
  });

  describe('Cálculo matemático do IMC', () => {
    it('deve calcular o IMC corretamente com a fórmula Peso / Altura²', () => {
      // 80 / (1.75 * 1.75) = 80 / 3.0625 = 26.122448979591837...
      const result = service.calculate({ weight: 80, height: 1.75 });

      expect(result.weight).toBe(80);
      expect(result.height).toBe(1.75);
      expect(result.bmi).toBe(26.12);
      expect(result.classification).toBe(BMI_CLASSIFICATIONS.SOBREPESO);
    });

    it('deve formatar o valor de IMC com exatamente 2 casas decimais no resultado final', () => {
      // 70 / (1.75 * 1.75) = 70 / 3.0625 = 22.857142... -> 22.86
      const result = service.calculate({ weight: 70, height: 1.75 });
      expect(result.bmi).toBe(22.86);
      expect(result.classification).toBe(BMI_CLASSIFICATIONS.NORMAL);
    });
  });

  describe('Classificação por faixas e limites estritos', () => {
    it('deve classificar como Magreza quando IMC < 18.5', () => {
      // 50 / (1.75²) = 16.33
      const result = service.calculate({ weight: 50, height: 1.75 });
      expect(result.classification).toBe(BMI_CLASSIFICATIONS.MAGREZA);
    });

    it('deve classificar como Normal no limite inferior exato de 18.5 (imc >= 18.5)', () => {
      const classification = service.determineClassification(18.5);
      expect(classification).toBe(BMI_CLASSIFICATIONS.NORMAL);
    });

    it('deve classificar como Normal no limite superior exato de 24.9 (imc <= 24.9)', () => {
      const classification = service.determineClassification(24.9);
      expect(classification).toBe(BMI_CLASSIFICATIONS.NORMAL);
    });

    it('deve classificar como Sobrepeso imediatamente acima de 24.9 (imc > 24.9)', () => {
      const classification = service.determineClassification(24.9001);
      expect(classification).toBe(BMI_CLASSIFICATIONS.SOBREPESO);
    });

    it('deve classificar como Sobrepeso no limite exato de 30.0 (imc <= 30.0)', () => {
      const classification = service.determineClassification(30.0);
      expect(classification).toBe(BMI_CLASSIFICATIONS.SOBREPESO);
    });

    it('deve classificar como Obesidade imediatamente acima de 30.0 (imc > 30)', () => {
      const classification = service.determineClassification(30.001);
      expect(classification).toBe(BMI_CLASSIFICATIONS.OBESIDADE);
    });

    it('deve classificar como Obesidade para valores altos (ex: 120kg, 1.70m)', () => {
      // 120 / (1.70²) = 41.52
      const result = service.calculate({ weight: 120, height: 1.7 });
      expect(result.bmi).toBe(41.52);
      expect(result.classification).toBe(BMI_CLASSIFICATIONS.OBESIDADE);
    });

    it('REGRA CRÍTICA: deve utilizar o IMC não arredondado para classificação', () => {
      // Se um IMC for 18.49999, ao arredondar para 2 casas decimais daria 18.50 (Normal).
      // Porém, a regra do domínio exige classificar com o valor original: 18.49999 < 18.5 => Magreza!
      const rawBmi = 18.4999;
      const classification = service.determineClassification(rawBmi);
      expect(classification).toBe(BMI_CLASSIFICATIONS.MAGREZA);
    });
  });
});
