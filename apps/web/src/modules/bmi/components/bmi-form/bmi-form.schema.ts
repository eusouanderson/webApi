import { z } from 'zod';

export const bmiFormValidationSchema = z.object({
  weight: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z
        .number({
          required_error: 'O peso é obrigatório.',
          invalid_type_error: 'Informe um número válido para o peso.',
        })
        .positive('O peso deve ser maior que zero.')
        .finite('O peso deve ser um número válido.')
        .max(1000, 'O peso informado excede o limite aceito.'),
    ),
  height: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z
        .number({
          required_error: 'A altura é obrigatória.',
          invalid_type_error: 'Informe um número válido para a altura.',
        })
        .positive('A altura deve ser maior que zero.')
        .finite('A altura deve ser um número válido.')
        .max(3.5, 'A altura informada excede o limite aceito.'),
    ),
});

export type BmiFormSchemaInput = z.infer<typeof bmiFormValidationSchema>;
