import { NextRequest, NextResponse } from 'next/server';
import type { ApiError } from '@/shared/types';
import type { WithdrawalRequest, WithdrawalResponse } from '@/app/withdraw/types';

const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;

interface IdempotencyEntry {
  record: WithdrawalResponse;
  timestamp: number;
}

const idempotencyStore = new Map<string, IdempotencyEntry>();
const withdrawalStore = new Map<string, WithdrawalResponse>();

function generateId(): string {
  return `wd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    const error: ApiError = {
      error: 'validation',
      message: 'Invalid JSON body',
    };
    return NextResponse.json(error, { status: 400 });
  }

  const { amount, destination, idempotency_key } = body as Partial<WithdrawalRequest>;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    const error: ApiError = {
      error: 'validation',
      message: 'amount must be a positive number',
    };
    return NextResponse.json(error, { status: 400 });
  }
  if (!destination || typeof destination !== 'string' || destination.trim() === '') {
    const error: ApiError = {
      error: 'validation',
      message: 'destination is required',
    };
    return NextResponse.json(error, { status: 400 });
  }
  if (!idempotency_key || typeof idempotency_key !== 'string') {
    const error: ApiError = {
      error: 'validation',
      message: 'idempotency_key is required',
    };
    return NextResponse.json(error, { status: 400 });
  }

  const existing = idempotencyStore.get(idempotency_key);
  if (existing) {
    const age = Date.now() - existing.timestamp;
    if (age < IDEMPOTENCY_TTL_MS) {
      const error: ApiError = {
        error: 'conflict',
        message: 'This withdrawal was already submitted. Check your withdrawal history.',
      };
      return NextResponse.json(error, { status: 409 });
    }

    idempotencyStore.delete(idempotency_key);
  }

  const record: WithdrawalResponse = {
    id: generateId(),
    amount,
    destination: destination.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  withdrawalStore.set(record.id, record);
  idempotencyStore.set(idempotency_key, { record, timestamp: Date.now() });

  return NextResponse.json(record, { status: 201 });
}

export { withdrawalStore };
