import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const total = await prisma.projects.count();
    const published = await prisma.projects.count({ where: { published: true } });
    const featured = await prisma.projects.count({ where: { featured: true } });
    const drafts = await prisma.projects.count({ where: { published: false } });

    return NextResponse.json({ total, published, featured, drafts });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
