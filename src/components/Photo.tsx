import Image from "next/image";
import type { ReactNode } from "react";
import { unsplashImage } from "@/lib/unsplash";
import type { Destination } from "@/types/destination";

interface PhotoProps {
  destination: Destination;
  /** Extra frame modifiers, e.g. `et-photo--arch` or `et-photo--wide et-photo--hero`. */
  frame?: string;
  /** Pass "" when the text beside the photo already names the place. */
  alt?: string;
  sizes: string;
  /** Above-the-fold photo: load it straight away. */
  eager?: boolean;
  children?: ReactNode;
}

/** A design-system photo frame holding an Unsplash photo of a destination. */
export function Photo({
  destination,
  frame = "",
  alt,
  sizes,
  eager = false,
  children,
}: PhotoProps) {
  return (
    <div className={`et-photo ${frame}`.trim()}>
      <Image
        src={unsplashImage(destination.imageUrl)}
        alt={alt ?? destination.imageAlt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
      {children}
    </div>
  );
}

/** Credit text for use inside a photo flag, where links would sit under a stretched card link. */
export function photoFlag(destination: Destination): string {
  return `Photo: ${destination.photographer} / Unsplash`;
}
