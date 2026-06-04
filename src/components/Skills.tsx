export default function Skills() {
  return (
    <section id="skills" className="border-b border-border-rgba reveal">
      <div className="py-7 px-10 border-b border-border-rgba flex justify-between items-baseline">
        <div className="font-playfair text-[clamp(22px,3vw,32px)] font-black tracking-[-0.02em]">The <em className="italic font-normal">toolkit</em></div>
        <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase">Web-first · Video-editing · Motion-graphics</div>
      </div>
      <div className="grid grid-cols-4">
        <div className="py-7 px-6 border-r border-border-rgba border-b border-border-rgba transition-colors duration-200 relative hover:bg-[rgba(15,14,11,0.03)] [&:nth-child(4n)]:border-r-0">
          <div className="w-5 h-[2px] bg-accent mb-4"></div>
          <div className="text-[11px] text-ink tracking-[0.07em] mb-3">Web Development</div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Laravel</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Next.js</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">React</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Inertia.js</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">PHP</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Vercel · GitHub</span>
          </div>
          <div className="inline-block text-[8px] text-accent border border-[rgba(200,68,26,0.3)] py-[2px] px-[7px] tracking-[0.1em] mt-2">Primary</div>
        </div>
        <div className="py-7 px-6 border-r border-border-rgba border-b border-border-rgba transition-colors duration-200 relative hover:bg-[rgba(15,14,11,0.03)] [&:nth-child(4n)]:border-r-0">
          <div className="w-5 h-[2px] mb-4 bg-[#a06030]"></div>
          <div className="text-[11px] text-ink tracking-[0.07em] mb-3">Video Editing</div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Premiere Pro</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Timeline cuts</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Pacing &amp; Rhythm</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Storytelling</span>
          </div>
          <div className="inline-block text-[8px] border py-[2px] px-[7px] tracking-[0.1em] mt-2 text-[#a06030] border-[rgba(160,96,48,0.3)]">Exploring</div>
        </div>
        <div className="py-7 px-6 border-r border-border-rgba border-b border-border-rgba transition-colors duration-200 relative hover:bg-[rgba(15,14,11,0.03)] [&:nth-child(4n)]:border-r-0">
          <div className="w-5 h-[2px] mb-4 bg-ink3"></div>
          <div className="text-[11px] text-ink tracking-[0.07em] mb-3">Motion Graphics</div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[9px] text-ink2 tracking-[0.07em]">After Effects</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Cinema 4D</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Blender</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">SaaS &amp; Apple style</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Product Motion</span>
          </div>
        </div>
        <div className="py-7 px-6 border-r border-border-rgba border-b border-border-rgba transition-colors duration-200 relative hover:bg-[rgba(15,14,11,0.03)] [&:nth-child(4n)]:border-r-0">
          <div className="w-5 h-[2px] mb-4 bg-ink3"></div>
          <div className="text-[11px] text-ink tracking-[0.07em] mb-3">Also</div>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Cisco JS Essentials</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Cinematography</span>
            <span className="text-[9px] text-ink2 tracking-[0.07em]">Photography</span>
          </div>
        </div>
      </div>
    </section>
  );
}
