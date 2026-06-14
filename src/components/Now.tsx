export default function Now() {
  return (
    <section id="now" className="grid grid-cols-1 md:grid-cols-3 border-b border-border-rgba reveal">
      <div className="py-8 px-5 md:px-7 border-b md:border-b-0 md:border-r border-border-rgba md:last:border-r-0">
        <div className="text-[9px] text-ink2 tracking-[0.22em] uppercase mb-[14px]">right now</div>
        <div className="font-playfair text-[clamp(16px,2.5vw,22px)] font-black leading-[1.1] tracking-[-0.01em] mb-[10px]">Shipping web apps</div>
        <div className="text-[10px] text-ink2 leading-[1.75]"><em className="text-ink not-italic">building real projects, paid work, growing fast.</em> AE setup coming back soon.</div>
      </div>
      <div className="py-8 px-5 md:px-7 border-b md:border-b-0 md:border-r border-border-rgba md:last:border-r-0">
        <div className="text-[9px] text-ink2 tracking-[0.22em] uppercase mb-[14px]">studying</div>
        <div className="font-playfair text-[clamp(16px,2.5vw,22px)] font-black leading-[1.1] tracking-[-0.01em] mb-[10px]">Cinematography &amp; SaaS motion</div>
        <div className="text-[10px] text-ink2 leading-[1.75]">Learning cinematography for video editing cuts, while studying how Apple makes motion feel <em className="text-ink not-italic">alive</em>.</div>
      </div>
      <div className="py-8 px-5 md:px-7 md:border-r border-border-rgba md:last:border-r-0">
        <div className="text-[9px] text-ink2 tracking-[0.22em] uppercase mb-[14px]">listening to</div>
        <div className="font-playfair text-[clamp(16px,2.5vw,22px)] font-black leading-[1.1] tracking-[-0.01em] mb-[10px]">Blonde — Frank Ocean</div>
        <div className="text-[10px] text-ink2 leading-[1.75]"><em className="text-ink not-italic">Still the perfect album.</em> Mac Miller, Rex Orange County, Daniel Caesar in heavy rotation.</div>
      </div>
    </section>
  );
}
