"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Only run on desktop/non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial position immediately to avoid flash at 0,0
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      // 80ms lag effect using GSAP
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15, // ~80ms perceived lag
        ease: "power2.out"
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Link hover effect (expand + difference blend mode)
      const isLink = target.closest("a, button, .group, [role='button']");
      
      // Crosshair effect on images or specific areas
      const isImage = target.closest("img, .hero-image, .crosshair-area");

      if (isLink) {
        setIsHovering(true);
        setIsCrosshair(false);
      } else if (isImage) {
        setIsCrosshair(true);
        setIsHovering(false);
      } else {
        setIsHovering(false);
        setIsCrosshair(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out flex items-center justify-center mix-blend-difference bg-paper
        ${isHovering ? "w-10 h-10" : "w-2 h-2"}
        ${isCrosshair ? "!bg-transparent border border-paper !w-6 !h-6" : ""}
      `}
    >
      {isCrosshair && (
        <>
          <div className="absolute w-[1px] h-full bg-paper"></div>
          <div className="absolute h-[1px] w-full bg-paper"></div>
        </>
      )}
    </div>
  );
}
