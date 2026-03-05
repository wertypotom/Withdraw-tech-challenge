'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useWithdrawStore } from '../store';
import { WithdrawForm } from './WithdrawForm';
import { notify } from '@/shared/ui';
import { LoadingState, SuccessState, ErrorState } from '../ui';

export function WithdrawWidget() {
  const { status, error, isNetworkError, withdrawal, reset, retry } = useWithdrawStore();
  const { t } = useTranslation('withdraw');

  React.useEffect(() => {
    if (status === 'success' && withdrawal) {
      notify.success(t('states.success.title'), {
        description: t('states.success.id', { id: withdrawal.id }),
      });
    } else if (status === 'error' && error) {
      notify.error(error, {
        ...(isNetworkError && {
          action: {
            label: t('states.error.retry'),
            onClick: retry,
          },
        }),
      });
    }
  }, [status, error, isNetworkError, withdrawal, retry, t]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {status === 'loading' && <LoadingState />}

      {status === 'success' && withdrawal && (
        <SuccessState id={withdrawal.id} status={withdrawal.status} onReset={reset} />
      )}

      {(status === 'idle' || status === 'error') && (
        <>
          <WithdrawForm />
          {status === 'error' && error && (
            <ErrorState
              error={error}
              isNetworkError={isNetworkError}
              onRetry={retry}
              onReset={reset}
            />
          )}
        </>
      )}
    </div>
  );
}
