import type { WithdrawalRequest, WithdrawalResponse, ApiError } from '@/shared/types';
import { ConflictError, NetworkError, ApiValidationError } from '@/shared/api';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'}/withdrawals`;

async function parseError(res: Response): Promise<never> {
  const body: ApiError = await res.json().catch(() => ({
    error: 'internal' as const,
    message: `Unexpected error (${res.status})`,
  }));

  if (res.status === 409) throw new ConflictError(body.message);
  if (res.status === 400) throw new ApiValidationError(body.message);
  throw new Error(body.message ?? `Request failed with status ${res.status}`);
}

export async function createWithdrawal(payload: WithdrawalRequest): Promise<WithdrawalResponse> {
  let res: Response;
  try {
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new NetworkError();
  }

  if (!res.ok) await parseError(res);
  return res.json() as Promise<WithdrawalResponse>;
}

export async function getWithdrawal(id: string): Promise<WithdrawalResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${id}`);
  } catch {
    throw new NetworkError();
  }

  if (!res.ok) await parseError(res);
  return res.json() as Promise<WithdrawalResponse>;
}
