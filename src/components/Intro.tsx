"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Intro() {
  const pathname = usePathname();
  const [isOut, setIsOut] = useState(pathname !== "/");
  const [instantSkip, setInstantSkip] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  
  // Elements for animation
  const topTextRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") {
      sessionStorage.setItem("introPlayed", "true");
      setIsOut(true);
      return;
    }

    const hasPlayed = sessionStorage.getItem("introPlayed") === "true";
    
    // Ensure it's visible before animating
    setIsOut(false);
    setInstantSkip(false);

    let ctx: any;

    const initGsap = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule.gsap;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem("introPlayed", "true");
            setIsOut(true);
          }
        });

        // Initial state
        gsap.set([topTextRef.current, nameRef.current, subTextRef.current], { opacity: 0, y: 10 });
        gsap.set(ruleRef.current, { height: 0 });
        gsap.set(progressRef.current, { width: 0 });

        if (!hasPlayed) {
          // Long loading sequence
          tl.to(progressRef.current, { width: "30%", duration: 1.0, ease: "power1.out" }, 0)
            .to(nameRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, 0.5)
            .to(topTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.0)
            .to(progressRef.current, { width: "75%", duration: 1.2, ease: "none" }, 1.0)
            .to(ruleRef.current, { height: 56, duration: 0.8, ease: "power2.out" }, 1.8)
            .to(subTextRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 2.2)
            .to(progressRef.current, { width: "100%", duration: 0.8, ease: "power1.in" }, 2.6)
            .to({}, { duration: 0.4 }); // Hold at end
        } else {
          // Fast load sequence (returning to home)
          tl.to(progressRef.current, { width: "100%", duration: 0.6, ease: "power2.inOut" }, 0)
            .to(nameRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1)
            .to([topTextRef.current, ruleRef.current, subTextRef.current], { opacity: 1, y: 0, height: 56, duration: 0.4, ease: "power2.out", stagger: 0.05 }, 0.2)
            .to({}, { duration: 0.2 }); // Hold briefly
        }
      });
    };

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [pathname]);

  return (
    <div 
      ref={introRef}
      id="intro" 
      suppressHydrationWarning
      className={`fixed inset-0 bg-ink z-[999] flex items-center justify-center flex-col ${!instantSkip ? "transition-all duration-[1100ms] ease-out delay-300" : ""} ${isOut ? "opacity-0 -translate-y-2.5 pointer-events-none" : ""}`}
    >
      <div ref={topTextRef} className="text-[9px] text-[rgba(240,235,226,0.28)] tracking-[0.4em] uppercase mb-5">Vol. I &nbsp;·&nbsp; No. 001 &nbsp;·&nbsp; Jakarta</div>
      <div ref={nameRef} className="font-playfair text-[52px] md:text-[74px] lg:text-[96px] font-black text-paper tracking-[-0.02em] leading-[0.9] text-center">dana<em className="italic font-normal">fdr</em></div>
      <div ref={ruleRef} className="w-[1px] bg-[rgba(240,235,226,0.18)] my-7 mx-auto"></div>
      <div ref={subTextRef} className="text-[9px] text-[rgba(240,235,226,0.22)] tracking-[0.35em] uppercase">Web Dev · Video Editor · Mograph</div>
      <div ref={progressRef} className="absolute bottom-0 left-0 h-0.5 bg-paper"></div>
    </div>
  );
}
