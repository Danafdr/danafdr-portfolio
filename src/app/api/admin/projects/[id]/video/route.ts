import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { uploadFileLocally } from '@/lib/upload';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    
    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json({ error: 'No video provided' }, { status: 422 });
    }

    const videoPath = await uploadFileLocally(videoFile, `projects/${params.id}/video`);
    
    const project = await prisma.projects.update({
      where: { id: BigInt(params.id) },
      data: {
        video_path: videoPath,
        video_url: videoPath, // local
        video_platform: 'local',
        updated_at: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to upload video:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const project = await prisma.projects.update({
      where: { id: BigInt(params.id) },
      data: {
        video_path: null,
        video_url: null,
        video_platform: null,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to delete video:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
