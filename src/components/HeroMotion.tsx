"use client";

import { useRef, type ReactNode } from "react";
import { CLEAR, gsap, parallaxPhotos, SplitText, useMotion } from "@/lib/motion";

/**
 * The grid inside a hero: its first child holds the copy, its last child the photo.
 * The headline rises word by word, the rest of the copy follows, the photo settles in
 * and then drifts as the page scrolls. `site.css` hides these until the animation runs.
 */
export function HeroMotion({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, (root) => {
    const copy = root.firstElementChild;
    const media = root.lastElementChild;
    if (!copy || !media || copy === media) return;

    const heading = copy.querySelector("h1");
    const rest = Array.from(copy.children).filter((el) => el !== heading);

    if (heading) {
      // Re-splits if the fonts load late or the width changes, so the lines stay right.
      SplitText.create(heading, {
        type: "words",
        mask: "words",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(heading, { autoAlpha: 1 });
          return gsap.from(self.words, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.07,
            delay: 0.15,
          });
        },
      });
    }

    gsap.fromTo(
      rest,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.45, clearProps: CLEAR },
    );

    gsap.fromTo(
      media,
      { autoAlpha: 0, y: 60, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: "power3.out", delay: 0.3, clearProps: CLEAR },
    );

    parallaxPhotos(root, 6);
  });

  return (
    <div ref={ref} className={`${className} mo-hero`}>
      {children}
    </div>
  );
}
