import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const { field } = await request.json();
    if (!['published', 'featured'].includes(field)) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 422 });
    }

    const project = await prisma.projects.findUnique({ where: { id: BigInt(params.id) } });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.projects.update({
      where: { id: BigInt(params.id) },
      data: { [field]: !(project as any)[field] },
    });

    return NextResponse.json({ success: true, field, value: (updated as any)[field] });
  } catch (error) {
    console.error('Failed to toggle project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
