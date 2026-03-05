import { NextRequest, NextResponse } from 'next/server';
import type { ApiError } from '@/shared/types';
import { withdrawalStore } from '../route';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const record = withdrawalStore.get(id);

  if (!record) {
    const error: ApiError = {
      error: 'not_found',
      message: `Withdrawal ${id} not found`,
    };
    return NextResponse.json(error, { status: 404 });
  }

  return NextResponse.json(record, { status: 200 });
}
