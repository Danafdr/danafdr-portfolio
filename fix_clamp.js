const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

let totalReplaced = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We look for patterns like: className-prefix-[clamp(min, mid, max)]
    // Example: text-[clamp(40px,5vw,64px)] -> text-[40px] md:text-[52px] lg:text-[64px]
    // Example: mt-[clamp(20px,5vh,200px)] -> mt-[20px] md:mt-[110px] lg:mt-[200px]
    // Regex matches any word or hyphen sequence before `-[clamp...]`
    const regex = /([a-z0-9-]+)-\[clamp\(([\d.]+)px,.*?,([\d.]+)px\)\]/g;

    content = content.replace(regex, (match, prefix, minStr, maxStr) => {
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        const mid = Math.round((min + max) / 2);
        
        // Return standard tailwind responsive classes
        return `${prefix}-[${min}px] md:${prefix}-[${mid}px] lg:${prefix}-[${max}px]`;
    });

    // Special cases that don't end in px, e.g. text-[clamp(40px,5vw,64px)]
    // Handled by above because the numbers have px.

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        totalReplaced++;
    }
});

console.log(`Finished updating ${totalReplaced} files.`);
