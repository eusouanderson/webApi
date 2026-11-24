import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button, Input, FormField } from '../../../../components/ui/index.js';
import { maskWeight, maskHeight, unmaskNumber } from '../../utils/mask-utils.js';
import { bmiFormValidationSchema, type BmiFormInputValues } from './bmi-form.schema.js';
import type { BmiFormProps } from './bmi-form.types.js';

export const BmiForm: React.FC<BmiFormProps> = ({ onSubmit, onReset, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BmiFormInputValues>({
    resolver: zodResolver(bmiFormValidationSchema),
    defaultValues: {
      weight: '',
      height: '',
    },
    mode: 'onTouched',
  });

  const handleFormSubmit = async (values: BmiFormInputValues) => {
    const weight = unmaskNumber(values.weight);
    const height = unmaskNumber(values.height);

    if (weight !== undefined && height !== undefined) {
      await onSubmit({ weight, height });
    }
  };

  const handleReset = () => {
    reset({
      weight: '',
      height: '',
    });
    if (onReset) {
      onReset();
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Campo com máscara: Peso */}
        <FormField
          label="Peso corporal (kg)"
          htmlFor="bmi-weight-input"
          required
          hint="Digite os dígitos (ex: 80 ou 75,5)"
          error={errors.weight?.message}
        >
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <Input
                id="bmi-weight-input"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 80,0"
                disabled={isBusy}
                error={!!errors.weight}
                value={field.value}
                onChange={(e) => {
                  const masked = maskWeight(e.target.value);
                  field.onChange(masked);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
        </FormField>

        {/* Campo com máscara: Altura */}
        <FormField
          label="Altura (metros)"
          htmlFor="bmi-height-input"
          required
          hint="Digite os dígitos (ex: 175 vira 1,75)"
          error={errors.height?.message}
        >
          <Controller
            name="height"
            control={control}
            render={({ field }) => (
              <Input
                id="bmi-height-input"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 1,75"
                disabled={isBusy}
                error={!!errors.height}
                value={field.value}
                onChange={(e) => {
                  const masked = maskHeight(e.target.value);
                  field.onChange(masked);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
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
