"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and past 80px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`px-10 border-b border-border-rgba grid grid-cols-[1fr_auto_1fr] items-center gap-5 sticky top-0 z-[100] bg-paper/96 backdrop-blur-[10px] transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <nav className="flex gap-6">
        <Link href="/about" className="text-[9px] text-ink2 tracking-[0.18em] uppercase cursor-pointer no-underline py-5 transition-colors duration-200 block hover:text-ink">About</Link>
        <Link href="/#skills" className="text-[9px] text-ink2 tracking-[0.18em] uppercase cursor-pointer no-underline py-5 transition-colors duration-200 block hover:text-ink">Skills</Link>
        <Link href="/work" className="text-[9px] text-ink2 tracking-[0.18em] uppercase cursor-pointer no-underline py-5 transition-colors duration-200 block hover:text-ink">Work</Link>
      </nav>
      <div className="font-playfair text-[13px] font-black tracking-[0.1em] uppercase text-center leading-none py-4">
        <Link href="/" className="no-underline text-ink">danafdr</Link>
        <span className="block text-[8px] font-normal italic text-ink2 tracking-[0.18em] normal-case mt-1">web dev × video editing × West Jakarta</span>
      </div>
      <div className="flex justify-end items-center gap-[14px] text-[9px] tracking-[0.14em] uppercase">
        <div className="w-[5px] h-[5px] rounded-full bg-accent shrink-0 animate-pd"></div>
        <span className="text-ink2">available</span>
        <Link href="/contact" className="text-ink no-underline cursor-pointer transition-colors duration-200 hover:text-accent">Contact →</Link>
      </div>
    </header>
  );
}
