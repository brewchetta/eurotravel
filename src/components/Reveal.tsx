"use client";

import { useRef, type ReactNode } from "react";
import { CLEAR, gsap, parallaxPhotos, revealOnScroll, useMotion } from "@/lib/motion";

interface RevealProps {
  className?: string;
  children: ReactNode;
  /**
   * `up` lifts each child in turn. `sides` slides the first child in from one edge and the
   * last from the other, for a copy-and-photo pair.
   */
  variant?: "up" | "sides";
  /** For `sides`: the photo sits on the left, so the pair slides in the other way round. */
  flip?: boolean;
  /** Drift the photos inside this block against the scroll. */
  parallax?: boolean;
}

/** A wrapper that animates its direct children into view as it is scrolled to. */
export function Reveal({ className, children, variant = "up", flip = false, parallax = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, (root) => {
    const items = Array.from(root.children);

    if (variant === "sides" && items.length > 1) {
      const dir = flip ? -1 : 1;
      const first = items[0];
      const last = items[items.length - 1];
      gsap.set(items, { autoAlpha: 0, transition: "none" });
      gsap.set(first, { x: -70 * dir });
      gsap.set(last, { x: 70 * dir });
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 75%", once: true } })
        .to(first, { autoAlpha: 1, x: 0, duration: 1, ease: "power3.out", clearProps: CLEAR })
        .to(last, { autoAlpha: 1, x: 0, duration: 1, ease: "power3.out", clearProps: CLEAR }, 0.15);
    } else {
      revealOnScroll(items);
    }

    if (parallax) parallaxPhotos(root);
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
