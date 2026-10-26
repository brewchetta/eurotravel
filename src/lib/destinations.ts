import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Destination, DestinationRow } from "@/types/destination";

function toDestination(row: DestinationRow): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    country: row.country,
    countryCode: row.country_code,
    region: row.region,
    bestSeason: row.best_season,
    bestStartMonth: row.best_start_month,
    bestEndMonth: row.best_end_month,
    summary: row.summary,
    description: row.description,
    lat: row.lat,
    lng: row.lng,
    currencyCode: row.currency_code,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    photographer: row.photographer,
    photographerUrl: row.photographer_url,
    featured: row.featured,
  };
}

/** All approved destinations. Row level security already hides pending and rejected ones. */
export async function getDestinations(): Promise<Destination[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("destinations");

  const { data, error } = await createPublicClient()
    .from("destinations")
    .select("*")
    .eq("status", "approved")
    .order("name");
  if (error) throw new Error(`Could not load destinations: ${error.message}`);
  return (data as DestinationRow[]).map(toDestination);
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("destinations", `destination:${slug}`);

  const { data, error } = await createPublicClient()
    .from("destinations")
    .select("*")
    .eq("status", "approved")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Could not load destination: ${error.message}`);
  return data ? toDestination(data as DestinationRow) : null;
}
