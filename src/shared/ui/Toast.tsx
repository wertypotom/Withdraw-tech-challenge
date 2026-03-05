'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}

interface ToastOptions {
  id?: string;
  description?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notify = {
  loading: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...options,
      icon: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
      duration: 100000, // keep open until updated
    });
  },

  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...options,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      duration: 4000,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...options,
      icon: <XCircle className="h-4 w-4 text-destructive" />,
      duration: options?.action ? 10000 : 5000,
    });
  },

  dismiss: (id: string | number) => toast.dismiss(id),
};
