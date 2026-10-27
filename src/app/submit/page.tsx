import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SubmitForm } from "@/components/SubmitForm";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { DestinationStatus } from "@/types/destination";

export const metadata: Metadata = { title: "Recommend a place" };

export default function SubmitPage() {
  return (
    <section className="pg-sec">
      <div className="et-container">
        <div className="et-stack pg-submit">
          <p className="et-eyebrow">Share a favorite</p>
          <h1 className="et-display-lg">Recommend a place</h1>
          <p className="et-body-lg">
            Tell us about somewhere in Europe worth the journey. An admin checks every
            recommendation before it appears on the site.
          </p>
          <Suspense fallback={<p className="et-body-sm et-muted">Loading…</p>}>
            <SubmitContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function SubmitContent() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="et-notice pg-auth__notice">
        <div className="et-stack" style={{ gap: 12 }}>
          <div>
            <p className="et-notice__title">Log in to recommend a place</p>
            <p className="et-notice__text">
              You need an account so we can tell you when your recommendation has been reviewed.
            </p>
          </div>
          <div className="pg-actions">
            <Link className="et-btn pg-nolink" href="/login">
              Log in
            </Link>
            <Link className="et-btn et-btn--secondary pg-nolink" href="/signup">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubmitForm />
      <MySubmissions userId={user.id} />
    </>
  );
}

const STATUS_TEXT: Record<DestinationStatus, string> = {
  pending: "Waiting for review",
  approved: "Published",
  rejected: "Not published",
};

async function MySubmissions({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("destinations")
    .select("id, slug, name, country, status, created_at")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!data?.length) return null;

  return (
    <section className="et-stack" aria-labelledby="mine-heading">
      <h2 className="et-display-md" id="mine-heading">
        Your recommendations
      </h2>
      <ul className="pg-mine">
        {data.map((row) => (
          <li key={row.id}>
            <span>
              {row.status === "approved" ? (
                <Link href={`/destinations/${row.slug}`}>{row.name}</Link>
              ) : (
                row.name
              )}
              <span className="et-muted">, {row.country}</span>
            </span>
            <span className="et-body-sm">{STATUS_TEXT[row.status as DestinationStatus]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
