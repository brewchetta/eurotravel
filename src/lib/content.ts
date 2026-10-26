import type { Region, Season } from "@/types/destination";

/** Region and season copy from the front-page prototype (English). */
export const REGION_NAMES: Record<Region, string> = {
  riviera: "Riviera",
  alpine: "Alpine",
  nordic: "Nordic",
  atlantic: "Atlantic",
  campagna: "Campagna",
  capitals: "Old Capitals",
};

export const REGION_PLACES: Record<Region, string> = {
  riviera: "Amalfi · Côte d’Azur · Aegean",
  alpine: "Zermatt · Tyrol · Dolomites",
  nordic: "Lofoten · Iceland · Lapland",
  atlantic: "Algarve · Basque Coast · Ireland",
  campagna: "Tuscany · Provence · Douro",
  capitals: "Vienna · Prague · Paris",
};

export const REGION_COPY: Record<Region, { headline: string; lead: string }> = {
  riviera: {
    headline: "Salt, lemon and the long lunch",
    lead: "Cliff villas, small harbours and a table that is yours until the light turns gold.",
  },
  alpine: {
    headline: "Mornings that begin above the clouds",
    lead: "Stone chalets, cable cars at first light and a fire lit when you come back down.",
  },
  nordic: {
    headline: "Light that takes its time",
    lead: "Fjord-side cabins, midnight sun in summer and aurora from September.",
  },
  atlantic: {
    headline: "Tiles, tides and a table by the water",
    lead: "Surf towns, seafood counters and rooms that open onto the ocean.",
  },
  campagna: {
    headline: "Slow roads between olive and vine",
    lead: "Farmhouse estates, harvest tables and hills that turn copper in October.",
  },
  capitals: {
    headline: "Grand cafés and quiet courtyards",
    lead: "Opera nights, river walks at dusk and suites with a view of the roofline.",
  },
};

export const SEASON_COPY: Record<
  Season,
  { ribbon: string; title: string; lead: string; heroSlug: string }
> = {
  spring: {
    ribbon: "Spring on the Atlantic. Almond blossom and open terraces from March to May.",
    title: "Blossom on the coast",
    lead: "Quiet lanes, open-air lunches and flexible bookings before the summer crowds.",
    heroSlug: "keukenhof",
  },
  summer: {
    ribbon: "Summer on the Riviera. Long evenings by the water from June to August.",
    title: "Salt, lemon and the long lunch",
    lead: "Warm sea, late dinners and boats that leave when you decide. Reserve early for August.",
    heroSlug: "positano",
  },
  autumn: {
    ribbon: "Autumn in Tuscany. Harvest tours and truffle weeks run from 15 September to 15 November.",
    title: "The harvest, slowly",
    lead: "Vineyards turn copper, truffle markets open and cities settle back into themselves.",
    heroSlug: "tuscany",
  },
  winter: {
    ribbon: "Winter in the Alps. Fires lit and the lifts open from mid December to March.",
    title: "Mornings above the clouds",
    lead: "Stone chalets, first-light cable cars and a spa day when the days are short.",
    heroSlug: "zermatt",
  },
};
