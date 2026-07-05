import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.projects.findMany();
    console.log(p.map(x => ({ title: x.title, tools: x.tools })));
}
main();
