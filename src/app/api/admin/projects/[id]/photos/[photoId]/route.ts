import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { uploadFileLocally } from '@/lib/upload';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(request: Request, props: { params: Promise<{ id: string, photoId: string }> }) {
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
    
    const photo = await prisma.photos.update({
      where: { id: BigInt(params.photoId) },
      data: {
        path: photoPath,
        url: photoPath,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Failed to update photo file:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string, photoId: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const data = await request.json();
    
    const photo = await prisma.photos.update({
      where: { id: BigInt(params.photoId) },
      data: {
        caption: data.caption,
        featured: data.featured,
        tags: data.tags,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Failed to update photo data:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string, photoId: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    await prisma.photos.delete({
      where: { id: BigInt(params.photoId) },
    });
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Failed to delete photo:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
