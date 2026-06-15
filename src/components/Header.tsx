"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [availableForWork, setAvailableForWork] = useState(true);

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

  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(data => {
        if (data && data.available_for_work !== undefined) {
          setAvailableForWork(data.available_for_work);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className={`px-5 md:px-10 border-b border-border-rgba flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-5 sticky top-0 z-[100] bg-paper/96 backdrop-blur-[10px] transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <nav className="flex gap-2 sm:gap-4 md:gap-6 w-full justify-between md:w-auto md:justify-start order-2 md:order-1 border-t border-border-rgba md:border-none pt-2 md:pt-0 pb-2 md:pb-0">
        <Link href="/about" className="text-[8px] md:text-[9px] text-ink2 tracking-[0.12em] md:tracking-[0.18em] uppercase cursor-pointer no-underline py-2 md:py-5 transition-colors duration-200 block hover:text-ink">About</Link>
        <Link href="/skills" className="text-[8px] md:text-[9px] text-ink2 tracking-[0.12em] md:tracking-[0.18em] uppercase cursor-pointer no-underline py-2 md:py-5 transition-colors duration-200 block hover:text-ink">Skills</Link>
        <Link href="/work" className="text-[8px] md:text-[9px] text-ink2 tracking-[0.12em] md:tracking-[0.18em] uppercase cursor-pointer no-underline py-2 md:py-5 transition-colors duration-200 block hover:text-ink">Work</Link>
        
        {/* Contact moved into nav row for mobile only to save space */}
        <div className="flex md:hidden justify-end items-center gap-1.5 text-[8px] tracking-[0.1em] uppercase py-2">
          {availableForWork && <div className="w-[4px] h-[4px] rounded-full bg-accent shrink-0 animate-pd"></div>}
          <Link href="/contact" className="text-ink no-underline cursor-pointer transition-colors duration-200 hover:text-accent">Contact →</Link>
        </div>
      </nav>
      <div className="font-playfair text-[13px] font-black tracking-[0.1em] uppercase text-center leading-none py-3 md:py-4 order-1 md:order-2 w-full md:w-auto">
        <Link href="/" className="no-underline text-ink">danafdr</Link>
        <span className="hidden md:block text-[8px] font-normal italic text-ink2 tracking-[0.18em] normal-case mt-1">web dev × video editing × West Jakarta</span>
      </div>
      <div className="hidden md:flex justify-end items-center gap-[14px] text-[9px] tracking-[0.14em] uppercase order-3">
        {availableForWork && (
          <>
            <div className="w-[5px] h-[5px] rounded-full bg-accent shrink-0 animate-pd"></div>
            <span className="text-ink2">available</span>
          </>
        )}
        <Link href="/contact" className="text-ink no-underline cursor-pointer transition-colors duration-200 hover:text-accent">Contact →</Link>
      </div>
    </header>
  );
}
