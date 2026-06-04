"use client";

import Link from "next/link";

const categories = [
  {
    id: "01",
    slug: "webdev",
    name: "Web Development",
    description: "Full-stack applications, Next.js frontends, and Laravel APIs",
    tags: ["Laravel", "React", "Inertia", "Next.js"],
  },
  {
    id: "02",
    slug: "video",
    name: "Video Editing",
    description: "Cinematic cuts, narrative pacing, and product reels",
    tags: ["Premiere", "AE", "Blender"],
  },
  {
    id: "03",
    slug: "mograph",
    name: "Motion Graphics",
    description: "Title sequences and 3D-assisted motion fed into After Effects",
    tags: ["AE", "E3D", "C4D"],
  },
];

export default function Work() {
  return (
    <section id="work" className="border-b border-border-rgba reveal">
      <div className="py-7 px-10 border-b border-border-rgba flex justify-between items-baseline">
        <div className="font-playfair text-[clamp(22px,3vw,32px)] font-black tracking-[-0.02em]">Selected <em className="italic font-normal">work</em></div>
        <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase">2024 — present</div>
      </div>
      {categories.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/work?cat=${cat.slug}`}
          scroll={false}
          className="grid grid-cols-[52px_1fr_auto_32px] gap-5 items-center py-5 px-10 border-b border-border-rgba cursor-pointer transition-colors duration-150 group hover:bg-[rgba(15,14,11,0.025)] no-underline"
        >
          <div className="font-playfair text-[26px] font-black text-ink3">{cat.id}</div>
          <div>
            <div className="text-[13px] text-ink tracking-[0.03em] mb-[3px]">{cat.name}</div>
            <div className="text-[10px] text-ink2 leading-[1.55]">{cat.description}</div>
          </div>
          <div className="flex gap-[5px] flex-wrap justify-end">
            {cat.tags.map((tag, i) => (
              <span key={i} className="text-[9px] text-ink2 border border-border-rgba py-[3px] px-2 tracking-[0.05em]">{tag}</span>
            ))}
          </div>
          <div className="text-[15px] text-ink3 transition-all duration-200 group-hover:translate-x-[5px] group-hover:text-accent">→</div>
        </Link>
      ))}
    </section>
  );
}
