"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CursorHider() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on devices with a hover cursor
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const setCursorNone = (el: HTMLElement | null) => {
      if (el && el.style) {
        el.style.setProperty("cursor", "none", "important");
      }
    };

    // 1 & 2: Set root and body
    setCursorNone(document.documentElement);
    setCursorNone(document.body);

    // 3. Listen for mouseover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.style) {
        const computed = window.getComputedStyle(target).cursor;
        if (computed && computed !== "none") {
          setCursorNone(target);
        }
      }
    };
    document.addEventListener("mouseover", handleMouseOver, { capture: true, passive: true });

    // 4. MutationObserver for new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              // Setting inline style on every new element
              setCursorNone(el);
              
              // Also recursively apply to children if it's a large tree
              // to be absolutely sure, though CSS usually handles it.
              // To prevent performance hits, we only apply to the root of the added tree
              // as CSS wildcard should cover the children, but we add it to the wrapper.
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 5. dragstart event
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      setCursorNone(target);
      if (e.dataTransfer) {
        // Some browsers allow setting cursor during drag
        e.dataTransfer.effectAllowed = "none";
      }
    };
    document.addEventListener("dragstart", handleDragStart, { capture: true, passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
