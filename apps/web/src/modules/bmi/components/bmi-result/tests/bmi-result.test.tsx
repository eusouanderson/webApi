import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BmiResult } from '../bmi-result.js';
import type { BmiResultData } from '../../../types/bmi.types.js';

describe('BmiResult Component', () => {
  const mockResult: BmiResultData = {
    weight: 80,
    height: 1.75,
    bmi: 26.12,
    classification: 'Sobrepeso',
  };

  it('deve renderizar o IMC calculado, classificação, peso e altura', () => {
    render(<BmiResult result={mockResult} />);

    // Verifica valor formatado com 2 casas
    expect(screen.getByText('26,12')).toBeInTheDocument();

    // Verifica badge de classificação
    expect(screen.getAllByText('Sobrepeso').length).toBeGreaterThanOrEqual(1);

    // Verifica valores informados
    expect(screen.getByText('80 kg')).toBeInTheDocument();
    expect(screen.getByText('1,75 m')).toBeInTheDocument();
  });

  it('deve destacar a linha correspondente na tabela de referência', () => {
    render(<BmiResult result={mockResult} />);

    // Deve existir a indicação "Sua faixa" na linha de Sobrepeso
    expect(screen.getByText('Sua faixa')).toBeInTheDocument();
  });

  it('deve renderizar corretamente para classificação Magreza', () => {
    const magrezaResult: BmiResultData = {
      weight: 50,
      height: 1.75,
      bmi: 16.33,
      classification: 'Magreza',
    };

    render(<BmiResult result={magrezaResult} />);

    expect(screen.getByText('16,33')).toBeInTheDocument();
    expect(screen.getAllByText('Magreza').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sua faixa')).toBeInTheDocument();
  });
});
