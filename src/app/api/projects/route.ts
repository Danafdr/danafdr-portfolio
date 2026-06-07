import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to serialize BigInts from Prisma
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    const projects = await prisma.projects.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
