import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { uploadFileLocally } from '@/lib/upload';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const projects = await prisma.projects.findMany({
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch admin projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    let thumbnailPath = null;
    const thumbnail = formData.get('thumbnail') as File | null;
    if (thumbnail && thumbnail.size > 0) {
      thumbnailPath = await uploadFileLocally(thumbnail, 'projects/thumbnails');
    }

    const project = await prisma.projects.create({
      data: {
        title,
        slug,
        type,
        description,
        full_description,
        year,
        live_url,
        repo_url,
        tools: toolsStr ? JSON.parse(toolsStr) : [],
        thumbnail: thumbnailPath,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
