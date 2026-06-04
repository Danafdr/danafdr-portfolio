"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealManager() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
