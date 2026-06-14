"use client";

import { useEffect } from "react";

export default function ZoomPreventer() {
  useEffect(() => {
    // 1. Prevent standard keyboard zooming
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "_" || e.code === "NumpadAdd" || e.code === "NumpadSubtract")
      ) {
        e.preventDefault();
      }
    };

    // 2. Prevent scroll wheel zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 3. Prevent pinch-to-zoom on touch devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Use passive: false to allow preventDefault to actually work
    document.addEventListener("keydown", handleKeydown, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}
