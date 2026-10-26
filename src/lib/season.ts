import type { Season } from "@/types/destination";

export const SEASON_NAMES: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

/** Season glyphs are fixed by the design system. */
export const SEASON_ICON: Record<Season, string> = {
  spring: "sprout",
  summer: "sun",
  autumn: "leaf",
  winter: "snowflake",
};

/** First and last zero-based month of each season. */
export const SEASON_MONTHS: Record<Season, [number, number]> = {
  spring: [2, 4],
  summer: [5, 7],
  autumn: [8, 10],
  winter: [11, 1],
};

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
];

export function seasonForMonth(month: number): Season {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function seasonRange(season: Season): string {
  const [from, to] = SEASON_MONTHS[season];
  return `${MONTH_NAMES[from]} to ${MONTH_NAMES[to]}`;
}

export function bestTimeLabel(startMonth: number, endMonth: number): string {
  return `Best: ${MONTH_NAMES[startMonth]} to ${MONTH_NAMES[endMonth]}`;
}
