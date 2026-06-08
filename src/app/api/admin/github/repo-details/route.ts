import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  const url = new URL(request.url);
  const repoFullName = url.searchParams.get('repo');

  if (!repoFullName) {
    return NextResponse.json({ error: 'Repository full_name is required' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({ where: { id: BigInt(auth.user.id) } });
    const token = user?.github_token;

    if (!token) {
      return NextResponse.json({ error: 'GitHub PAT not configured in Settings.' }, { status: 400 });
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };

    // Fetch README
    let readme = '';
    const readmeRes = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    }

    // Fetch Languages
    let languages: string[] = [];
    const langRes = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers });
    if (langRes.ok) {
      const langData = await langRes.json();
      languages = Object.keys(langData);
    }

    return NextResponse.json({ readme, languages });
  } catch (error) {
    console.error('Failed to fetch github repo details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
