import { UNSPLASH_URL } from "@/lib/unsplash";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="pg-foot">
      <Reveal className="et-container">
        <div className="pg-foot__row">
          <div className="et-stack" style={{ gap: 8, maxWidth: 360 }}>
            <span className="et-wordmark">Euro Travel</span>
            <p className="et-body-sm et-muted">Slow journeys through Europe, in every season.</p>
          </div>
        </div>
        <p className="et-caption" style={{ marginTop: 24 }}>
          © 2026 Euro Travel · Photographs from <a href={UNSPLASH_URL}>Unsplash</a>, credited on
          each image.
        </p>
      </Reveal>
    </footer>
  );
}
