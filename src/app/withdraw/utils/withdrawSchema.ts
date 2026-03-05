import { z } from 'zod';

export const withdrawSchema = z.object({
  amount: z.number({ message: 'errors.amount' }).positive('errors.amount'),
  destination: z
    .string({ message: 'errors.destination' })
    .min(1, 'errors.destination')
    .refine((val) => val.trim().length > 0, 'errors.destination'),
  confirm: z.boolean().refine((val) => val === true, {
    message: 'errors.confirm',
  }),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;
