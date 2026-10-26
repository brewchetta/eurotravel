import Link from "next/link";
import { REGION_NAMES } from "@/lib/content";
import { SEASON_ICON, bestTimeLabel } from "@/lib/season";
import type { Destination } from "@/types/destination";
import { Photo, photoFlag } from "./Photo";

export function DestinationCard({ destination: d }: { destination: Destination }) {
  return (
    <article className="et-card" data-region={d.region} data-season={d.bestSeason}>
      <Photo
        destination={d}
        alt=""
        sizes="(min-width: 1280px) 400px, (min-width: 600px) 45vw, 100vw"
      >
        <span className="et-photo__flag">{photoFlag(d)}</span>
        <span className="et-photo__badge">
          <span className="et-i et-i--pin" aria-hidden="true" /> {REGION_NAMES[d.region]}
        </span>
      </Photo>
      <div className="et-card__body">
        <p className="et-eyebrow">{d.country}</p>
        <h3 className="et-card__title">
          <Link href={`/destinations/${d.slug}`}>{d.name}</Link>
        </h3>
        <p className="et-card__meta">{d.summary}</p>
        <div className="et-card__chips">
          <span className="et-chip et-chip--season">
            <span className={`et-i et-i--${SEASON_ICON[d.bestSeason]}`} aria-hidden="true" />{" "}
            {bestTimeLabel(d.bestStartMonth, d.bestEndMonth)}
          </span>
        </div>
        <div className="et-card__foot">
          <span />
          <span
            className="et-i et-i--arrow"
            aria-hidden="true"
            style={{ color: "var(--region-text)" }}
          />
        </div>
      </div>
    </article>
  );
}
