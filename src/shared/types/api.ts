// Shared API types for withdrawal feature

export interface WithdrawalRequest {
  amount: number;
  destination: string;
  idempotency_key: string;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface WithdrawalResponse {
  id: string;
  amount: number;
  destination: string;
  status: WithdrawalStatus;
  createdAt: string;
}

export interface ApiError {
  error: 'conflict' | 'validation' | 'not_found' | 'internal';
  message: string;
}
