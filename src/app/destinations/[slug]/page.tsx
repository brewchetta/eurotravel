import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DestinationCard } from "@/components/DestinationCard";
import { HeroMotion } from "@/components/HeroMotion";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { REGION_NAMES } from "@/lib/content";
import { getDestinationBySlug, getDestinations } from "@/lib/destinations";
import { MONTH_NAMES, SEASON_ICON, SEASON_NAMES } from "@/lib/season";
import { UNSPLASH_URL, unsplashImage, unsplashLink } from "@/lib/unsplash";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return { title: "Destination not found" };
  return {
    title: `${d.name}, ${d.country}`,
    description: d.summary,
    openGraph: {
      title: `${d.name}, ${d.country}`,
      description: d.summary,
      images: [{ url: unsplashImage(d.imageUrl, 1200), alt: d.imageAlt }],
    },
  };
}

export default function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  // The slug is only known at request time for pages that were not prerendered, so the
  // content waits for it inside Suspense and navigation stays instant.
  return (
    <Suspense
      fallback={
        <section className="pg-sec" aria-busy="true">
          <div className="et-container">
            <p className="et-body-lg et-muted">Loading this destination…</p>
          </div>
        </section>
      }
    >
      {params.then(({ slug }) => (
        <DestinationDetail slug={slug} />
      ))}
    </Suspense>
  );
}

async function DestinationDetail({ slug }: { slug: string }) {
  const [d, all] = await Promise.all([getDestinationBySlug(slug), getDestinations()]);
  if (!d) notFound();

  // Other places to consider: the same region first, then the same season.
  const more = all
    .filter((x) => x.id !== d.id)
    .sort(
      (a, b) =>
        Number(b.region === d.region) - Number(a.region === d.region) ||
        Number(b.bestSeason === d.bestSeason) - Number(a.bestSeason === d.bestSeason),
    )
    .slice(0, 3);

  const bestTime = `${MONTH_NAMES[d.bestStartMonth]} to ${MONTH_NAMES[d.bestEndMonth]}`;

  return (
    <>
      <section
        className="pg-hero"
        data-region={d.region}
        data-season={d.bestSeason}
        aria-labelledby="dest-h"
      >
        <div className="et-container">
          <Link className="et-btn et-btn--quiet pg-back" href="/#destinations">
            <span className="et-i et-i--arrow" aria-hidden="true" /> All destinations
          </Link>
          <HeroMotion className="pg-detail">
            <div className="pg-detail__copy">
              <p className="et-eyebrow">
                {REGION_NAMES[d.region]} · {d.country}
              </p>
              <h1 className="et-display-xl" id="dest-h">
                {d.name}
              </h1>
              <p className="et-body-lg">{d.summary}</p>
              <div className="pg-detail__chips">
                <span className="et-chip et-chip--season">
                  <span className={`et-i et-i--${SEASON_ICON[d.bestSeason]}`} aria-hidden="true" />{" "}
                  {SEASON_NAMES[d.bestSeason]}
                </span>
                <span className="et-chip et-chip--region">
                  <span className="et-i et-i--pin" aria-hidden="true" /> {REGION_NAMES[d.region]}
                </span>
              </div>
            </div>
            <figure className="et-figure">
              <Photo
                destination={d}
                frame="et-photo--hero"
                sizes="(min-width: 900px) 600px, 100vw"
                eager
              />
              <figcaption>
                <span>
                  Photo: <a href={unsplashLink(d.photographerUrl)}>{d.photographer}</a> /{" "}
                  <a href={UNSPLASH_URL}>Unsplash</a>
                </span>
              </figcaption>
            </figure>
          </HeroMotion>
        </div>
      </section>

      <section className="pg-sec" id="best-time" aria-labelledby="best-h">
        <Reveal className="et-container">
          <div className="pg-head">
            <div className="pg-head__copy">
              <p className="et-eyebrow" style={{ color: "var(--season-text)" }}>
                {d.name} · {d.country}
              </p>
              <h2 className="et-heading-lg" id="best-h">
                Best time to go
              </h2>
            </div>
          </div>
          <div className="et-stack" data-season={d.bestSeason} style={{ maxWidth: "var(--reading-max)" }}>
            <p className="et-body-lg">
              The best time to visit {d.name} is from {bestTime}.
            </p>
            <p>{d.description}</p>
          </div>
        </Reveal>
      </section>

      {more.length > 0 && (
        <section className="pg-sec pg-sec--quiet" aria-labelledby="more-h">
          <div className="et-container">
            <Reveal className="pg-head">
              <div className="pg-head__copy">
                <h2 className="et-heading-lg" id="more-h">
                  More places to see
                </h2>
              </div>
            </Reveal>
            <Reveal className="pg-grid3">
              {more.map((x) => (
                <DestinationCard key={x.id} destination={x} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
