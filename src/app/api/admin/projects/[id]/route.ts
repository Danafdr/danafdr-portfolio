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
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const full_description = formData.get('full_description') as string;
    const year = parseInt(formData.get('year') as string);
    const live_url = formData.get('live_url') as string;
    const repo_url = formData.get('repo_url') as string;
    const toolsStr = formData.get('tools') as string;

    const dataToUpdate: any = {
      title,
      slug,
      type,
      description,
      full_description,
      year,
      live_url,
      repo_url,
      tools: toolsStr ? JSON.parse(toolsStr) : [],
      updated_at: new Date(),
    };

    const thumbnail = formData.get('thumbnail') as File | null;
    if (thumbnail && thumbnail.size > 0) {
      dataToUpdate.thumbnail = await uploadFileLocally(thumbnail, 'projects/thumbnails');
    }

    const project = await prisma.projects.update({
      where: { id: BigInt(params.id) },
      data: dataToUpdate,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    await prisma.projects.delete({
      where: { id: BigInt(params.id) },
    });
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
