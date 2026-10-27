import { findCountry } from "@/lib/countries";
import { REGIONS, SEASONS, type Region, type Season } from "@/types/destination";

/** Validation for the recommendation form. It is shared by the server action and the form, so it must stay client-safe. */

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SUBMISSION_FIELDS = [
  "name",
  "country",
  "region",
  "bestSeason",
  "bestStartMonth",
  "bestEndMonth",
  "summary",
  "description",
  "lat",
  "lng",
  "imageUrl",
  "imageAlt",
  "photographer",
  "photographerUrl",
] as const;
export type SubmissionField = (typeof SUBMISSION_FIELDS)[number];
export type SubmissionValues = Partial<Record<SubmissionField, string>>;
export type SubmissionErrors = Partial<Record<SubmissionField, string>>;

/** The columns a submitter fills in. The server adds `slug`, `status`, `featured` and `submitted_by`. */
export interface SubmissionData {
  name: string;
  country: string;
  country_code: string;
  currency_code: string;
  region: Region;
  best_season: Season;
  best_start_month: number;
  best_end_month: number;
  summary: string;
  description: string;
  lat: number;
  lng: number;
  image_url: string;
  image_alt: string;
  photographer: string;
  photographer_url: string;
}

export const LIMITS = {
  name: { min: 2, max: 80 },
  summary: { min: 20, max: 200 },
  description: { min: 60, max: 1500 },
  imageAlt: { min: 5, max: 200 },
  photographer: { min: 2, max: 80 },
} as const;

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** `https` URL on one of the given hosts, reduced to origin and path so no query string or fragment is stored. */
function cleanUnsplashUrl(raw: string, hosts: string[]): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !hosts.includes(url.hostname) || url.pathname.length < 2) {
    return null;
  }
  return `${url.origin}${url.pathname}`;
}

function text(formData: FormData, field: SubmissionField): string {
  return String(formData.get(field) ?? "").trim();
}

function checkLength(value: string, label: string, { min, max }: { min: number; max: number }) {
  if (value.length < min) return `${label} needs at least ${min} characters.`;
  if (value.length > max) return `${label} can be at most ${max} characters.`;
  return null;
}

function parseNumber(value: string, min: number, max: number): number | null {
  if (value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export function parseSubmission(formData: FormData): {
  values: SubmissionValues;
  errors: SubmissionErrors;
  data?: SubmissionData;
} {
  const values: SubmissionValues = {};
  for (const field of SUBMISSION_FIELDS) values[field] = text(formData, field);
  const v = values as Record<SubmissionField, string>;

  const errors: SubmissionErrors = {};

  const nameError = checkLength(v.name, "The name", LIMITS.name);
  if (nameError) errors.name = nameError;
  else if (!slugify(v.name)) errors.name = "Use letters or numbers in the name.";

  const country = findCountry(v.country);
  if (!country) errors.country = "Choose a country from the list.";

  if (!(REGIONS as readonly string[]).includes(v.region)) errors.region = "Choose a region.";
  if (!(SEASONS as readonly string[]).includes(v.bestSeason)) errors.bestSeason = "Choose a season.";

  const startMonth = /^\d+$/.test(v.bestStartMonth) ? Number(v.bestStartMonth) : NaN;
  const endMonth = /^\d+$/.test(v.bestEndMonth) ? Number(v.bestEndMonth) : NaN;
  if (!(startMonth >= 0 && startMonth <= 11)) errors.bestStartMonth = "Choose a month.";
  if (!(endMonth >= 0 && endMonth <= 11)) errors.bestEndMonth = "Choose a month.";

  const summaryError = checkLength(v.summary, "The summary", LIMITS.summary);
  if (summaryError) errors.summary = summaryError;
  const descriptionError = checkLength(v.description, "The description", LIMITS.description);
  if (descriptionError) errors.description = descriptionError;

  const lat = parseNumber(v.lat, -90, 90);
  if (lat === null) errors.lat = "Enter a latitude between -90 and 90, for example 40.6281.";
  const lng = parseNumber(v.lng, -180, 180);
  if (lng === null) errors.lng = "Enter a longitude between -180 and 180, for example 14.485.";

  const imageUrl = cleanUnsplashUrl(v.imageUrl, ["images.unsplash.com"]);
  if (!imageUrl) {
    errors.imageUrl = "Use an image address that starts with https://images.unsplash.com/.";
  }
  const altError = checkLength(v.imageAlt, "The description of the photo", LIMITS.imageAlt);
  if (altError) errors.imageAlt = altError;
  const photographerError = checkLength(v.photographer, "The photographer's name", LIMITS.photographer);
  if (photographerError) errors.photographer = photographerError;
  const photographerUrl = cleanUnsplashUrl(v.photographerUrl, ["unsplash.com", "www.unsplash.com"]);
  if (!photographerUrl) {
    errors.photographerUrl = "Use the photographer's profile link, which starts with https://unsplash.com/.";
  }

  if (Object.keys(errors).length > 0 || !country || lat === null || lng === null || !imageUrl || !photographerUrl) {
    return { values, errors };
  }

  return {
    values,
    errors,
    data: {
      name: v.name,
      country: country.name,
      country_code: country.code,
      currency_code: country.currency,
      region: v.region as Region,
      best_season: v.bestSeason as Season,
      best_start_month: startMonth,
      best_end_month: endMonth,
      summary: v.summary,
      description: v.description,
      lat,
      lng,
      image_url: imageUrl,
      image_alt: v.imageAlt,
      photographer: v.photographer,
      photographer_url: photographerUrl,
    },
  };
}
