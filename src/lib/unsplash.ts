const UTM = "utm_source=euro_travel&utm_medium=referral";

/** Sized, compressed rendition of an Unsplash photo. Next/Image then resizes it for each device. */
export function unsplashImage(baseUrl: string, width = 1600): string {
  const url = new URL(baseUrl);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", "80");
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

/** Links back to Unsplash must carry the app name as the referral source. */
export function unsplashLink(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}${UTM}`;
}

export const UNSPLASH_URL = unsplashLink("https://unsplash.com/");
