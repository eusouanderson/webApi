import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button, Input, FormField } from '../../../../components/ui/index.js';
import {
  bmiFormValidationSchema,
  type BmiFormSchemaInput,
} from './bmi-form.schema.js';
import type { BmiFormProps } from './bmi-form.types.js';

export const BmiForm: React.FC<BmiFormProps> = ({ onSubmit, onReset, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BmiFormSchemaInput>({
    resolver: zodResolver(bmiFormValidationSchema),
    defaultValues: {
      weight: '' as unknown as number,
      height: '' as unknown as number,
    },
    mode: 'onTouched',
  });

  const handleFormSubmit = async (values: BmiFormSchemaInput) => {
    await onSubmit(values as { weight: number; height: number });
  };

  const handleReset = () => {
    reset({
      weight: '' as unknown as number,
      height: '' as unknown as number,
    });
    if (onReset) {
      onReset();
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Campo: Peso */}
        <FormField
          label="Peso corporal (kg)"
          htmlFor="bmi-weight-input"
          required
          hint="Ex: 78.5"
          error={errors.weight?.message}
        >
          <Input
            id="bmi-weight-input"
            type="number"
            step="0.1"
            min="0"
            placeholder="Digite seu peso em kg"
            disabled={isBusy}
            error={!!errors.weight}
            {...register('weight')}
          />
        </FormField>

        {/* Campo: Altura */}
        <FormField
          label="Altura (metros)"
          htmlFor="bmi-height-input"
          required
          hint="Ex: 1.75"
          error={errors.height?.message}
        >
          <Input
            id="bmi-height-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Digite sua altura em metros"
            disabled={isBusy}
            error={!!errors.height}
            {...register('height')}
          />
        </FormField>
      </div>

      {/* Ações do formulário */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isBusy}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
          Limpar
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isBusy}
          className="w-full sm:w-auto min-w-[140px]"
        >
          <Calculator className="w-4 h-4 mr-2" aria-hidden="true" />
          Calcular IMC
        </Button>
      </div>
    </form>
  );
};
