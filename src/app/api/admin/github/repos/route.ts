import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth.error || !auth.user) return NextResponse.json({ message: auth.error }, { status: auth.status });

  try {
    const user = await prisma.users.findUnique({ where: { id: BigInt(auth.user.id) } });
    const token = user?.github_token;

    if (!token) {
      return NextResponse.json({ error: 'GitHub PAT not configured in Settings.' }, { status: 400 });
    }

    const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch repositories from GitHub. Check your PAT.' }, { status: res.status });
    }

    const repos = await res.json();
    
    // Process repos to extract what we need
    const formattedRepos = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error('Failed to fetch github repos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
