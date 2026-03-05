import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface SuccessStateProps {
  id: string;
  status: string;
  onReset: () => void;
}

export const SuccessState = React.memo(function SuccessState({
  id,
  status,
  onReset,
}: SuccessStateProps) {
  const { t } = useTranslation('withdraw');
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle2 className="h-6 w-6 text-green-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{t('states.success.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('states.success.id', { id })}
          <br />
          {t('states.success.status', { status })}
        </p>
      </div>
      <Button onClick={onReset} variant="outline" className="w-full">
        {t('form.submit')}
      </Button>
    </div>
  );
});
