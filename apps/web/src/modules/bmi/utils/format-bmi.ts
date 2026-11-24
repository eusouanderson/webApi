import { BMI_CLASSIFICATIONS } from '@repo/contracts';
import type { BmiClassification } from '../types/bmi.types.js';
import type { ClassificationVisualConfig } from './format-bmi.types.js';

export function formatBmiValue(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatWeight(weight: number): string {
  return `${weight.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;
}

export function formatHeight(height: number): string {
  return `${height.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
}

export function getClassificationConfig(
  classification: BmiClassification,
): ClassificationVisualConfig {
  switch (classification) {
    case BMI_CLASSIFICATIONS.MAGREZA:
      return {
        label: 'Magreza',
        badgeVariant: 'info',
        colorClass: 'text-sky-700',
        bgColorClass: 'bg-sky-50',
        borderColorClass: 'border-sky-200',
        description: 'Seu IMC está abaixo de 18,5. Pode indicar necessidade de adequação nutricional.',
      };
    case BMI_CLASSIFICATIONS.NORMAL:
      return {
        label: 'Normal',
        badgeVariant: 'success',
        colorClass: 'text-emerald-700',
        bgColorClass: 'bg-emerald-50',
        borderColorClass: 'border-emerald-200',
        description: 'Seu IMC está entre 18,5 e 24,9. Faixa considerada saudável para a maioria dos adultos.',
      };
    case BMI_CLASSIFICATIONS.SOBREPESO:
      return {
        label: 'Sobrepeso',
        badgeVariant: 'warning',
        colorClass: 'text-amber-700',
        bgColorClass: 'bg-amber-50',
        borderColorClass: 'border-amber-200',
        description: 'Seu IMC está acima de 24,9 até 30,0. Recomenda-se atenção aos hábitos de vida.',
      };
    case BMI_CLASSIFICATIONS.OBESIDADE:
      return {
        label: 'Obesidade',
        badgeVariant: 'danger',
        colorClass: 'text-rose-700',
        bgColorClass: 'bg-rose-50',
        borderColorClass: 'border-rose-200',
        description: 'Seu IMC é superior a 30,0. É aconselhável buscar acompanhamento profissional.',
      };
    default:
      return {
        label: classification,
        badgeVariant: 'info',
        colorClass: 'text-slate-700',
        bgColorClass: 'bg-slate-50',
        borderColorClass: 'border-slate-200',
        description: 'Resultado recebido da avaliação médica.',
      };
  }
}
