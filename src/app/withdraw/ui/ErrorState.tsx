import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export interface ErrorStateProps {
  error: string;
  isNetworkError: boolean;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState = React.memo(function ErrorState({
  error,
  isNetworkError,
  onRetry,
  onReset,
}: ErrorStateProps) {
  const { t } = useTranslation('withdraw');
  return (
    <div className="mt-4 rounded-md bg-destructive/10 p-4">
      <div className="flex flex-col space-y-3">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <div className="flex gap-3">
          {isNetworkError && (
            <Button variant="outline" size="sm" onClick={onRetry} className="w-full bg-background">
              {t('states.error.retry')}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onReset} className="w-full bg-background">
            {t('states.error.back')}
          </Button>
        </div>
      </div>
    </div>
  );
});
