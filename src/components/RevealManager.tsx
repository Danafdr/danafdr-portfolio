"use client";

import { useEffect } from "react";

export default function RevealManager() {
  useEffect(() => {
    let ScrollTriggerInstance: any = null;

    const initGsap = async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      
      const gsap = gsapModule.default || gsapModule.gsap;
      const ScrollTrigger = ScrollTriggerModule.default || ScrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);
      ScrollTriggerInstance = ScrollTrigger;

      const revealElements = document.querySelectorAll(".reveal");

      revealElements.forEach((el) => {
        // Find potential staggers within the section
        const children = el.querySelectorAll(".reveal-child");
        
        if (children.length > 0) {
          // Prepare children for animation
          gsap.set(children, { y: 18, opacity: 0 });
          
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            onEnter: () => {
              gsap.to(children, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08, // 80ms stagger as per spec
                ease: "power3.out", // Smooth, breath-like ease
              });
              // Also reveal the parent container if it has styles
              el.classList.add("in");
            },
            once: true
          });
        } else {
          // Standard single element reveal
          ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            onEnter: () => el.classList.add("in"),
            once: true
          });
        }
      });
    };

    initGsap();

    return () => {
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach((t: any) => t.kill());
      }
    };
  }, []);

  return null;
}
