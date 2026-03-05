import { z } from 'zod';

export const withdrawSchema = z.object({
  amount: z.number({ message: 'form.amount.required' }).positive('form.amount.positive'),
  destination: z
    .string({ message: 'form.destination.required' })
    .min(1, 'form.destination.required')
    .refine((val) => val.trim().length > 0, 'form.destination.required'),
  confirm: z.literal(true, { message: 'form.confirm.required' }),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;
