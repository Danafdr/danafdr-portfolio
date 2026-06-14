export default function About() {
  return (
    <section id="about-s" className="grid grid-cols-1 lg:grid-cols-2 border-b border-border-rgba reveal">
      <div className="py-[52px] px-5 md:px-10 border-b lg:border-b-0 lg:border-r border-border-rgba">
        <h2 className="font-playfair text-[clamp(24px,3.5vw,36px)] font-black leading-[0.95] tracking-[-0.02em] mb-7">Who is<br /><em className="italic font-normal text-ink2">danafdr?</em></h2>
        <p className="text-[11px] text-ink2 leading-[1.95] mb-[14px]">
          A 17-year-old from West Jakarta who builds full-stack web apps and studies how things move. <strong className="text-ink font-normal">Web development</strong> is the strongest skill right now — Laravel, Next.js, React, shipping real projects and growing fast.
        </p>
        <p className="text-[11px] text-ink2 leading-[1.95] mb-[14px]">
          <strong className="text-ink font-normal">Video editing &amp; motion graphics</strong> is the direction being carved out — tweaking with After Effects and learning cinematography to see what makes a cut feel alive. Still studying Apple and SaaS motion aesthetics for that premium product feel.
        </p>
        <p className="text-[11px] text-ink2 leading-[1.95]">
          Obsessed with <strong className="text-ink font-normal">The Finals</strong> for the same reason Whiplash hits so hard — when every detail is deliberate, when nothing is accidental, it stops being a game or a film and becomes something else entirely. That&apos;s the standard.
        </p>
      </div>
      <div className="py-[52px] px-5 md:px-10">
        <h2 className="font-playfair text-[clamp(24px,3.5vw,36px)] font-black leading-[0.95] tracking-[-0.02em] mb-7">What<br /><em className="italic font-normal text-ink2">shapes him</em></h2>
        <div className="flex flex-col">
          <div className="py-4 border-b border-border-rgba grid grid-cols-[22px_1fr] gap-[14px] last:border-b-0">
            <div className="text-[9px] text-ink3 pt-[2px]">01</div>
            <div>
              <div className="text-[12px] text-ink mb-1 tracking-[0.02em]">Whiplash · Fight Club · La La Land · Edgerunners</div>
              <div className="text-[10px] text-ink2 leading-[1.7]">People consumed by making things perfectly. Craft obsession, emotional beauty, vivid chaos — all four in the same room.</div>
            </div>
          </div>
          <div className="py-4 border-b border-border-rgba grid grid-cols-[22px_1fr] gap-[14px] last:border-b-0">
            <div className="text-[9px] text-ink3 pt-[2px]">02</div>
            <div>
              <div className="text-[12px] text-ink mb-1 tracking-[0.02em]">Boys Don&apos;t Cry · Blonde — Frank Ocean</div>
              <div className="text-[10px] text-ink2 leading-[1.7]">Brutal white space. Raw newsprint. Things placed wrong on purpose. Emotion without explanation. The visual language of this portfolio.</div>
            </div>
          </div>
          <div className="py-4 border-b border-border-rgba grid grid-cols-[22px_1fr] gap-[14px] last:border-b-0">
            <div className="text-[9px] text-ink3 pt-[2px]">03</div>
            <div>
              <div className="text-[12px] text-ink mb-1 tracking-[0.02em]">Street art · VHS · analog chaos</div>
              <div className="text-[10px] text-ink2 leading-[1.7]">Layers, wear, texture. Stickers over stickers. Nothing great looks like it was made in five minutes.</div>
            </div>
          </div>
          <div className="py-4 border-b border-border-rgba grid grid-cols-[22px_1fr] gap-[14px] last:border-b-0">
            <div className="text-[9px] text-ink3 pt-[2px]">04</div>
            <div>
              <div className="text-[12px] text-ink mb-1 tracking-[0.02em]">Photography — a sim, for now</div>
              <div className="text-[10px] text-ink2 leading-[1.7]">A lone bird over open ocean. A chapel glimpsed through dense forest. One point of light in a vast dark world. Real camera when the budget allows.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
