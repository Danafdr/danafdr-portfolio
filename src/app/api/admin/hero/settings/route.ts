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

    const updateData: any = {
      updated_at: new Date(),
    };

    if (data.filter !== undefined) updateData.filter = data.filter;
    if (data.filter_values !== undefined) updateData.filter_values = data.filter_values;
    if (data.crop !== undefined) updateData.crop = data.crop;
    if (data.rotation !== undefined) updateData.rotation = data.rotation;
    if (data.filter_mode !== undefined) updateData.filter_mode = data.filter_mode;
    if (data.available_for_work !== undefined) updateData.available_for_work = data.available_for_work;

    const updated = await prisma.hero_settings.update({
      where: { id: hero.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update hero settings:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
        available_for_work: data.available_for_work,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ available_for_work: updated.available_for_work });
  } catch (error) {
    console.error('Failed to toggle availability:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

