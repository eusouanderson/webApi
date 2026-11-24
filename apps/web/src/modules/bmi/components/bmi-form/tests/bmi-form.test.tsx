import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BmiForm } from '../bmi-form.js';

describe('BmiForm Component', () => {
  it('deve renderizar os campos e botões com acessibilidade adequada', () => {
    render(<BmiForm onSubmit={vi.fn()} />);

    // Verifica labels associados aos inputs
    const weightInput = screen.getByLabelText(/peso corporal/i);
    const heightInput = screen.getByLabelText(/altura/i);
    const submitButton = screen.getByRole('button', { name: /calcular imc/i });
    const resetButton = screen.getByRole('button', { name: /limpar/i });

    expect(weightInput).toBeInTheDocument();
    expect(heightInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it('deve exibir mensagens de validação ao submeter formulário vazio', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BmiForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByRole('button', { name: /calcular imc/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O peso é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('A altura é obrigatória.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('deve rejeitar valores menores ou iguais a zero', async () => {
    const user = userEvent.setup();
    render(<BmiForm onSubmit={vi.fn()} />);

    const weightInput = screen.getByLabelText(/peso corporal/i);
    const heightInput = screen.getByLabelText(/altura/i);
    const submitButton = screen.getByRole('button', { name: /calcular imc/i });

    await user.type(weightInput, '0');
    await user.type(heightInput, '-1');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('O peso deve ser maior que zero.')).toBeInTheDocument();
      expect(screen.getByText('A altura deve ser maior que zero.')).toBeInTheDocument();
    });
  });

  it('deve chamar onSubmit com os dados numéricos corretos ao preencher valores válidos', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BmiForm onSubmit={handleSubmit} />);

    const weightInput = screen.getByLabelText(/peso corporal/i);
    const heightInput = screen.getByLabelText(/altura/i);
    const submitButton = screen.getByRole('button', { name: /calcular imc/i });

    await user.type(weightInput, '80');
    await user.type(heightInput, '1.75');
    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        weight: 80,
        height: 1.75,
      });
    });
  });

  it('deve desabilitar campos e botões durante o estado de loading', () => {
    render(<BmiForm onSubmit={vi.fn()} isLoading={true} />);

    const weightInput = screen.getByLabelText(/peso corporal/i);
    const heightInput = screen.getByLabelText(/altura/i);
    const submitButton = screen.getByRole('button', { name: /calcular imc/i });
    const resetButton = screen.getByRole('button', { name: /limpar/i });

    expect(weightInput).toBeDisabled();
    expect(heightInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('deve limpar os campos e acionar onReset ao clicar no botão Limpar', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();
    render(<BmiForm onSubmit={vi.fn()} onReset={handleReset} />);

    const weightInput = screen.getByLabelText(/peso corporal/i) as HTMLInputElement;
    const heightInput = screen.getByLabelText(/altura/i) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: /limpar/i });

    await user.type(weightInput, '85');
    await user.type(heightInput, '1.80');
    expect(weightInput.value).toBe('85');
    expect(heightInput.value).toBe('1.80');

    await user.click(resetButton);

    expect(handleReset).toHaveBeenCalled();
    expect(weightInput.value).toBe('');
    expect(heightInput.value).toBe('');
  });
});
