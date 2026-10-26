import Link from "next/link";
import { getCurrentSeason } from "@/lib/current-season";
import { SEASON_COPY } from "@/lib/content";
import { SEASON_ICON } from "@/lib/season";

export function Navigation() {
  return (
    <header className="et-nav">
      <Link className="et-wordmark pg-nolink" href="/" aria-label="Euro Travel">
        Euro Travel
      </Link>
      <nav className="et-nav__links" aria-label="Main">
        <Link href="/#destinations">Destinations</Link>
        <Link href="/#regions">Regions</Link>
        <Link href="/#gallery">Gallery</Link>
      </nav>
    </header>
  );
}

/** One sentence on what is happening now. Replace it, never stack two. */
export async function SeasonRibbon() {
  const season = await getCurrentSeason();
  return (
    <div className="et-season-ribbon" role="note">
      <span className={`et-i et-i--lg et-i--${SEASON_ICON[season]}`} aria-hidden="true" />
      <span>{SEASON_COPY[season].ribbon}</span>
    </div>
  );
}
