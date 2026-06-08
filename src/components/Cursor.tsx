"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset hover on route change
    setIsHovering(false);
  }, [pathname]);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse/trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    setIsVisible(true);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isMoving = false;
    let isHoveringRef = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(updateCursor);
      }
      
      // Check target on mouse move for more reliability than mouseover
      const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement;
      if (target) {
        const isInteractive = !!target.closest('a, button, input, textarea, select, [role="button"], .hoverable, [data-hoverable], .c-row, .work-item, .contact-link');
        if (isHoveringRef !== isInteractive) {
          isHoveringRef = isInteractive;
          setIsHovering(isInteractive);
        }
      }
    };

    const updateCursor = () => {
      // 0.2 lerp factor gives roughly a 60ms lag feel for smoothness
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }

      if (Math.abs(mouseX - cursorX) > 0.1 || Math.abs(mouseY - cursorY) > 0.1) {
        requestAnimationFrame(updateCursor);
      } else {
        isMoving = false;
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        willChange: "transform",
      }}
    >
      <div 
        className={`w-[10px] h-[10px] rounded-full bg-white transition-transform duration-200 ease-out ${isHovering ? "scale-[2.5]" : "scale-100"}`} 
      />
    </div>
  );
}
