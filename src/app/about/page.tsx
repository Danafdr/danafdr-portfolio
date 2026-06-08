import type { Metadata } from "next";
import Header from "../../components/Header";
import { prisma } from "../../lib/prisma";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About — danafdr",
  description: "Web dev, video editing, and what shapes the work.",
};

async function getHeroSettings() {
  try {
    const hero = await prisma.hero_settings.findFirst();
    return hero || null;
  } catch (e) {
    console.error('Failed to fetch hero settings', e);
    return null;
  }
}

export default async function AboutPage() {
  const heroSettings = await getHeroSettings();
  const hasPhoto = !!heroSettings?.photo_url;
  const isCssMode = heroSettings?.filter_mode === 'css';
  const showGrain = isCssMode && (heroSettings?.filter_values as any)?.grain > 0;

  const getCssFilter = () => {
    if (!isCssMode) return 'none';
    if (!heroSettings?.filter_values && !heroSettings?.filter) return 'none';
    const fv = heroSettings.filter_values as any;
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
    if (fv?.brightness) base += `brightness(${1 + fv.brightness/100}) `;
    if (fv?.contrast) base += `contrast(${1 + fv.contrast/100}) `;
    return base.trim() || 'none';
  };

  return (
    <main className="bg-paper min-h-screen">
      <Header />
      
      <article className="max-w-4xl mx-auto px-10 pt-20">
        <div className="grid grid-cols-[1fr_2fr] gap-20 relative">
          <div className="h-full">
            <div className="sticky top-[20vh]">
            <h1 className="font-playfair text-[clamp(40px,5vw,64px)] font-black leading-[0.9] tracking-[-0.02em] mb-6">
              Who is<br /><em className="italic font-normal text-ink2">danafdr?</em>
            </h1>
            <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase mb-4">West Jakarta, Indonesia</div>
            <div className="text-[9px] text-ink2 tracking-[0.14em] uppercase">Web Dev · Video Editor</div>
            
            <div className="mt-12 w-full aspect-[3/4] bg-[rgba(15,14,11,0.05)] border border-border-rgba relative overflow-hidden grayscale contrast-125 flex items-center justify-center">
              {!hasPhoto ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-ink3 uppercase tracking-[0.2em] text-center px-4">
                  <span>Candid</span>
                  <span>Photo</span>
                </div>
              ) : (
                <div className="w-full h-full relative overflow-hidden bg-ink">
                  <img 
                    src={heroSettings.photo_url!} 
                    className="absolute max-w-none"
                    style={{
                      filter: getCssFilter(),
                      transform: `rotate(${heroSettings.rotation || 0}deg)`,
                      ...((heroSettings.crop as any) && isCssMode ? {
                        width: `${(heroSettings.width! / (heroSettings.crop as any).width) * 100}%`,
                        height: `${(heroSettings.height! / (heroSettings.crop as any).height) * 100}%`,
                        left: `-${((heroSettings.crop as any).x / (heroSettings.crop as any).width) * 100}%`,
                        top: `-${((heroSettings.crop as any).y / (heroSettings.crop as any).height) * 100}%`
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
                        backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/storage/assets/grain.png')`,
                        opacity: (heroSettings.filter_values as any).grain / 100,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
          
          <div className="font-mono text-[13px] leading-[2.1] text-ink2 mt-4 pb-32">
            <p className="mb-8 text-ink text-[15px] leading-[1.9]">
              <span className="float-left text-[64px] font-playfair font-black leading-[0.8] mr-3 mt-1 text-ink">A</span>
              17-year-old from West Jakarta who builds full-stack web apps and studies how things move. Web development is the strongest skill right now — Laravel, Next.js, React, shipping real projects and growing fast.
            </p>
            
            <p className="mb-8">
              But I'm also carving out a direction in video editing and motion graphics. Tweaking with After Effects, using Cinema 4D and Blender as pipeline tools, and learning cinematography to see what makes a cut feel alive. I'm studying Apple and SaaS motion aesthetics because I want to learn what makes a product look premium.
            </p>
            
            <p className="mb-8">
              I'm obsessed with The Finals for the same reason Whiplash hits so hard — when every detail is deliberate, when nothing is accidental, it stops being a game or a film and becomes something else entirely. That's the standard.
            </p>

            <div className="border-t border-border-rgba my-16 pt-16">
              <h2 className="font-playfair text-[24px] font-black text-ink tracking-[-0.01em] mb-10">
                Timeline
              </h2>
              
              <div className="grid grid-cols-[80px_1fr] gap-6 mb-8 group">
                <div className="text-[10px] text-ink3 font-bold mt-1.5 transition-colors group-hover:text-accent">2025</div>
                <div>
                  <div className="text-[13px] text-ink mb-1">Building</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Shipping real projects, paid work, growing fast. Moving towards combining web dev with high-end motion.</div>
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-6 mb-8 group">
                <div className="text-[10px] text-ink3 font-bold mt-1.5 transition-colors group-hover:text-accent">2024</div>
                <div>
                  <div className="text-[13px] text-ink mb-1">Modern Stack</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Diving deep into Next.js, React, and Laravel. Building apps that solve real problems.</div>
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-6 mb-8 group">
                <div className="text-[10px] text-ink3 font-bold mt-1.5 transition-colors group-hover:text-accent">2023</div>
                <div>
                  <div className="text-[13px] text-ink mb-1">Web Dev</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Wrote the first lines of code. Discovered how to build the things I was designing.</div>
                </div>
              </div>
              
              <div className="grid grid-cols-[80px_1fr] gap-6 group">
                <div className="text-[10px] text-ink3 font-bold mt-1.5 transition-colors group-hover:text-accent">2022</div>
                <div>
                  <div className="text-[13px] text-ink mb-1">Video Editing</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Started cutting videos. Learned pacing, rhythm, and what makes something feel right on screen.</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border-rgba my-16 pt-16">
              <h2 className="font-playfair text-[24px] font-black text-ink tracking-[-0.01em] mb-10">
                What <em className="italic font-normal">shapes the work</em>
              </h2>
              
              <div className="grid gap-10">
                <div>
                  <div className="text-[9px] text-ink3 tracking-[0.18em] uppercase mb-3">Films</div>
                  <div className="text-[13px] text-ink mb-2 tracking-[0.02em]">Whiplash · Fight Club · La La Land · Edgerunners</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">People consumed by making things perfectly. Craft obsession, emotional beauty, vivid chaos — all four in the same room.</div>
                </div>
                
                <div>
                  <div className="text-[9px] text-ink3 tracking-[0.18em] uppercase mb-3">Music</div>
                  <div className="text-[13px] text-ink mb-2 tracking-[0.02em]">Frank Ocean · Mac Miller · Rex Orange County · Daniel Caesar</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Blonde is the perfect album. Emotion without explanation. The visual language of this portfolio is heavily inspired by the Boys Don't Cry magazine.</div>
                </div>
                
                <div>
                  <div className="text-[9px] text-ink3 tracking-[0.18em] uppercase mb-3">Games</div>
                  <div className="text-[13px] text-ink mb-2 tracking-[0.02em]">The Finals · Geometry Dash · Need For Speed Heat</div>
                  <div className="text-[11px] text-ink2 leading-[1.7]">Absolute aesthetic commitment. No half measures in art direction.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
