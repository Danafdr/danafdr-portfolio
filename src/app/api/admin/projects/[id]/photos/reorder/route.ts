import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const { order } = await request.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 422 });
    }

    for (const item of order) {
      await prisma.photos.update({
        where: { id: BigInt(item.id) },
        data: { display_order: item.order },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder photos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
