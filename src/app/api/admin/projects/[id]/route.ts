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
    const dataToUpdate: any = { updated_at: new Date() };

    const title = formData.get('title') as string;
    if (title !== null) dataToUpdate.title = title;
    
    const slug = formData.get('slug') as string;
    if (slug !== null) dataToUpdate.slug = slug;
    
    const type = formData.get('type') as string;
    if (type !== null) dataToUpdate.type = type;
    
    const description = formData.get('description') as string;
    if (description !== null) dataToUpdate.description = description;
    
    const full_description = formData.get('full_description') as string;
    if (full_description !== null) dataToUpdate.full_description = full_description;
    
    const yearStr = formData.get('year') as string;
    if (yearStr !== null) dataToUpdate.year = yearStr ? parseInt(yearStr) : null;
    
    const live_url = formData.get('live_url') as string;
    if (live_url !== null) dataToUpdate.live_url = live_url;
    
    const repo_url = formData.get('repo_url') as string;
    if (repo_url !== null) dataToUpdate.repo_url = repo_url;
    
    const video_url = formData.get('video_url') as string;
    if (video_url !== null) dataToUpdate.video_url = video_url;
    
    const video_platform = formData.get('video_platform') as string;
    if (video_platform !== null) dataToUpdate.video_platform = video_platform;
    
    const toolsStr = formData.get('tools') as string;
    if (toolsStr !== null) dataToUpdate.tools = toolsStr ? JSON.parse(toolsStr) : [];
    
    const gradientStart = formData.get('gradient_start') as string;
    if (gradientStart !== null) dataToUpdate.gradient_start = gradientStart;
    
    const gradientEnd = formData.get('gradient_end') as string;
    if (gradientEnd !== null) dataToUpdate.gradient_end = gradientEnd;

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
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
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
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
