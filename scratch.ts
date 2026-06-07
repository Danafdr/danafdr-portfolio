process.env.DATABASE_URL = 'postgresql://postgres.tbdwxiadffsjhgntqtzw:dirsha.12%2Fgamers@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true';
import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Testing toggle project...');
  try {
    const project = await prisma.projects.findUnique({ where: { id: 1n } });
    if (!project) return console.log('Project 1n not found');

    const updated = await prisma.projects.update({
      where: { id: 1n },
      data: { published: !(project as any).published },
    });

    console.log('Successfully toggled published to:', updated.published);
  } catch (e) {
    console.error('Failed test:', e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
