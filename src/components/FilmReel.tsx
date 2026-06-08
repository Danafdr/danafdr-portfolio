"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "./Header";
import { projects, type Project } from "../data/projects";
import { getProjects } from "../lib/api";
import gsap from "gsap";

// Group projects by category
const initialCategories = [
  {
    name: "Web Development",
    slug: "webdev",
    description: "Full-stack applications, Next.js frontends, and Laravel APIs.",
    projects: [] as Project[],
  },
  {
    name: "Video Editing",
    slug: "video",
    description: "Cinematic cuts, narrative pacing, and product reels.",
    projects: [] as Project[],
  },
  {
    name: "Motion Graphics",
    slug: "mograph",
    description: "Title sequences and 3D-assisted motion using Blender and C4D pipelines fed into After Effects.",
    projects: [] as Project[],
  },
];

export default function FilmReel() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentVIndex, setCurrentVIndex] = useState(0);
  const [currentHIndex, setCurrentHIndex] = useState(0);
  const [preview, setPreview] = useState<Project | null>(null);
  const [showHints, setShowHints] = useState(true);

  const vContainerRef = useRef<HTMLDivElement>(null);
  const hContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeHContainerRef = useRef<number | null>(null);

  // Track which slides have already been animated
  const animatedSlidesRef = useRef<Set<number>>(new Set());
  const animatedHSlidesRef = useRef<Set<number>>(new Set());

  const [categories, setCategories] = useState(initialCategories);
  const totalSlides = categories.length + 1;

  useEffect(() => {
    getProjects().then(data => {
      if (!data || !Array.isArray(data)) return;
      
      const formattedProjects: Project[] = data.map((p: any) => ({
        id: p.id.toString(),
        typeBadge: p.type === 'web' ? 'Web Application' : p.type === 'motion' ? 'Motion Graphics' : p.type === 'video' ? 'Video Editing' : p.type === 'photography' ? 'Photography' : 'Other',
        title: p.title,
        description: p.description,
        tags: Array.isArray(p.tools) ? p.tools : (typeof p.tools === 'string' ? (function() { try { return JSON.parse(p.tools); } catch { return p.tools.split(',').map((s: string) => s.trim()); } })() : []),
        year: p.year || "2024",
        link: p.live_url || undefined,
        videoUrl: p.video_url || undefined,
        hasCaseStudy: false,
        visualTitle: p.title,
        visualSubtitle: p.typeBadge,
        gradientStart: p.gradient_start || '#0f0f0f',
        gradientEnd: p.gradient_end || '#1a1a1a',
        media: p.thumbnail_url ? [p.thumbnail_url] : (Array.isArray(p.media) ? p.media : (typeof p.media === 'string' ? JSON.parse(p.media) : []))
      }));

      setCategories([
        {
          name: "Web Development",
          slug: "webdev",
          description: "Full-stack applications, Next.js frontends, and Laravel APIs.",
          projects: formattedProjects.filter(p => p.typeBadge === "Web Application" || p.typeBadge === "Next.js Project" || p.typeBadge === "This Portfolio"),
        },
        {
          name: "Video Editing",
          slug: "video",
          description: "Cinematic cuts, narrative pacing, and product reels.",
          projects: formattedProjects.filter(p => p.typeBadge === "Video Editing"),
        },
        {
          name: "Motion Graphics",
          slug: "mograph",
          description: "Title sequences and 3D-assisted motion using Blender and C4D pipelines fed into After Effects.",
          projects: formattedProjects.filter(p => p.typeBadge === "Motion Graphics"),
        },
      ]);
    }).catch(err => console.error("Failed to fetch projects", err));
  }, []);

  // Scroll horizontally to Panel 2
  const browseProjects = useCallback((catIdx: number) => {
    activeHContainerRef.current = catIdx;
    const hContainer = hContainersRef.current[catIdx];
    if (hContainer) {
      hContainer.scrollTo({ left: window.innerWidth, behavior: "smooth" });
    }
  }, []);

  // Scroll horizontally back to Panel 1
  const goBackToIntro = useCallback((catIdx: number) => {
    activeHContainerRef.current = catIdx;
    const hContainer = hContainersRef.current[catIdx];
    if (hContainer) {
      hContainer.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, []);

  const handleHScroll = useCallback((catIdx: number, e: React.UIEvent<HTMLDivElement>) => {
    // Only the actively interacted container should sync to others to prevent loop
    if (activeHContainerRef.current !== null && activeHContainerRef.current !== catIdx) return;
    
    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
    requestAnimationFrame(() => {
      hContainersRef.current.forEach((container, i) => {
        if (container && i !== catIdx) {
          container.scrollLeft = scrollLeft;
        }
      });
    });
  }, []);

  // Effect to handle direct category navigation
  useEffect(() => {
    // Grab the slug once when mounted from Next.js state
    const targetSlug = searchParams.get("cat");
    
    if (targetSlug) {
      // Clear it from the URL immediately via Next.js router
      router.replace("/work", { scroll: false });
      
      const scrollIt = () => {
        const targetElement = document.getElementById(targetSlug);
        if (targetElement && vContainerRef.current) {
          // scrollIntoView natively respects scroll-pt-[80px] and snap points
          targetElement.scrollIntoView({ behavior: "instant", block: "start" });
        }
      };
      
      // Try scrolling immediately, and retry slightly later in case DOM was still laying out
      scrollIt();
      setTimeout(scrollIt, 100);
      setTimeout(scrollIt, 500);
    }
  }, [searchParams, router]);

  // Hide hints on first interaction
  useEffect(() => {
    const hideHints = () => setShowHints(false);
    window.addEventListener("wheel", hideHints, { once: true });
    window.addEventListener("touchstart", hideHints, { once: true });
    return () => {
      window.removeEventListener("wheel", hideHints);
      window.removeEventListener("touchstart", hideHints);
    };
  }, []);

  const isAnimatingWheel = useRef(false);

  // GSAP Smooth Wheel Hijacking for Vertical Snap
  useEffect(() => {
    const container = vContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow horizontal scroll (e.g. trackpad side swipe) to pass natively
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Allow native scroll inside the preview modal
      if (document.querySelector('.lightbox-close')) return;

      e.preventDefault();

      if (isAnimatingWheel.current) return;
      if (Math.abs(e.deltaY) < 5) return; // Ignore tiny movements

      const direction = e.deltaY > 0 ? 1 : -1;
      const targetIndex = currentVIndex + direction;

      if (targetIndex >= 0 && targetIndex < totalSlides) {
        isAnimatingWheel.current = true;
        const targetElement = container.querySelector(`[data-index="${targetIndex}"]`) as HTMLElement;
        if (targetElement) {
          const proxy = { y: container.scrollTop };
          gsap.to(proxy, {
            y: targetElement.offsetTop,
            duration: 1.2,
            ease: "expo.out",
            onUpdate: () => { container.scrollTop = proxy.y; },
            onComplete: () => {
              // Add delay to prevent double-jumps from continuous scrolling
              setTimeout(() => { isAnimatingWheel.current = false; }, 400);
            }
          });
        } else {
          isAnimatingWheel.current = false;
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentVIndex, totalSlides]);

  // Vertical Observer (between categories)
  useEffect(() => {
    if (!vContainerRef.current) return;

    let ctx = gsap.context(() => {});

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            
            // Update state safely
            setCurrentVIndex((prev) => (prev !== index ? index : prev));

            // Only animate if this slide hasn't been animated yet
            if (!animatedSlidesRef.current.has(index)) {
              animatedSlidesRef.current.add(index);
              ctx.add(() => {
                gsap.fromTo(
                  entry.target.querySelectorAll(".anim-el"),
                  { opacity: 0, y: 14 },
                  { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07 }
                );
              });
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const slides = vContainerRef.current.querySelectorAll(".reel-slide");
    slides.forEach((slide) => observer.observe(slide));

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []); // Run once, do not re-bind on scroll

  // Native CSS handles the dual-axis snap scrolling much smoother than JS interception

  // Horizontal Observer (panels within a category)
  useEffect(() => {
    // Offset by 1 because slide 0 is Intro
    const hContainer = currentVIndex > 0 ? hContainersRef.current[currentVIndex - 1] : null;
    if (!hContainer) return;

    let ctx = gsap.context(() => {});

    const hObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const hIndex = Number((entry.target as HTMLElement).dataset.hindex);
            setCurrentHIndex(hIndex);

            if (hIndex === 1) {
              const panel = entry.target;
              if (!animatedHSlidesRef.current.has(currentVIndex)) {
                animatedHSlidesRef.current.add(currentVIndex);
                const items = panel.querySelectorAll(".project-row");
                ctx.add(() => {
                  gsap.fromTo(
                    items,
                    { opacity: 0, x: 20 },
                    { opacity: 1, x: 0, duration: 0.4, ease: "power3.out", stagger: 0.06 }
                  );
                });
              }
            }
          }
        });
      },
      { threshold: 0.6, root: hContainer }
    );

    const panels = hContainer.querySelectorAll(".slide-panel");
    panels.forEach((panel) => hObserver.observe(panel));

    return () => {
      hObserver.disconnect();
      // DO NOT call ctx.revert() here! 
      // Reverting removes the opacity: 1 inline style, causing the projects to become permanently invisible
      // due to the .project-row { opacity: 0 } CSS fallback.
    };
  }, [currentVIndex]);

  // Animate the first slide on mount
  useEffect(() => {
    if (!vContainerRef.current) return;
    const firstSlide = vContainerRef.current.querySelector('.reel-slide[data-index="0"]');
    if (firstSlide && !animatedSlidesRef.current.has(0)) {
      animatedSlidesRef.current.add(0);
      gsap.fromTo(
        firstSlide.querySelectorAll(".anim-el"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07, delay: 0.3 }
      );
    }
  }, []);

  return (
    <>
      <Header />

      {/* Top Left Number — only visible on Panel 1 (category intro) */}
      <div
        className="fixed top-[100px] left-[40px] font-bebas text-[13px] tracking-[0.14em] text-ink3 z-40 transition-opacity duration-200"
        style={{ opacity: currentHIndex === 0 ? 1 : 0 }}
      >
        0{currentVIndex + 1} / 0{totalSlides}
      </div>

      {/* Left Edge Dots — Vertical (categories) */}
      <div 
        className="fixed left-[20px] top-1/2 -translate-y-1/2 flex flex-col gap-[8px] z-40 transition-opacity duration-300"
        style={{ opacity: currentHIndex === 1 ? 0 : 1, pointerEvents: currentHIndex === 1 ? 'none' : 'auto' }}
      >
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div
            key={idx}
            className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ease-out
              ${idx === currentVIndex ? "bg-accent scale-[1.4]" : "bg-ink3 scale-100"}
            `}
          ></div>
        ))}
      </div>

      {/* Bottom Center Dots — Horizontal (panels) */}
      <div 
        className="fixed bottom-[36px] left-1/2 -translate-x-1/2 flex gap-[10px] z-40 transition-opacity duration-300"
        style={{ opacity: currentVIndex === 0 ? 0 : 1, pointerEvents: currentVIndex === 0 ? 'none' : 'auto' }}
      >
        {[0, 1].map((_, idx) => (
          <div
            key={idx}
            className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ease-out
              ${idx === currentHIndex ? "bg-accent scale-[1.4]" : "bg-ink3 scale-100"}
            `}
          ></div>
        ))}
      </div>

      {/* Visual Hints */}
      <div
        className={`fixed bottom-8 right-10 flex flex-col items-end gap-2 font-mono text-[9px] text-ink3 uppercase tracking-widest transition-opacity duration-500 z-50 pointer-events-none ${
          showHints ? "opacity-100" : "opacity-0"
        }`}
      >
        <div>swipe →</div>
        <div>scroll ↓</div>
      </div>

      {/* Outer Vertical Scroll Container */}
      <div
        ref={vContainerRef}
        className="w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory bg-paper text-ink no-scrollbar scroll-pt-[80px] relative"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {/* Header spacer */}
        <div className="w-full h-[80px] snap-align-none"></div>

        {/* ── Slide 0: Selected Work Intro ── */}
        <div
          data-index={0}
          className="reel-slide w-full h-[calc(100dvh-80px)] snap-start snap-always flex items-center justify-center relative"
        >
          <div className="text-center max-w-[800px] px-10">
            <div className="anim-el text-[9px] text-ink3 tracking-[0.3em] uppercase mb-6">
              Vol. I · 2024 — present
            </div>
            <h1 className="anim-el font-playfair font-black text-[clamp(48px,10vw,100px)] leading-[0.88] tracking-[-0.02em] mb-8">
              Selected <em className="italic font-normal">work</em>
            </h1>
            <div className="anim-el w-[1px] h-12 bg-[rgba(15,14,11,0.18)] mx-auto mb-8"></div>
            <div className="anim-el text-[11px] font-mono text-ink2 tracking-[0.1em] uppercase">
              Web Dev · Video Editing · Mograph
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 anim-el">
            <div className="text-[9px] font-mono text-ink3 tracking-widest uppercase">
              Scroll
            </div>
            <div className="w-[1px] h-6 bg-ink3/40 animate-pulse"></div>
          </div>
        </div>

        {/* ── Category Slides ── */}
        {categories.map((category, catIdx) => (
          <div
            key={category.slug}
            id={category.slug}
            data-index={catIdx + 1}
            className="reel-slide w-full h-[calc(100dvh-80px)] snap-start snap-always"
          >
            {/* Inner Horizontal Scroll Container */}
            <div
              ref={(el) => { hContainersRef.current[catIdx] = el; }}
              className="w-full h-full flex overflow-x-scroll snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: "none" }}
              onMouseEnter={() => { activeHContainerRef.current = catIdx; }}
              onTouchStart={() => { activeHContainerRef.current = catIdx; }}
              onScroll={(e) => handleHScroll(catIdx, e)}
            >
              {/* ── Panel 1: Category Intro ── */}
              <div
                data-hindex="0"
                className="slide-panel w-screen h-full shrink-0 snap-start flex items-center relative px-10 md:px-[80px] lg:px-[100px]"
              >
                <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_35%] gap-10 lg:gap-16 items-center">
                  {/* Left: Text */}
                  <div>
                    <div className="anim-el text-[9px] text-accent tracking-[0.2em] uppercase mb-5">
                      0{catIdx + 1} — Category
                    </div>
                    <h2 className="anim-el font-playfair font-black text-[clamp(40px,6vw,72px)] leading-[0.88] tracking-[-0.02em] mb-6 text-ink">
                      {category.name}
                    </h2>
                    <p className="anim-el font-mono text-[14px] text-ink2 leading-[1.7] max-w-[400px] mb-8">
                      {category.description}
                    </p>
                    <div className="anim-el flex items-center gap-6 mb-10">
                      <div className="flex gap-2">
                        {[...new Set(category.projects.flatMap((p) => p.tags))].slice(0, 5).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono text-ink2 border border-[rgba(15,14,11,0.15)] py-1 px-3 uppercase tracking-[0.05em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-ink3">
                        {category.projects.length} project{category.projects.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="anim-el">
                      <button
                        onClick={() => browseProjects(catIdx)}
                        className="reel-arrow font-mono tracking-[0.1em] uppercase text-[9px] px-[14px] py-[6px] flex items-center gap-3 cursor-pointer group w-fit"
                        role="button"
                      >
                        <span>Browse projects</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Preview mosaic of the category's projects */}
                  <div className={`relative grid gap-3 anim-el ${
                    category.projects.length >= 3 ? 'h-[60vh]' : 
                    category.projects.length === 2 ? 'h-[40vh]' : 'h-[30vh]'
                  }`}
                    style={{
                      gridTemplateRows: category.projects.length > 1
                        ? `repeat(${Math.min(category.projects.length, 3)}, 1fr)`
                        : "1fr",
                    }}
                  >
                    {category.projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="border border-[rgba(15,14,11,0.1)] overflow-hidden flex items-center justify-center relative cursor-pointer group"
                        role="button"
                        style={{
                          background: `linear-gradient(135deg, ${project.gradientStart}, ${project.gradientEnd})`,
                        }}
                        onClick={() => setPreview(project)}
                      >
                        <div className="font-playfair font-black text-[18px] text-[#f0ebe2]/50 tracking-[-0.02em] transition-transform duration-500 group-hover:scale-110">
                          {project.title}
                        </div>
                        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Panel 2: Project Listing ── */}
              <div
                data-hindex="1"
                className="slide-panel w-screen h-full shrink-0 snap-start relative flex flex-col border-l border-[rgba(15,14,11,0.1)]"
              >
                {/* Panel Header */}
                <div className="px-6 md:px-10 pt-8 pb-5 border-b border-border-rgba flex flex-col md:flex-row items-start md:items-end justify-between shrink-0 gap-4">
                  <div className="flex flex-col items-start">
                    <button
                      onClick={() => goBackToIntro(catIdx)}
                      className="text-[9px] font-mono tracking-[0.15em] uppercase text-ink2 mb-4 hover:text-accent transition-colors flex items-center gap-2 group"
                      role="button"
                    >
                      <span className="transition-transform group-hover:-translate-x-1">←</span> Back to {category.name}
                    </button>
                    <div className="font-playfair font-black text-[24px] leading-[1] tracking-[-0.02em]">
                      Projects
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="font-mono text-[10px] text-ink3 uppercase tracking-widest">
                      {category.projects.length} item{category.projects.length !== 1 ? "s" : ""}
                    </div>
                    <div className="font-bebas text-[13px] tracking-[0.14em] text-ink3">
                      0{catIdx + 1} / 0{totalSlides}
                    </div>
                  </div>
                </div>

                {/* Project List */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-10 py-6" style={{ scrollbarWidth: "none" }}>
                  <div className="max-w-[1200px] mx-auto flex flex-col gap-0">
                    {category.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setPreview(project)}
                        className="project-row proj-row group w-full grid grid-cols-1 md:grid-cols-[52px_1fr_auto] gap-4 md:gap-6 items-start md:items-center py-6 shadow-[0_1px_0_0_var(--color-border-rgba)] cursor-pointer text-left hoverable active:scale-[0.98] transition-all duration-200"
                        role="button"
                      >
                        <div className="font-playfair text-[22px] md:text-[26px] font-black text-ink3 opacity-60">
                          {String(category.projects.indexOf(project) + 1).padStart(2, '0')}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                            <span className="font-playfair font-black text-[18px] leading-[1] tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent">
                              {project.title}
                            </span>
                            <span className="text-[8px] font-mono text-accent tracking-[0.15em] uppercase">
                              {project.typeBadge}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-ink2 leading-[1.5] max-w-[500px]">
                            {project.description}
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                          <div className="flex gap-[4px] flex-wrap justify-start md:justify-end">
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-mono text-ink3 border border-[rgba(15,14,11,0.12)] py-[2px] px-2 uppercase tracking-[0.05em]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[10px] font-mono text-ink3">{project.year}</span>
                            <span className="work-arr text-[14px] text-ink3 transition-all duration-200 group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Preview Modal ── */}
      {preview && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm"></div>
          <div
            className="relative z-10 w-[90vw] max-w-[900px] max-h-[85vh] bg-paper border border-[rgba(15,14,11,0.15)] overflow-y-auto no-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: "none" }}
          >
            <button
              onClick={() => setPreview(null)}
              className="lightbox-close absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center text-[16px] font-mono cursor-pointer rounded-full"
              role="button"
            >
              ×
            </button>

            {/* Large Gradient Visual */}
            <div
              className="w-full aspect-[16/9] flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${preview.gradientStart}, ${preview.gradientEnd})`,
              }}
            >
              <div className="font-playfair font-black text-[clamp(36px,6vw,72px)] text-[#f0ebe2]/30 tracking-[-0.02em] leading-[0.9] text-center px-10">
                {preview.title}
              </div>
              {preview.visualTitle && (
                <div className="absolute bottom-6 left-8 flex flex-col gap-1">
                  <div className="font-playfair font-black text-[16px] text-[#f0ebe2]/80">
                    {preview.visualTitle}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#f0ebe2]/50">
                    {preview.visualSubtitle}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8 mb-6">
                <div>
                  <div className="text-[9px] text-accent tracking-[0.2em] uppercase mb-3">
                    {preview.typeBadge}
                  </div>
                  <h3 className="font-playfair font-black text-[clamp(28px,4vw,44px)] leading-[0.9] tracking-[-0.02em] mb-2 md:mb-4">
                    {preview.title}
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-ink3 shrink-0 pt-0 md:pt-6">
                  {preview.year}
                </div>
              </div>

              <p className="font-mono text-[13px] text-ink2 leading-[1.7] max-w-[550px] mb-8">
                {preview.description}
              </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 border-t border-[rgba(15,14,11,0.1)] pt-6">
                  <div className="flex gap-2 flex-wrap">
                    {preview.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono text-ink2 border border-[rgba(15,14,11,0.15)] py-1 px-3 uppercase tracking-[0.05em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="sm:ml-auto flex flex-wrap gap-4 items-center">
                    {preview.videoUrl && (
                      <a
                        href={preview.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono tracking-[0.1em] uppercase text-accent flex items-center gap-2 hover:gap-3 transition-all no-underline"
                      >
                        Watch Video ↗
                      </a>
                    )}
                    {preview.link && (
                      <a
                        href={preview.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono tracking-[0.1em] uppercase text-accent flex items-center gap-2 hover:gap-3 transition-all no-underline"
                      >
                        Visit live ↗
                      </a>
                    )}
                    {!preview.link && !preview.videoUrl && (
                      <div className="text-[11px] font-mono tracking-[0.1em] uppercase text-ink3 flex items-center gap-2">
                        {preview.hasCaseStudy ? "Case study coming" : "Coming soon"}
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .anim-el { opacity: 0; transform: translateY(14px); }
        .project-row { opacity: 0; transform: translateX(20px); }
      `}} />
    </>
  );
}
