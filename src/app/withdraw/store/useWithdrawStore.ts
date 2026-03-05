import { create } from 'zustand';
import type { WithdrawalResponse, WithdrawalRequest, WithdrawStatus } from '../types';
import { NetworkError } from '@/shared/api';
import { createWithdrawal, getWithdrawal } from '../api';
import { saveSession, clearSession } from '../utils';

export type WithdrawPayload = Omit<WithdrawalRequest, 'idempotency_key'>;

export interface WithdrawState {
  status: WithdrawStatus;
  error: string | null;
  isNetworkError: boolean;
  withdrawal: WithdrawalResponse | null;
  idempotencyKey: string;
  lastPayload: WithdrawPayload | null;
}

export interface WithdrawActions {
  submit: (payload: WithdrawPayload) => Promise<void>;
  retry: () => void;
  reset: () => void;
  restoreFromSession: (id: string) => Promise<void>;
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
  lastPayload: null,
};

export const useWithdrawStore = create<WithdrawState & WithdrawActions>((set, get) => ({
  ...initialState,

  submit: async (payload) => {
    set({
      status: 'loading',
      error: null,
      isNetworkError: false,
      lastPayload: payload,
    });

    try {
      const created = await createWithdrawal({
        ...payload,
        idempotency_key: get().idempotencyKey,
      });

      saveSession(created.id);

      const withdrawal = await getWithdrawal(created.id);
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
    clearSession();
    set({ ...initialState, idempotencyKey: newKey() });
  },

  restoreFromSession: async (id: string) => {
    try {
      const withdrawal = await getWithdrawal(id);
      set({ status: 'success', withdrawal });
    } catch {
      clearSession();
    }
  },
}));
