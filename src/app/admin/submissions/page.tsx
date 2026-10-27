import type { Metadata } from "next";
import { Suspense } from "react";
import { approveRecommendation, rejectRecommendation } from "@/app/admin/actions";
import { Photo } from "@/components/Photo";
import { requireAdmin } from "@/lib/auth";
import { REGION_NAMES } from "@/lib/content";
import { toDestination } from "@/lib/destinations";
import { MONTH_NAMES } from "@/lib/submission";
import { createClient } from "@/lib/supabase/server";
import { unsplashLink } from "@/lib/unsplash";
import type { DestinationRow } from "@/types/destination";

export const metadata: Metadata = {
  title: "Review recommendations",
  robots: { index: false, follow: false },
};

export default function SubmissionsPage() {
  return (
    <section className="pg-sec">
      <div className="et-container">
        <div className="et-stack">
          <p className="et-eyebrow">Admin</p>
          <h1 className="et-display-lg">Review recommendations</h1>
          <Suspense fallback={<p className="et-body-sm et-muted">Loading…</p>}>
            <PendingList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

type PendingRow = DestinationRow & { created_at: string };

async function PendingList() {
  await requireAdmin();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Could not load recommendations: ${error.message}`);

  const rows = (data ?? []) as PendingRow[];
  if (rows.length === 0) {
    return <p className="pg-empty">Nothing is waiting for review.</p>;
  }

  return (
    <>
      <p className="et-body-lg">
        {rows.length} {rows.length === 1 ? "recommendation is" : "recommendations are"} waiting.
        Check the photo, the location and the text before you approve.
      </p>
      <ul className="pg-review-list">
        {rows.map((row) => (
          <ReviewItem key={row.id} row={row} />
        ))}
      </ul>
    </>
  );
}

function ReviewItem({ row }: { row: PendingRow }) {
  const destination = toDestination(row);
  const submitted = new Date(row.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const mapUrl = `https://www.openstreetmap.org/?mlat=${row.lat}&mlon=${row.lng}#map=12/${row.lat}/${row.lng}`;

  return (
    <li className="pg-review" data-region={row.region}>
      <div className="pg-review__photo">
        <Photo destination={destination} frame="et-photo--wide" sizes="(min-width: 900px) 320px, 100vw" />
      </div>
      <div className="pg-review__body et-stack" style={{ gap: 12 }}>
        <div>
          <h2 className="et-display-md">{row.name}</h2>
          <p className="et-body-sm et-muted">
            {row.country} · {REGION_NAMES[row.region]} · submitted {submitted}
          </p>
        </div>
        <p className="et-body-lg">{row.summary}</p>
        <p className="pg-review__text">{row.description}</p>
        <dl className="pg-review__facts">
          <div>
            <dt>Best time</dt>
            <dd>
              {MONTH_NAMES[row.best_start_month]} to {MONTH_NAMES[row.best_end_month]} ({row.best_season})
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                {row.lat}, {row.lng} on a map
              </a>
            </dd>
          </div>
          <div>
            <dt>Photo credit</dt>
            <dd>
              <a href={unsplashLink(row.photographer_url)} target="_blank" rel="noopener noreferrer">
                {row.photographer}
              </a>
              , “{row.image_alt}”
            </dd>
          </div>
        </dl>
        <div className="pg-actions">
          <form action={approveRecommendation}>
            <input type="hidden" name="id" value={row.id} />
            <button className="et-btn" type="submit">
              Approve and publish
            </button>
          </form>
          <form action={rejectRecommendation}>
            <input type="hidden" name="id" value={row.id} />
            <button className="et-btn et-btn--secondary" type="submit">
              Reject
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
