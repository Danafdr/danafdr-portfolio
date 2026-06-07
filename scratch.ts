import { prisma } from './src/lib/prisma';

async function main() {
  const p = await prisma.projects.findMany({ select: { slug: true, title: true }});
  console.log(p);
}

main().catch(console.error).finally(() => prisma.$disconnect());
