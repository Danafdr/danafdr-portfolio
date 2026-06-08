import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const payload = await request.json();
    
    // update database
    const project = await prisma.projects.update({
      where: { id: BigInt(params.id) },
      data: {
        thumbnail_filter: payload.filter,
        thumbnail_filter_values: payload.filter_values,
        thumbnail_crop: payload.crop,
        thumbnail_multi_crops: payload.multi_crops,
        thumbnail_rotation: payload.rotation || 0,
        updated_at: new Date()
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to process thumbnail:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
