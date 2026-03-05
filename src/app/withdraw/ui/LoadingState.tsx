import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export const LoadingState = React.memo(function LoadingState() {
  const { t } = useTranslation('withdraw');
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{t('states.loading')}</p>
    </div>
  );
});
