import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  return NextResponse.json(auth.user);
}
