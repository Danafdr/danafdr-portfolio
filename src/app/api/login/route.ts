import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 422 });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Since Laravel bcrypt hashes use $2y$ prefix, bcryptjs supports $2a$ and $2b$. 
    // Usually $2y$ works with bcryptjs as it treats it interchangeably, but let's replace it just in case:
    const hash = user.password.replace(/^\$2y\$/, '$2a$');

    const isValid = await bcrypt.compare(password, hash);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token, user: { id: user.id.toString(), name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
