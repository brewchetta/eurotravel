export const REGIONS = [
  "riviera",
  "alpine",
  "nordic",
  "atlantic",
  "campagna",
  "capitals",
] as const;
export type Region = (typeof REGIONS)[number];

export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = (typeof SEASONS)[number];

export type DestinationStatus = "approved" | "pending" | "rejected";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region: Region;
  bestSeason: Season;
  /** Zero-based month (0 = January) that the best time to go starts in. */
  bestStartMonth: number;
  /** Zero-based month (0 = January) that the best time to go ends in. */
  bestEndMonth: number;
  summary: string;
  description: string;
  lat: number;
  lng: number;
  /** ISO 4217 code, for the exchange-rate feature. */
  currencyCode: string;
  imageUrl: string;
  imageAlt: string;
  photographer: string;
  photographerUrl: string;
  featured: boolean;
}

/** Row shape of the `destinations` table. */
export interface DestinationRow {
  id: string;
  slug: string;
  name: string;
  country: string;
  country_code: string;
  region: Region;
  best_season: Season;
  best_start_month: number;
  best_end_month: number;
  summary: string;
  description: string;
  lat: number;
  lng: number;
  currency_code: string;
  image_url: string;
  image_alt: string;
  photographer: string;
  photographer_url: string;
  featured: boolean;
  status: DestinationStatus;
}
