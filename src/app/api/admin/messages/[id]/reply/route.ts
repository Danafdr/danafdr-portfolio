import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import nodemailer from 'nodemailer';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const { reply } = await request.json();
    if (!reply || !reply.trim()) {
      return NextResponse.json({ error: 'Reply message is required' }, { status: 400 });
    }

    // Find the original message
    const message = await prisma.messages.findUnique({
      where: { id: BigInt(params.id) },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check SMTP config
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ error: 'Email not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env.local file.' }, { status: 500 });
    }

    const user = await prisma.users.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      replyTo: user.email,
      to: message.email,
      subject: `Re: Your message to danafdr`,
      text: `Hi ${message.name},\n\n${reply}\n\n---\nOriginal message:\n"${message.message}"\n\nBest regards,\nDanadirsha\nhttps://danafdr.com`,
    });

    // Mark as read after replying
    await prisma.messages.update({
      where: { id: BigInt(params.id) },
      data: { is_read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send reply:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
