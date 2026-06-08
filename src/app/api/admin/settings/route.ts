import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const user = await prisma.users.findUnique({ where: { id: BigInt(auth.user.id) } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    return NextResponse.json({
      email: user.email,
      github_token: user.github_token,
      ai_api_key: user.ai_api_key,
    });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const data = await request.json();
    const updateData: any = {};
    
    if (data.email) updateData.email = data.email;
    if (data.github_token !== undefined) updateData.github_token = data.github_token;
    if (data.ai_api_key !== undefined) updateData.ai_api_key = data.ai_api_key;
    
    if (data.password && data.password.length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.users.update({
      where: { id: BigInt(auth.user.id) },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
