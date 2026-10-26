"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useMotion } from "@/lib/motion";

/**
 * Site-wide motion that lives in the layout. The navigation and season ribbon ease in once,
 * and scroll positions are re-measured after each navigation, because the layout (the footer
 * especially) outlives the pages that change its height.
 */
export function SiteMotion() {
  const pathname = usePathname();
  const ref = useRef<HTMLSpanElement>(null);

  useMotion(ref, () => {
    const nav = Array.from(document.querySelectorAll(".et-nav > *"));
    const ribbon = document.querySelector(".et-season-ribbon");

    gsap.fromTo(
      nav,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "transform" },
    );
    if (ribbon) {
      gsap.fromTo(
        ribbon,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.35, clearProps: "transform" },
      );
    }
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <span ref={ref} hidden />;
}
