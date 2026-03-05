import { create } from 'zustand';
import type { WithdrawalResponse, WithdrawalRequest, WithdrawStatus } from '../types';
import { NetworkError } from '@/shared/api';
import { createWithdrawal } from '../api';

export interface WithdrawState {
  status: WithdrawStatus;
  error: string | null;
  isNetworkError: boolean;
  withdrawal: WithdrawalResponse | null;
  idempotencyKey: string;
}

export interface WithdrawActions {
  submit: (payload: Omit<WithdrawalRequest, 'idempotency_key'>) => Promise<void>;
  retry: () => void;
  reset: () => void;
}

function newKey(): string {
  return crypto.randomUUID();
}

const initialState: WithdrawState = {
  status: 'idle',
  error: null,
  isNetworkError: false,
  withdrawal: null,
  idempotencyKey: newKey(),
};

export const useWithdrawStore = create<WithdrawState & WithdrawActions>((set, get) => ({
  ...initialState,

  submit: async (payload) => {
    set({ status: 'loading', error: null, isNetworkError: false });

    try {
      const withdrawal = await createWithdrawal({
        ...payload,
        idempotency_key: get().idempotencyKey,
      });
      set({ status: 'success', withdrawal });
    } catch (err) {
      const isNetworkError = err instanceof NetworkError;
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';

      set({
        status: 'error',
        error: message,
        isNetworkError,
      });
    }
  },

  retry: () => {
    set({ status: 'idle', error: null, isNetworkError: false });
  },

  reset: () => {
    set({ ...initialState, idempotencyKey: newKey() });
  },
}));
