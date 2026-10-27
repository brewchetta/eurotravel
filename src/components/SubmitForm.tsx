"use client";

import { useActionState, useState, type ReactNode } from "react";
import { submitRecommendation, type SubmitState } from "@/app/submit/actions";
import { COUNTRIES } from "@/lib/countries";
import { REGION_NAMES } from "@/lib/content";
import { LIMITS, MONTH_NAMES, type SubmissionField } from "@/lib/submission";
import { REGIONS, SEASONS } from "@/types/destination";

const SEASON_LABELS = { spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter" };

/** Remounting the form is how "Recommend another place" clears it. */
export function SubmitForm() {
  const [round, setRound] = useState(0);
  return <Form key={round} onAnother={() => setRound((r) => r + 1)} />;
}

/** Label, input slot, hint and error. Defined at module level so inputs keep their state across renders. */
function Field({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: SubmissionField;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="et-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && (
        <p className="et-hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="et-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function Form({ onAnother }: { onAnother: () => void }) {
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    submitRecommendation,
    {},
  );

  if (state.done) {
    return (
      <div className="et-notice et-notice--success pg-auth__notice" role="status">
        <div className="et-stack" style={{ gap: 12 }}>
          <div>
            <p className="et-notice__title">Thank you for your recommendation</p>
            <p className="et-notice__text">
              An admin will check it before it appears on the site. You can follow its status
              below.
            </p>
          </div>
          <div>
            <button className="et-btn et-btn--secondary" type="button" onClick={onAnother}>
              Recommend another place
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  /** Props shared by every input: restored value, and the error wiring. */
  const field = (name: SubmissionField) => ({
    id: name,
    name,
    defaultValue: values[name],
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": [errors[name] ? `${name}-error` : null, `${name}-hint`]
      .filter(Boolean)
      .join(" "),
  });

  const monthOptions = (
    <>
      <option value="">Choose</option>
      {MONTH_NAMES.map((m, i) => (
        <option key={m} value={i}>
          {m}
        </option>
      ))}
    </>
  );

  return (
    <form action={formAction} className="et-stack pg-form" noValidate>
      {state.error && (
        <div className="et-notice et-notice--danger pg-auth__notice" role="alert">
          <p className="et-notice__text">{state.error}</p>
        </div>
      )}

      <fieldset className="pg-fieldset pg-form__group">
        <legend className="et-label">The place</legend>
        <Field error={errors.name} name="name" label="Name of the place">
          <input className="et-input" type="text" maxLength={LIMITS.name.max} required {...field("name")} />
        </Field>
        <div className="pg-form__row">
          <Field error={errors.country} name="country" label="Country">
            <div className="et-select-wrap">
              <select className="et-select" required {...field("country")}>
                <option value="">Choose a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </Field>
          <Field error={errors.region} name="region" label="Region">
            <div className="et-select-wrap">
              <select className="et-select" required {...field("region")}>
                <option value="">Choose a region</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {REGION_NAMES[r]}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>
        <Field
          error={errors.summary} name="summary"
          label="Summary"
          hint={`One or two sentences for the card, ${LIMITS.summary.min} to ${LIMITS.summary.max} characters.`}
        >
          <input className="et-input" type="text" maxLength={LIMITS.summary.max} required {...field("summary")} />
        </Field>
        <Field
          error={errors.description} name="description"
          label="Why you recommend it"
          hint="What to see, eat and do, and what makes it worth the trip."
        >
          <textarea
            className="et-input pg-textarea"
            rows={6}
            maxLength={LIMITS.description.max}
            required
            {...field("description")}
          />
        </Field>
      </fieldset>

      <fieldset className="pg-fieldset pg-form__group">
        <legend className="et-label">When to go</legend>
        <div className="pg-form__row pg-form__row--3">
          <Field error={errors.bestSeason} name="bestSeason" label="Best season">
            <div className="et-select-wrap">
              <select className="et-select" required {...field("bestSeason")}>
                <option value="">Choose</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {SEASON_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </Field>
          <Field error={errors.bestStartMonth} name="bestStartMonth" label="From">
            <div className="et-select-wrap">
              <select className="et-select" required {...field("bestStartMonth")}>
                {monthOptions}
              </select>
            </div>
          </Field>
          <Field error={errors.bestEndMonth} name="bestEndMonth" label="To">
            <div className="et-select-wrap">
              <select className="et-select" required {...field("bestEndMonth")}>
                {monthOptions}
              </select>
            </div>
          </Field>
        </div>
      </fieldset>

      <fieldset className="pg-fieldset pg-form__group">
        <legend className="et-label">Location</legend>
        <div className="pg-form__row">
          <Field
            error={errors.lat} name="lat"
            label="Latitude"
            hint="In Google Maps, right-click the place and copy the first number."
          >
            <input className="et-input" type="text" inputMode="decimal" required {...field("lat")} />
          </Field>
          <Field error={errors.lng} name="lng" label="Longitude" hint="The second number from the same place.">
            <input className="et-input" type="text" inputMode="decimal" required {...field("lng")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="pg-fieldset pg-form__group">
        <legend className="et-label">Photo from Unsplash</legend>
        <Field
          error={errors.imageUrl} name="imageUrl"
          label="Image address"
          hint="On the photo's Unsplash page, right-click the photo and copy the image address. It starts with https://images.unsplash.com/."
        >
          <input className="et-input" type="url" required {...field("imageUrl")} />
        </Field>
        <Field error={errors.imageAlt} name="imageAlt" label="Describe the photo" hint="For people who cannot see it, for example â€œPastel houses stacked above a harbour.â€">
          <input className="et-input" type="text" maxLength={LIMITS.imageAlt.max} required {...field("imageAlt")} />
        </Field>
        <div className="pg-form__row">
          <Field error={errors.photographer} name="photographer" label="Photographer">
            <input className="et-input" type="text" maxLength={LIMITS.photographer.max} required {...field("photographer")} />
          </Field>
          <Field error={errors.photographerUrl} name="photographerUrl" label="Photographer's profile link" hint="Starts with https://unsplash.com/@.">
            <input className="et-input" type="url" required {...field("photographerUrl")} />
          </Field>
        </div>
      </fieldset>

      <div>
        <button className="et-btn et-btn--lg" type="submit" disabled={pending} aria-disabled={pending}>
          {pending ? "Sendingâ€¦" : "Send for review"}
        </button>
      </div>
    </form>
  );
}
