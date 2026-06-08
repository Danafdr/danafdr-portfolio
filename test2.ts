import { Prisma } from './src/generated/prisma/client';
import { prisma } from './src/lib/prisma';

async function main() {
    try {
        const hero = await prisma.hero_settings.findFirst();
        if (!hero) { console.log('no hero'); return; }
        const updated = await prisma.hero_settings.update({
            where: { id: hero.id },
            data: {
                photo_url: null,
                photo_path: null,
                original_path: null,
                width: null,
                height: null,
                filter: null,
                filter_values: Prisma.DbNull,
                crop: Prisma.DbNull,
                rotation: 0,
                updated_at: new Date()
            }
        });
        console.log('SUCCESS:', updated);
    } catch (e) {
        console.error('ERROR:', e);
    }
}
main();
