import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { uploadFileLocally } from '@/lib/upload';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File | null;

    if (!photo) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    const photoUrl = await uploadFileLocally(photo, 'hero');

    let hero = await prisma.hero_settings.findFirst();
    if (!hero) {
      hero = await prisma.hero_settings.create({ data: { updated_at: new Date() } });
    }

    const updated = await prisma.hero_settings.update({
      where: { id: hero.id },
      data: {
        original_path: photoUrl,
        photo_url: photoUrl,
        photo_path: photoUrl,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to upload hero photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
