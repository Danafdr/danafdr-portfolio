"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function Intro() {
  const pathname = usePathname();
  const [isOut, setIsOut] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  
  // Elements for animation
  const topTextRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on home page
    if (pathname !== "/") {
      setIsOut(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsOut(true);
        }
      });

      // Initial state
      gsap.set([topTextRef.current, nameRef.current, subTextRef.current], { opacity: 0, y: 10 });
      gsap.set(ruleRef.current, { height: 0 });
      gsap.set(progressRef.current, { width: 0 });

      // Animation sequence
      tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.2)
        .to(topTextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.4)
        .to(ruleRef.current, { height: 56, duration: 0.6, ease: "power2.out" }, 0.6)
        .to(subTextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.8)
        .to(progressRef.current, { width: "100%", duration: 2.0, ease: "power1.inOut" }, 0);
        
      // Hold for a moment before completing
      tl.to({}, { duration: 0.2 });
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div 
      ref={introRef}
      id="intro" 
      className={`fixed inset-0 bg-ink z-[999] flex items-center justify-center flex-col transition-all duration-[1100ms] ease-out delay-300 ${isOut ? "opacity-0 -translate-y-2.5 pointer-events-none hidden" : ""}`}
    >
      <div ref={topTextRef} className="text-[9px] text-[rgba(240,235,226,0.28)] tracking-[0.4em] uppercase mb-5">Vol. I &nbsp;·&nbsp; No. 001 &nbsp;·&nbsp; West Jakarta</div>
      <div ref={nameRef} className="font-playfair text-[clamp(52px,11vw,96px)] font-black text-paper tracking-[-0.02em] leading-[0.9] text-center">dana<em className="italic font-normal">fdr</em></div>
      <div ref={ruleRef} className="w-[1px] bg-[rgba(240,235,226,0.18)] my-7 mx-auto"></div>
      <div ref={subTextRef} className="text-[9px] text-[rgba(240,235,226,0.22)] tracking-[0.35em] uppercase">Web Dev · Video Editor · Mograph</div>
      <div ref={progressRef} className="absolute bottom-0 left-0 h-0.5 bg-paper"></div>
    </div>
  );
}
