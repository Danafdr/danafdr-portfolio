import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const { title, type, repo_url, tools, current_description } = await request.json();

    const user = await prisma.users.findUnique({ where: { id: BigInt(auth.user.id) } });
    const apiKey = user?.ai_api_key || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key not configured. Please add it in Settings.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const hasExisting = current_description && current_description.trim().length > 0;

    const prompt = hasExisting
      ? `You are a copy editor for a developer portfolio. Improve the following project description without changing its meaning or replacing it entirely. Keep the author's voice and core facts. Fix grammar, make it sharper, more confident, and more engaging. Output ONLY the improved description — no preamble, no quotes, no explanation.

Project Title: ${title || 'Unknown'}
Project Type: ${type || 'Web Project'}
Tools used: ${tools ? tools.join(', ') : 'Various'}

Current description to improve:
"${current_description.trim()}"

Rules:
- Keep it to 1-2 sentences max (under 200 characters ideally)
- Do NOT invent features or tools that weren't mentioned
- Do NOT use hashtags or bullet points
- Preserve the author's intent — only polish the language`
      : `Write a short, engaging description (1-2 sentences, under 200 characters) for a portfolio project.
Project Title: ${title || 'Unknown'}
Project Type: ${type || 'Web Project'}
Tools used: ${tools ? tools.join(', ') : 'Various'}
Repository: ${repo_url || 'N/A'}
Tone: Confident, professional, concise. Sound like a skilled developer. No hashtags. Output ONLY the description.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ description: text.trim() });
  } catch (error: any) {
    console.error('Failed to generate description:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate description with AI' }, { status: 500 });
  }
}
