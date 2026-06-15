"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import { projects, type Project } from "../data/projects";
import { getProjects } from "../lib/api";
import gsap from "gsap";

function CroppedThumbnail({ project, sizeKey, className }: { project: Project, sizeKey: '16:9' | '4:3' | '1:1', className?: string }) {
  if (!project.thumbnail) return null;
  const crop = project.thumbnailMultiCrops?.[sizeKey] || project.thumbnailCrop;
  
  const cssFilter = project.thumbnailFilter && project.thumbnailFilterValues && Object.keys(project.thumbnailFilterValues).length > 0
    ? Object.entries(project.thumbnailFilterValues).map(([k, v]: [string, any]) => {
        if (k === 'blur') return `${k}(${v}px)`;
        if (k === 'hue-rotate') return `${k}(${v}deg)`;
        return `${k}(${v})`;
      }).join(' ')
    : 'none';

  return (
    <div className={`overflow-hidden relative bg-bg ${className}`}>
      {crop && crop.width > 0 && crop.height > 0 ? (
        <img
          src={project.thumbnail}
          alt={project.title}
          style={{
            position: 'absolute',
            width: `${(100 / crop.width) * 100}%`,
            height: `${(100 / crop.height) * 100}%`,
            left: `-${(crop.x / crop.width) * 100}%`,
            top: `-${(crop.y / crop.height) * 100}%`,
            filter: cssFilter,
            objectFit: 'cover',
            maxWidth: 'none'
          }}
        />
      ) : (
        <img src={project.thumbnail} className="w-full h-full object-cover" style={{ filter: cssFilter }} alt={project.title} />
      )}
    </div>
  );
}

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
  const [isGridView, setIsGridView] = useState(false);

  const vContainerRef = useRef<HTMLDivElement>(null);
  const hContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeHContainerRef = useRef<number | null>(null);

  // Track which slides have already been animated
  const animatedSlidesRef = useRef<Set<number>>(new Set());
  const animatedHSlidesRef = useRef<Set<string>>(new Set());

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
        media: p.thumbnail ? [p.thumbnail] : (Array.isArray(p.media) ? p.media : (typeof p.media === 'string' ? JSON.parse(p.media) : [])),
        thumbnail: p.thumbnail || undefined,
        thumbnailFilter: p.thumbnail_filter || undefined,
        thumbnailFilterValues: p.thumbnail_filter_values ? (typeof p.thumbnail_filter_values === 'string' ? JSON.parse(p.thumbnail_filter_values) : p.thumbnail_filter_values) : undefined,
        thumbnailCrop: p.thumbnail_crop ? (typeof p.thumbnail_crop === 'string' ? JSON.parse(p.thumbnail_crop) : p.thumbnail_crop) : undefined,
        thumbnailMultiCrops: p.thumbnail_multi_crops ? (typeof p.thumbnail_multi_crops === 'string' ? JSON.parse(p.thumbnail_multi_crops) : p.thumbnail_multi_crops) : undefined,
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
      hContainer.scrollTo({ left: window.innerWidth, behavior: "auto" });
    }
  }, []);

  // Scroll horizontally back to Panel 1
  const goBackToIntro = useCallback((catIdx: number) => {
    activeHContainerRef.current = catIdx;
    const hContainer = hContainersRef.current[catIdx];
    if (hContainer) {
      hContainer.scrollTo({ left: 0, behavior: "auto" });
    }
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

            if (hIndex >= 1) {
              const panel = entry.target;
              const slideKey = `${currentVIndex}-${hIndex}`;
              if (!animatedHSlidesRef.current.has(slideKey)) {
                animatedHSlidesRef.current.add(slideKey);
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
                      <div
                        onClick={() => browseProjects(catIdx)}
                        className="reel-arrow font-mono tracking-[0.1em] uppercase text-[9px] px-[14px] py-[6px] flex items-center gap-3 cursor-pointer group w-fit"
                        role="button"
                      >
                        <span>Browse projects</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
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
                        className="border border-[rgba(15,14,11,0.1)] overflow-hidden flex items-center justify-center relative cursor-pointer group bg-bg"
                        role="button"
                        style={{
                          background: `linear-gradient(135deg, ${project.gradientStart}, ${project.gradientEnd})`,
                        }}
                        onClick={() => setPreview(project)}
                      >
                        {project.thumbnail ? (
                          <>
                            <CroppedThumbnail project={project} sizeKey="1:1" className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                            <div className="absolute bottom-4 left-5 font-playfair font-black text-[16px] text-paper opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                              {project.title}
                            </div>
                          </>
                        ) : (
                          <div className="font-playfair font-black text-[18px] text-[#f0ebe2]/50 tracking-[-0.02em] transition-transform duration-500 group-hover:scale-110 relative z-10">
                            {project.title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 z-20 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Panel 2: Project Listing ── */}
              <div
                data-hindex={1}
                className="slide-panel w-screen h-[calc(100dvh-80px)] shrink-0 snap-start relative flex flex-col border-l border-[rgba(15,14,11,0.1)]"
              >
                {/* Panel Header */}
                <div className="px-6 md:px-10 pt-8 pb-5 border-b border-border-rgba flex flex-col md:flex-row items-start md:items-end justify-between shrink-0 gap-4 bg-paper z-10 relative">
                  <div className="flex flex-col items-start">
                    <div
                      onClick={() => goBackToIntro(catIdx)}
                      className="text-[9px] font-mono tracking-[0.15em] uppercase text-ink2 mb-4 hover:text-accent transition-colors flex items-center gap-2 group cursor-pointer"
                      role="button"
                    >
                      <span className="transition-transform group-hover:-translate-x-1">←</span> Back to {category.name}
                    </div>
                    <div className="font-playfair font-black text-[24px] leading-[1] tracking-[-0.02em]">
                      Projects
                    </div>
                  </div>
                  <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
                    {/* View Toggle Button */}
                    <button
                      onClick={() => setIsGridView(!isGridView)}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-border-rgba bg-transparent hover:bg-ink/5 transition-colors group"
                      aria-label="Toggle View"
                      title={isGridView ? "Switch to List View" : "Switch to Grid View"}
                    >
                      {isGridView ? (
                        <svg className="w-3.5 h-3.5 text-ink2 group-hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-ink2 group-hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      )}
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-[10px] text-ink3 uppercase tracking-widest">
                        {category.projects.length} item{category.projects.length !== 1 ? "s" : ""}
                      </div>
                      <div className="font-bebas text-[13px] tracking-[0.14em] text-ink3">
                        0{catIdx + 1} / 0{totalSlides}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project List */}
                <div className={`flex-1 min-h-0 flex flex-col justify-start px-5 sm:px-6 md:px-10 py-6 overflow-x-hidden overflow-y-auto no-scrollbar ${isGridView ? "" : "snap-y snap-mandatory"}`} style={{ scrollbarWidth: "none" }}>
                  <div className={`max-w-[1200px] w-full mx-auto pb-24 ${isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6 md:gap-4"}`}>
                    {category.projects.map((project, idx) => (
                      <div
                        key={project.id}
                        onClick={() => setPreview(project)}
                        className={`project-row proj-row group w-full cursor-pointer text-left hover:bg-[rgba(15,14,11,0.02)] active:scale-[0.99] transition-all duration-200 shrink-0 ${
                          isGridView 
                            ? "flex flex-col justify-between gap-4 p-5 rounded-[4px] border border-[rgba(15,14,11,0.08)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] bg-paper/50" 
                            : "grid grid-cols-1 md:grid-cols-[40px_110px_1fr_auto] gap-4 md:gap-5 items-start md:items-center py-4 px-4 mx-0 md:-mx-4 shadow-[0_1px_0_0_var(--color-border-rgba)] snap-start"
                        }`}
                        role="button"
                        style={isGridView ? {} : { scrollMarginTop: "24px" }}
                      >
                        {/* 1. Header / Index */}
                        {isGridView ? (
                          <div className="flex justify-between items-center w-full mb-1">
                            <div className="font-playfair text-[12px] font-black text-ink3 opacity-60">
                              {String(idx + 1).padStart(2, '0')}
                            </div>
                            <span className="text-[7px] font-mono text-accent tracking-[0.15em] uppercase px-2 py-1 bg-[rgba(15,14,11,0.03)] border border-[rgba(15,14,11,0.08)] rounded-[2px]">
                              {project.typeBadge}
                            </span>
                          </div>
                        ) : (
                          <div className="font-playfair text-[18px] md:text-[20px] font-black text-ink3 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                        )}

                        {/* 2. Thumbnail */}
                        <div className={isGridView ? "w-full overflow-hidden rounded-[2px]" : "hidden md:block w-full"}>
                          {project.thumbnail ? (
                            <CroppedThumbnail project={project} sizeKey="4:3" className={`w-full ${isGridView ? "aspect-[16/10] object-cover" : "aspect-[4/3]"} rounded-[2px] transition-transform duration-700 ease-out group-hover:scale-105`} />
                          ) : (
                            <div className={`w-full ${isGridView ? "aspect-[16/10]" : "aspect-[4/3]"} bg-ink3/10 rounded-[2px]`} />
                          )}
                        </div>

                        {/* 3. Info */}
                        <div className={`flex flex-col w-full ${isGridView ? "gap-2 mt-2" : "gap-1 pl-0 md:pl-2"}`}>
                          <div className={`flex ${isGridView ? "flex-col" : "flex-col md:flex-row md:items-center gap-2 md:gap-3"}`}>
                            <span className={`font-playfair font-black leading-[1.1] tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent ${isGridView ? "text-[20px]" : "text-[16px] md:text-[18px]"}`}>
                              {project.title}
                            </span>
                            {!isGridView && (
                              <span className="text-[7px] md:text-[8px] font-mono text-accent tracking-[0.15em] uppercase">
                                {project.typeBadge}
                              </span>
                            )}
                          </div>
                          <div className={`font-mono text-ink2 leading-[1.6] ${isGridView ? "text-[10px] line-clamp-3 opacity-80" : "text-[9px] md:text-[10px] max-w-[500px]"}`}>
                            {project.description}
                          </div>
                        </div>

                        {/* 4. Right side / Footer */}
                        <div className={`flex items-center justify-between w-full ${isGridView ? "mt-4 pt-4 border-t border-border-rgba" : "gap-4 md:w-auto md:justify-end mt-2 md:mt-0"}`}>
                          <div className={`flex gap-[4px] flex-wrap justify-start ${isGridView ? "" : "md:justify-end"}`}>
                            {project.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-mono text-ink3 border border-[rgba(15,14,11,0.12)] py-[2px] px-2 uppercase tracking-[0.05em] transition-colors duration-300 group-hover:border-[rgba(15,14,11,0.2)] group-hover:text-ink2"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[10px] font-mono text-ink3">{project.year}</span>
                            <span className="work-arr text-[14px] text-ink3 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[600] flex items-center justify-center"
            onClick={() => setPreview(null)}
          >
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm"></div>
            <motion.div
              key="preview-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[90vw] max-w-[900px] max-h-[85vh] bg-paper border border-[rgba(15,14,11,0.15)] overflow-y-auto no-scrollbar flex flex-col shadow-2xl rounded-[4px]"
              onClick={(e) => e.stopPropagation()}
              style={{ scrollbarWidth: "none" }}
            >
              <button
                onClick={() => setPreview(null)}
                className="lightbox-close absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center text-[20px] font-mono cursor-pointer rounded-full bg-paper/50 hover:bg-paper backdrop-blur-md border border-[rgba(15,14,11,0.1)] text-ink hover:scale-110 active:scale-95 transition-all shadow-sm"
                role="button"
                aria-label="Close modal"
              >
                ×
              </button>

            {/* Large Gradient Visual */}
            <div
              className="w-full aspect-[16/9] flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${preview.gradientStart}, ${preview.gradientEnd})`,
              }}
            >
              {preview.thumbnail ? (
                <CroppedThumbnail project={preview} sizeKey="16:9" className="absolute inset-0 w-full h-full" />
              ) : (
                <div className="font-playfair font-black text-[clamp(36px,6vw,72px)] text-[#f0ebe2]/30 tracking-[-0.02em] leading-[0.9] text-center px-10 relative z-10">
                  {preview.title}
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent pointer-events-none" />

              {preview.visualTitle && (
                <div className="absolute bottom-6 left-8 flex flex-col gap-1 z-10">
                  <div className="font-playfair font-black text-[16px] text-[#f0ebe2]/80 drop-shadow-md">
                    {preview.visualTitle}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#f0ebe2]/50 drop-shadow-md">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .anim-el { opacity: 0; transform: translateY(14px); }
      `}} />
    </>
  );
}
