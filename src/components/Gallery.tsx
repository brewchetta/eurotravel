import { SEASON_ICON, SEASON_NAMES } from "@/lib/season";
import { UNSPLASH_URL, unsplashLink } from "@/lib/unsplash";
import type { Destination } from "@/types/destination";
import { Photo } from "./Photo";

/** One photograph per season, with linked credits. */
export function Gallery({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="pg-sec" id="gallery" aria-labelledby="gal-h">
      <div className="et-container">
        <div className="pg-head">
          <div className="pg-head__copy">
            <h2 className="et-heading-lg" id="gal-h">
              Places to remember
            </h2>
          </div>
        </div>
        <div className="pg-seasons">
          {destinations.map((d) => (
            <figure key={d.id} className="et-figure" data-season={d.bestSeason}>
              <Photo
                destination={d}
                frame="et-photo--portrait"
                sizes="(min-width: 1280px) 300px, (min-width: 600px) 45vw, 100vw"
              />
              <figcaption>
                <span className="et-chip et-chip--season">
                  <span className={`et-i et-i--${SEASON_ICON[d.bestSeason]}`} aria-hidden="true" />{" "}
                  {SEASON_NAMES[d.bestSeason]}
                </span>
                <span>
                  {d.name}, {d.country}
                </span>
                <span>
                  Photo: <a href={unsplashLink(d.photographerUrl)}>{d.photographer}</a> /{" "}
                  <a href={UNSPLASH_URL}>Unsplash</a>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
