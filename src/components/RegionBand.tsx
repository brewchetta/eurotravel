import Link from "next/link";
import { REGION_COPY, REGION_NAMES, REGION_PLACES } from "@/lib/content";
import type { Destination, Region } from "@/types/destination";
import { Photo, photoFlag } from "./Photo";
import { Reveal } from "./Reveal";

interface RegionBandProps {
  region: Region;
  destination: Destination;
  /** Bands alternate photo side and frame down the page. */
  flip: boolean;
}

export function RegionBand({ region, destination: d, flip }: RegionBandProps) {
  const copy = REGION_COPY[region];
  const id = `band-${region}`;
  return (
    <section className="et-band" data-region={region} aria-labelledby={id}>
      <Reveal
        className={`et-band__inner${flip ? " et-band__inner--flip" : ""}`}
        variant="sides"
        flip={flip}
        parallax
      >
        <div className="et-band__copy">
          <p className="et-eyebrow">
            {REGION_NAMES[region]} · {REGION_PLACES[region]}
          </p>
          <h2 className="et-display-lg" id={id}>
            {copy.headline}
          </h2>
          <p className="et-body-lg">{copy.lead}</p>
          <div className="et-band__cta">
            <Link className="et-btn et-btn--region pg-nolink" href={`/destinations/${d.slug}`}>
              Explore {d.name} <span className="et-i et-i--arrow" aria-hidden="true" />
            </Link>
            <Link className="et-btn et-btn--quiet" href={`/destinations/${d.slug}#best-time`}>
              Best time to go
            </Link>
          </div>
        </div>
        <Photo
          destination={d}
          frame={flip ? "et-photo--wide et-photo--hero" : "et-photo--arch pg-arch"}
          sizes="(min-width: 900px) 45vw, 100vw"
        >
          <span className="et-photo__flag">{photoFlag(d)}</span>
        </Photo>
      </Reveal>
    </section>
  );
}
