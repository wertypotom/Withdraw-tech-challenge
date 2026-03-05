'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { WithdrawFormValues, withdrawSchema } from '../utils';
import { useWithdrawStore } from '../store';
import { Input, Button, Label } from '../ui';

export function WithdrawForm() {
  const { t } = useTranslation('withdraw');
  const { status, submit, lastPayload } = useWithdrawStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: lastPayload?.amount ?? undefined,
      destination: lastPayload?.destination ?? '',
      confirm: false,
    },
  });

  const onSubmit = useCallback(
    (data: WithdrawFormValues) => {
      if (status === 'loading') return;
      submit(data);
    },
    [status, submit],
  );

  const isLoading = status === 'loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">{t('form.title')}</h2>

        <div className="flex flex-col gap-3">
          <Label htmlFor="amount">{t('form.amount.label')}</Label>
          <Input
            id="amount"
            type="number"
            step="any"
            placeholder={t('form.amount.placeholder')}
            disabled={isLoading}
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && (
            <p className="text-sm font-medium text-destructive">
              {t(errors.amount.message as string)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="destination">{t('form.destination.label')}</Label>
          <Input
            id="destination"
            type="text"
            placeholder={t('form.destination.placeholder')}
            disabled={isLoading}
            autoComplete="off"
            {...register('destination')}
          />
          {errors.destination && (
            <p className="text-sm font-medium text-destructive">
              {t(errors.destination.message as string)}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="confirm"
            type="checkbox"
            disabled={isLoading}
            className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('confirm')}
          />
          <Label htmlFor="confirm" className="font-normal">
            {t('form.confirm.label')}
          </Label>
        </div>
        {errors.confirm && (
          <p className="text-sm font-medium text-destructive">
            {t(errors.confirm.message as string)}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {t('form.submit')}
      </Button>
    </form>
  );
}
