export interface WithdrawalRequest {
  amount: number;
  destination: string;
  idempotency_key: string;
}

export type WithdrawStatus = 'idle' | 'loading' | 'success' | 'error';

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface WithdrawalResponse {
  id: string;
  amount: number;
  destination: string;
  status: WithdrawalStatus;
  createdAt: string;
}
