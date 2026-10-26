import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pg-sec">
      <div className="et-container">
        <div className="et-stack" style={{ maxWidth: "var(--reading-max)" }}>
          <p className="et-eyebrow">Not found</p>
          <h1 className="et-display-lg">We could not find that place</h1>
          <p className="et-body-lg">
            The page may have moved, or the destination may not be on the site yet.
          </p>
          <div>
            <Link className="et-btn pg-nolink" href="/#destinations">
              See all destinations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
