import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET() {
  try {
    const hero = await prisma.hero_settings.findFirst();
    return NextResponse.json(hero || {});
  } catch (error) {
    console.error('Failed to fetch hero settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
