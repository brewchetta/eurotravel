import { DestinationBrowser } from "@/components/DestinationBrowser";
import { Gallery } from "@/components/Gallery";
import { HeroMotion } from "@/components/HeroMotion";
import { Photo, photoFlag } from "@/components/Photo";
import { RegionBand } from "@/components/RegionBand";
import { SEASON_COPY } from "@/lib/content";
import { getCurrentSeason } from "@/lib/current-season";
import { getDestinations } from "@/lib/destinations";
import { SEASON_NAMES, seasonRange } from "@/lib/season";
import { SEASONS, type Region } from "@/types/destination";

const BAND_REGIONS: Region[] = ["riviera", "alpine", "atlantic", "campagna"];

export default async function Home() {
  const [destinations, season] = await Promise.all([getDestinations(), getCurrentSeason()]);
  const copy = SEASON_COPY[season];

  if (destinations.length === 0) {
    return (
      <section className="pg-sec">
        <div className="et-container">
          <h1 className="et-display-lg">Destinations are on their way</h1>
          <p className="et-body-lg" style={{ marginTop: 16 }}>
            No approved destinations were found. Run <code>supabase/seed.sql</code> in your
            Supabase project, then reload.
          </p>
        </div>
      </section>
    );
  }

  const hero =
    destinations.find((d) => d.slug === copy.heroSlug) ??
    destinations.find((d) => d.bestSeason === season) ??
    destinations[0];

  // Hero takes the season's region, so the bands show the others: three of the four
  // main regions, with the Nordic and Old Capitals bands woven in between.
  const rest = BAND_REGIONS.filter((r) => r !== hero.region);
  const bandOrder: Region[] = [rest[0], "nordic", rest[1], "capitals", rest[2]];
  const bands = bandOrder.flatMap((region, i) => {
    const inRegion = destinations.filter((d) => d.region === region);
    return inRegion.length > 0 ? [{ region, destination: inRegion[i % inRegion.length], i }] : [];
  });

  // One photograph per season for the gallery.
  const strip = SEASONS.flatMap((s) => {
    const d = destinations.find((x) => x.bestSeason === s && x.id !== hero.id);
    return d ? [d] : [];
  });

  return (
    <>
      <section className="pg-hero" data-region={hero.region} aria-labelledby="hero-h">
        <div className="et-container">
          <HeroMotion className="pg-hero__grid">
            <div className="pg-hero__copy">
              <p className="et-eyebrow">
                {SEASON_NAMES[season]} · {seasonRange(season)}
              </p>
              <h1 className="et-display-xl" id="hero-h">
                {copy.title}
              </h1>
              <p className="et-body-lg">{copy.lead}</p>
            </div>
            <Photo
              destination={hero}
              frame="et-photo--arch pg-hero__photo"
              sizes="(min-width: 900px) 360px, 100vw"
              eager
            >
              <span className="et-photo__flag">{photoFlag(hero)}</span>
            </Photo>
          </HeroMotion>
        </div>
      </section>

      <section className="pg-sec" id="destinations" aria-labelledby="now-h">
        <div className="et-container">
          <DestinationBrowser destinations={destinations} initialSeason={season} />
        </div>
      </section>

      <div id="regions">
        {bands.map(({ region, destination, i }) => (
          <RegionBand key={region} region={region} destination={destination} flip={i % 2 === 1} />
        ))}
      </div>

      <Gallery destinations={strip} />
    </>
  );
}
