import { cacheLife } from "next/cache";
import { seasonForMonth } from "@/lib/season";
import type { Season } from "@/types/destination";

/** The season shown across the site. Cached so the date read stays out of the prerender. */
export async function getCurrentSeason(): Promise<Season> {
  "use cache";
  cacheLife("hours");
  return seasonForMonth(new Date().getMonth());
}
