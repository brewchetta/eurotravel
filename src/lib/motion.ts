import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/** Every animation lives inside this query, so visitors who ask for less motion see a still page. */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Inline styles a tween leaves behind. Clearing them hands control back to the stylesheet. */
export const CLEAR = "transform,opacity,visibility,transition";

/**
 * Runs `setup` once the component has mounted (and again when `deps` change), only when the
 * visitor allows motion. Tweens and ScrollTriggers created inside are reverted on cleanup.
 */
export function useMotion<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (root: T) => void,
  deps: unknown[] = [],
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => setup(root));
      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}

/** Fades and lifts elements in as they scroll into view, one batch (row) at a time. */
export function revealOnScroll(targets: Element[], { y = 40, start = "top 88%" } = {}) {
  if (targets.length === 0) return;
  // The stylesheet gives cards a transform transition; switch it off while GSAP drives them.
  gsap.set(targets, { autoAlpha: 0, y, transition: "none" });
  ScrollTrigger.batch(targets, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        overwrite: true,
        clearProps: CLEAR,
      }),
  });
}

/** Drifts a photo against the scroll, slowly, inside its frame. */
export function parallaxPhotos(root: HTMLElement, amount = 8) {
  root.querySelectorAll<HTMLElement>(".et-photo > img").forEach((img) => {
    // The photo is scaled up a touch so the drift never shows the frame behind it.
    gsap.fromTo(
      img,
      { scale: 1.2, yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}
