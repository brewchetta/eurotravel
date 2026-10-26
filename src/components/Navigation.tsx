import Link from "next/link";
import { Suspense } from "react";
import { logOut } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";
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
      <div className="et-nav__tools">
        {/* Reads the session cookie, so it streams in behind the static shell. */}
        <Suspense fallback={null}>
          <AccountLinks />
        </Suspense>
      </div>
    </header>
  );
}

async function AccountLinks() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Link className="et-btn et-btn--quiet pg-nolink" href="/login">
          Log in
        </Link>
        <Link className="et-btn pg-nolink" href="/signup">
          Sign up
        </Link>
      </>
    );
  }

  return (
    <>
      <span className="pg-nav-user">{user.email}</span>
      <form action={logOut}>
        <button className="et-btn et-btn--secondary" type="submit">
          Log out
        </button>
      </form>
    </>
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
