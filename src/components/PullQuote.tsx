export default function PullQuote() {
  return (
    <div className="py-[56px] px-10 border-b border-border-rgba grid grid-cols-[120px_1fr] gap-10 items-start reveal">
      <div className="text-[9px] text-ink2 tracking-[0.22em] uppercase pt-2 leading-[1.8]">On this<br />issue</div>
      <div className="font-playfair text-[clamp(26px,4.5vw,46px)] italic font-normal leading-[1.15] text-ink tracking-[-0.01em]">
        &quot;Good enough<br />was never<br /><span className="text-accent not-italic font-black">the point.</span>&quot;
      </div>
    </div>
  );
}
