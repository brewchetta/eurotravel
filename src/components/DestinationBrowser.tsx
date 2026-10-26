"use client";

import { useState } from "react";
import { SEASON_ICON, SEASON_NAMES, seasonRange } from "@/lib/season";
import { SEASONS, type Destination, type Season } from "@/types/destination";
import { DestinationCard } from "./DestinationCard";

interface DestinationBrowserProps {
  destinations: Destination[];
  initialSeason: Season;
}

/** "Where to go now": a season switcher over a grid of destination cards. */
export function DestinationBrowser({
  destinations,
  initialSeason,
}: DestinationBrowserProps) {
  const [season, setSeason] = useState<Season>(initialSeason);
  const shown = destinations.filter((d) => d.bestSeason === season);

  return (
    <div data-season={season}>
      <div className="pg-head">
        <div className="pg-head__copy">
          <p className="et-eyebrow" style={{ color: "var(--season-text)" }}>
            {SEASON_NAMES[season]} · {seasonRange(season)}
          </p>
          <h2 className="et-heading-lg" id="now-h">
            Where to go now
          </h2>
        </div>
        <fieldset className="pg-fieldset">
          <legend className="et-sr">Travel season</legend>
          <div className="et-segmented" role="radiogroup" aria-label="Travel season">
            {SEASONS.map((id) => (
              <label key={id} className="et-segmented__opt" data-season={id}>
                <input
                  type="radio"
                  name="season"
                  value={id}
                  checked={id === season}
                  onChange={() => setSeason(id)}
                />
                <span>
                  <span className={`et-i et-i--${SEASON_ICON[id]}`} aria-hidden="true" />{" "}
                  {SEASON_NAMES[id]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      {shown.length > 0 ? (
        <div className="pg-grid3">
          {shown.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      ) : (
        <p className="pg-empty">
          We have no places picked for {SEASON_NAMES[season].toLowerCase()} yet. Try another
          season.
        </p>
      )}
    </div>
  );
}
