import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function PUT(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const data = await request.json();
    
    let hero = await prisma.hero_settings.findFirst();
    if (!hero) {
      hero = await prisma.hero_settings.create({ data: { updated_at: new Date() } });
    }

    const updated = await prisma.hero_settings.update({
      where: { id: hero.id },
      data: {
        filter: data.filter,
        filter_values: data.filter_values,
        crop: data.crop,
        rotation: data.rotation,
        filter_mode: data.filter_mode,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update hero settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
