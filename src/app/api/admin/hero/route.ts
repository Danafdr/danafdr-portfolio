import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    const hero = await prisma.hero_settings.findFirst();
    return NextResponse.json(hero || {});
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
    return NextResponse.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
  }
}

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
        photo_url: data.photo_url,
        photo_path: data.photo_path,
        original_path: data.original_path,
        width: data.width,
        height: data.height,
        filter: data.filter,
        filter_values: data.filter_values,
        crop: data.crop,
        rotation: data.rotation,
        filter_mode: data.filter_mode ?? data.mode,
        updated_at: new Date(),
      },
    });

    revalidatePath('/');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update hero settings:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const hero = await prisma.hero_settings.findFirst();
    if (!hero) return NextResponse.json({ message: 'No hero settings found' }, { status: 404 });

    const updated = await prisma.hero_settings.update({
      where: { id: hero.id },
      data: {
        photo_url: null,
        photo_path: null,
        original_path: null,
        width: null,
        height: null,
        filter: null,
        filter_values: null,
        crop: null,
        rotation: null,
        updated_at: new Date()
      }
    });

    revalidatePath('/');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to delete hero photo:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
