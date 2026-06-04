"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.anim-word');
      
      if (words) {
        gsap.fromTo(words, 
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.15, 
            ease: "power3.out",
            delay: 2.5 // Wait for intro to finish pulling back
          }
        );
      }

      // Slight parallax on scroll for photo
      if (photoRef.current) {
        gsap.to(photoRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="border-b border-border-rgba">
      <div className="py-3 px-10 border-b border-border-rgba flex justify-between text-[9px] text-ink2 tracking-[0.16em] uppercase">
        <span>West Jakarta, Indonesia · 2025</span>
        <span>Web Dev · Video Editor · Mograph · b. July 2008</span>
      </div>
      <div className="pt-[52px] px-10 pb-0 grid grid-cols-2 gap-0 relative">
        <div className="pr-10 border-r border-border-rgba relative z-10">
          <div className="text-[9px] text-accent tracking-[0.3em] uppercase mb-[18px]">Portfolio — Issue No. 001</div>
          <h1 ref={headlineRef} className="font-playfair text-[clamp(60px,9.5vw,104px)] font-black leading-[0.86] tracking-[-0.03em] flex flex-col">
            <span className="anim-word block">CODES</span>
            <span className="anim-word block"><em className="italic font-normal text-ink2">&amp; moves</em></span>
            <span className="anim-word block">THINGS</span>
          </h1>
        </div>
        <div className="pl-10 flex flex-col justify-between min-h-[440px] relative">
          <div 
            ref={photoRef} 
            className="absolute top-0 right-10 w-[200px] h-[260px] bg-[rgba(15,14,11,0.05)] border border-border-rgba z-0 -mt-[20px] overflow-hidden"
          >
            {/* TODO: Replace with actual personal photo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-ink3 uppercase tracking-[0.2em] text-center px-4">
              <span>Photo</span>
              <span>Placeholder</span>
            </div>
          </div>
          
          <div className="relative z-10 mt-[200px]">
            <p className="font-playfair italic text-[17px] text-ink2 leading-[1.6] max-w-[380px]">
              A web developer with the eye of a video editor. Full-stack apps that ship, visual cuts that hit with intention. At 17, from West Jakarta — building both before most people choose one.
            </p>
          </div>
          
          <div className="text-[9px] text-ink2 tracking-[0.12em] leading-[1.9] border-t border-border-rgba pt-4 mt-8 relative z-10">
            <strong className="text-ink font-normal block mb-[3px] text-[10px]">danafdr</strong>
            Laravel · Next.js · React · Premiere Pro · After Effects · C4D · Blender
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-border-rgba mt-[44px]">
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[34px] tracking-[0.08em] text-ink leading-none">WD</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">web dev — strongest</div>
        </div>
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[34px] tracking-[0.08em] text-ink leading-none">VE / MG</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">video editing &amp; mograph</div>
        </div>
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[34px] tracking-[0.08em] text-ink leading-none">17</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">years old — building</div>
        </div>
      </div>
    </section>
  );
}
