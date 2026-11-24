import {
  BMI_BOUNDARIES,
  BMI_CLASSIFICATIONS,
  BMI_PRECISION_DECIMALS,
} from './bmi.constants.js';
import type {
  BmiClassification,
  CalculateBmiInput,
  BmiResultData,
} from './bmi.types.js';

export class BmiService {
  /**
   * Executa o cálculo do IMC e a classificação correspondente.
   * Regra estrita: A classificação utiliza o valor de precisão total (não arredondado).
   * O valor de retorno `bmi` é arredondado para 2 casas decimais conforme especificação.
   */
  public calculate(input: CalculateBmiInput): BmiResultData {
    const { weight, height } = input;

    const rawBmi = this.calculateRawBmi(weight, height);
    const classification = this.determineClassification(rawBmi);
    const formattedBmi = this.roundToDecimals(rawBmi, BMI_PRECISION_DECIMALS);

    return {
      weight,
      height,
      bmi: formattedBmi,
      classification,
    };
  }

  /**
   * Calcula o IMC em ponto flutuante com precisão máxima.
   * Fórmula: IMC = Peso / Altura²
   */
  public calculateRawBmi(weight: number, height: number): number {
    return weight / (height * height);
  }

  /**
   * Determina a categoria de classificação baseada nas faixas oficiais do domínio:
   * - imc < 18.5 -> Magreza
   * - imc >= 18.5 && imc <= 24.9 -> Normal
   * - imc > 24.9 && imc <= 30 -> Sobrepeso
   * - imc > 30 -> Obesidade
   *
   * @param rawBmi IMC real sem arredondamento prévio
   */
  public determineClassification(rawBmi: number): BmiClassification {
    if (rawBmi < BMI_BOUNDARIES.MAGREZA_LIMIT) {
      return BMI_CLASSIFICATIONS.MAGREZA;
    }

    if (rawBmi >= BMI_BOUNDARIES.MAGREZA_LIMIT && rawBmi <= BMI_BOUNDARIES.NORMAL_MAX) {
      return BMI_CLASSIFICATIONS.NORMAL;
    }

    if (rawBmi > BMI_BOUNDARIES.NORMAL_MAX && rawBmi <= BMI_BOUNDARIES.SOBREPESO_MAX) {
      return BMI_CLASSIFICATIONS.SOBREPESO;
    }

    return BMI_CLASSIFICATIONS.OBESIDADE;
  }

  /**
   * Arredonda com precisão numérica evitando inconsistências de ponto flutuante.
   */
  private roundToDecimals(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }
}

export const bmiService = new BmiService();
