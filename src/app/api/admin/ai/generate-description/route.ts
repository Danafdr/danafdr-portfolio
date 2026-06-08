import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const { title, type, repo_url, tools } = await request.json();

    const user = await prisma.users.findUnique({ where: { id: BigInt(auth.user.id) } });
    const apiKey = user?.ai_api_key || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key not configured. Please add it in Settings.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `Write a short, engaging description (1-2 sentences) for a portfolio project.
Project Title: ${title || 'Unknown'}
Project Type: ${type || 'Web Project'}
Tools used: ${tools ? tools.join(', ') : 'Various'}
Repository: ${repo_url || 'N/A'}
Tone: Confident, professional but cool, "Boys Don't Cry" energy. Make it sound like a top-tier developer wrote it. Do not use hashtags.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ description: text.trim() });
  } catch (error: any) {
    console.error('Failed to generate description:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate description with AI' }, { status: 500 });
  }
}
