import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { uploadFileLocally } from '@/lib/upload';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const photos = await prisma.photos.findMany({
      where: { project_id: BigInt(params.id) },
      orderBy: { display_order: 'asc' },
    });
    
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const formData = await request.formData();
    const photoFile = formData.get('photo') as File | null;
    
    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 422 });
    }

    const photoPath = await uploadFileLocally(photoFile, `projects/${params.id}/photos`);
    
    const count = await prisma.photos.count({ where: { project_id: BigInt(params.id) } });

    const photo = await prisma.photos.create({
      data: {
        project_id: BigInt(params.id),
        path: photoPath,
        url: photoPath, // local url
        display_order: count,
        created_at: new Date(),
        updated_at: new Date(),
        source: 'upload',
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Failed to upload photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
