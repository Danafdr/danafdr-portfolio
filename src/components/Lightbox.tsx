"use client";

import { useEffect } from "react";

interface Photo {
  id: number;
  url: string;
  source: string;
  tags: string[];
  width: number;
  height: number;
}

interface LightboxProps {
  photos: Photo[];
  lightboxIndex: number | null;
  setLightboxIndex: (index: number | null) => void;
}

export default function Lightbox({ photos, lightboxIndex, setLightboxIndex }: LightboxProps) {
  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft" && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
      if (e.key === "ArrowRight" && lightboxIndex < photos.length - 1) setLightboxIndex(lightboxIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, photos.length, setLightboxIndex]);

  if (lightboxIndex === null || !photos[lightboxIndex]) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f0e0b]/95 flex items-center justify-center animate-fi">
      <button
        onClick={() => setLightboxIndex(null)}
        className="lightbox-close absolute top-5 right-5 text-[18px] font-mono z-[210] flex items-center justify-center w-10 h-10 rounded-full"
      >
        ×
      </button>

      <button
        onClick={() => setLightboxIndex(lightboxIndex - 1)}
        disabled={lightboxIndex === 0}
        className="lightbox-arrow absolute left-5 w-[44px] h-[44px] font-mono flex items-center justify-center disabled:opacity-20 z-[210] rounded-full"
      >
        ←
      </button>

      <img
        src={photos[lightboxIndex].url}
        alt=""
        className="max-w-[90vw] max-h-[88vh] object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)]"
      />

      <button
        onClick={() => setLightboxIndex(lightboxIndex + 1)}
        disabled={lightboxIndex === photos.length - 1}
        className="lightbox-arrow absolute right-5 w-[44px] h-[44px] font-mono flex items-center justify-center disabled:opacity-20 z-[210] rounded-full"
      >
        →
      </button>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 px-10 flex justify-between items-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#f0ebe2]/40">
          {photos[lightboxIndex].source}
        </span>
        <span className="font-mono text-[9px] text-[#f0ebe2]/30 tracking-[0.1em]">
          {(lightboxIndex + 1).toString().padStart(2, "0")} / {photos.length.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
