import { z } from 'zod';
import { unmaskNumber } from '../../utils/mask-utils.js';

export const bmiFormValidationSchema = z.object({
  weight: z
    .string({ required_error: 'O peso é obrigatório.' })
    .trim()
    .min(1, 'O peso é obrigatório.')
    .refine((val) => {
      const n = unmaskNumber(val);
      return n !== undefined && n > 0;
    }, 'O peso deve ser maior que zero.')
    .refine((val) => {
      const n = unmaskNumber(val);
      return n !== undefined && n <= 1000;
    }, 'O peso informado excede o limite aceito.'),
  height: z
    .string({ required_error: 'A altura é obrigatória.' })
    .trim()
    .min(1, 'A altura é obrigatória.')
    .refine((val) => {
      const n = unmaskNumber(val);
      return n !== undefined && n > 0;
    }, 'A altura deve ser maior que zero.')
    .refine((val) => {
      const n = unmaskNumber(val);
      return n !== undefined && n <= 3.5;
    }, 'A altura informada excede o limite aceito.'),
});

export type BmiFormInputValues = z.infer<typeof bmiFormValidationSchema>;
