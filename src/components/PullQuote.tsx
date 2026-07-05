export default function PullQuote() {
  return (
    <div className="py-[56px] px-6 md:px-12 border-b border-border-rgba grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-10 items-start reveal">
      <div className="text-[9px] text-ink2 tracking-[0.22em] uppercase pt-0 md:pt-2 leading-[1.8] flex md:block gap-2"><span>On this</span><span>issue</span></div>
      <div className="font-playfair text-[26px] md:text-[36px] lg:text-[46px] italic font-normal leading-[1.15] text-ink tracking-[-0.01em]">
        &quot;Good enough<br />was never<br /><span className="text-accent not-italic font-black">the point.</span>&quot;
      </div>
    </div>
  );
}
