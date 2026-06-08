import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Save to database
    const newMsg = await prisma.messages.create({
      data: { name, email, message },
    });

    // Send email notification if SMTP is configured
    const user = await prisma.users.findFirst();
    if (user && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
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
        to: user.email,
        subject: `New Portfolio Message from ${name}`,
        text: `You have received a new message on your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });
    }

    // Since BigInt fails to serialize, return success manually or toString
    return NextResponse.json({ success: true, id: newMsg.id.toString() });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
