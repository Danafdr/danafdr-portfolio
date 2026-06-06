"use client";

import { useEffect, useRef } from "react";

export default function Hero({ heroSettings }: { heroSettings?: any }) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let ctx: any;

    const initGsap = async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      
      const gsap = gsapModule.default || gsapModule.gsap;
      const ScrollTrigger = ScrollTriggerModule.default || ScrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const words = headlineRef.current?.querySelectorAll('.anim-word');
        const hasPlayedIntro = sessionStorage.getItem("introPlayed");
        
        if (words) {
          gsap.to(words, 
            { 
              y: 0, 
              opacity: 1, 
              duration: 1.2, 
              stagger: 0.15, 
              ease: "power3.out",
              delay: hasPlayedIntro ? 0.5 : 3.2
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
    };

    initGsap();
    
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  const hasPhoto = !!heroSettings?.photo_url;
  const isCssMode = heroSettings?.filter_mode === 'css';
  const showGrain = isCssMode && heroSettings?.filter_values?.grain > 0;

  const getCssFilter = () => {
    if (!isCssMode) return 'none';
    if (!heroSettings?.filter_values && !heroSettings?.filter) return 'none';
    const PRESETS = [
      { id: 'original', css: 'none' },
      { id: 'grainy', css: 'contrast(1.1) brightness(0.95) saturate(0.9)' },
      { id: 'warm', css: 'sepia(0.15) saturate(1.1) brightness(1.05) contrast(0.95)' },
      { id: 'desaturated', css: 'saturate(0.3) contrast(1.05) brightness(1.02)' },
      { id: 'dark', css: 'brightness(0.82) contrast(1.2) saturate(0.85)' },
      { id: 'fade', css: 'brightness(1.1) contrast(0.82) saturate(0.75)' },
    ];
    let presetCss = PRESETS.find(p => p.id === heroSettings.filter)?.css || 'none';
    let base = presetCss !== 'none' ? presetCss + ' ' : '';
    if (heroSettings.filter_values?.brightness) base += `brightness(${1 + heroSettings.filter_values.brightness/100}) `;
    if (heroSettings.filter_values?.contrast) base += `contrast(${1 + heroSettings.filter_values.contrast/100}) `;
    return base.trim() || 'none';
  };

  return (
    <section id="hero" className="border-b border-border-rgba flex flex-col min-h-[calc(100vh-80px)]">
      {/* Top Bar */}
      <div className="py-3 px-10 border-b border-border-rgba flex justify-between text-[9px] text-ink2 tracking-[0.16em] uppercase shrink-0">
        <span>West Jakarta, Indonesia · 2025</span>
        <span>Web Dev · Video Editor · Mograph · b. July 2008</span>
      </div>

      {/* Main Content */}
      <div className="px-10 grid grid-cols-2 gap-0 relative flex-1">
        {/* Left Col */}
        <div className="pr-10 border-r border-border-rgba relative z-10 flex flex-col justify-center py-[4vh]">
          <div className="text-[9px] text-accent tracking-[0.3em] uppercase mb-[4vh]">Portfolio — Issue No. 001</div>
          <h1 ref={headlineRef} className="font-playfair text-[clamp(50px,9.5vw,104px)] font-black leading-[0.86] tracking-[-0.03em] flex flex-col">
            <span className="anim-word block opacity-0 translate-y-10">CODES</span>
            <span className="anim-word block opacity-0 translate-y-10"><em className="italic font-normal text-ink2">&amp; moves</em></span>
            <span className="anim-word block opacity-0 translate-y-10">THINGS</span>
          </h1>
        </div>

        {/* Right Col */}
        <div className="pl-10 flex flex-col justify-between relative py-[4vh]">
          <div 
            ref={photoRef} 
            className="absolute top-0 right-0 w-[clamp(140px,18vw,200px)] h-[clamp(180px,25vw,260px)] bg-[rgba(15,14,11,0.05)] border border-border-rgba z-0 -mt-px overflow-hidden flex items-center justify-center"
          >
            {!hasPhoto ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-ink3 uppercase tracking-[0.2em] text-center px-4">
                <span>Photo</span>
                <span>Placeholder</span>
              </div>
            ) : (
              <div className="w-full h-full relative overflow-hidden bg-ink">
                <img 
                  src={heroSettings.photo_url} 
                  className="absolute max-w-none"
                  style={{
                    filter: getCssFilter(),
                    transform: `rotate(${heroSettings.rotation || 0}deg)`,
                    ...(heroSettings.crop && isCssMode ? {
                      width: `${(heroSettings.width / heroSettings.crop.width) * 100}%`,
                      height: `${(heroSettings.height / heroSettings.crop.height) * 100}%`,
                      left: `-${(heroSettings.crop.x / heroSettings.crop.width) * 100}%`,
                      top: `-${(heroSettings.crop.y / heroSettings.crop.height) * 100}%`
                    } : {
                      width: '100%', height: '100%', objectFit: 'cover'
                    })
                  }}
                  alt="Danadirsha"
                />
                {showGrain && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                      backgroundImage: `url('http://127.0.0.1:8000/storage/assets/grain.png')`,
                      opacity: heroSettings.filter_values.grain / 100,
                    }}
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="relative z-10 mt-[clamp(120px,18vh,200px)]">
            <p className="font-playfair italic text-[clamp(14px,1.6vw,17px)] text-ink2 leading-[1.6] max-w-[380px]">
              A web developer with the eye of a video editor. Full-stack apps that ship, visual cuts that hit with intention. At 17, from West Jakarta — building both before most people choose one.
            </p>
          </div>
          
          <div className="text-[9px] text-ink2 tracking-[0.12em] leading-[1.9] border-t border-border-rgba pt-4 mt-auto relative z-10">
            <strong className="text-ink font-normal block mb-[3px] text-[10px]">danafdr</strong>
            Laravel · Next.js · React · Premiere Pro · After Effects · C4D · Blender
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="grid grid-cols-3 border-t border-border-rgba mt-auto shrink-0">
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[clamp(24px,3vw,34px)] tracking-[0.08em] text-ink leading-none">WD</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">web dev — strongest</div>
        </div>
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[clamp(24px,3vw,34px)] tracking-[0.08em] text-ink leading-none">VE / MG</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">video editing &amp; mograph</div>
        </div>
        <div className="py-5 px-7 border-r border-border-rgba last:border-r-0">
          <div className="font-bebas text-[clamp(24px,3vw,34px)] tracking-[0.08em] text-ink leading-none">17</div>
          <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mt-1">years old — building</div>
        </div>
      </div>
    </section>
  );
}
