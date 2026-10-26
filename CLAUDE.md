# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment files: do not touch

Never read, open, print, edit, create, copy or search `.env`, `.env.local` or any other `.env*` file, and never run commands that would expose their contents (`cat`, `type`, `Get-Content`, `printenv`, `env`, `dotenv`, and similar). The only exception is `.env.example`, which holds placeholder values and may be read and edited. If a task needs an environment value, ask the user to set it themselves.

## Project

Euro Travel: a European travel site built with Next.js (App Router), Supabase and styled with the Euro Travel design system, deployed on Vercel. Phase 1 is a showcase of destinations (home page and a page per destination, with Unsplash photos). Planned later: sign-up, favorites, user-suggested spots with admin approval, currency rates, weather, maps (Leaflet or Google), Yelp restaurants and the onvaou routing API.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build; also type-checks and prerenders every destination
npm run lint     # eslint
npx tsc --noEmit # type-check only
npx next typegen # regenerate route types (PageProps / LayoutProps) after adding routes
```

There is no test suite yet. `npm run build` needs Supabase credentials in `.env.local`, because it reads destinations while prerendering.

## Next.js version

This is Next.js 16 with React 19 and **Cache Components enabled** (`cacheComponents` and `partialPrefetching` in `next.config.ts`). It differs from older Next.js, and `AGENTS.md` says to read the bundled docs in `node_modules/next/dist/docs/` before writing code. Rules that already shaped this codebase:

- Data reads and anything time-dependent go inside `"use cache"` functions with an explicit `cacheLife(...)` (see `src/lib/destinations.ts`, `src/lib/current-season.ts`). Uncached or request-time data outside `Suspense` fails the build.
- Cached functions cannot read `cookies()` or `headers()`. That is why the Supabase read client is cookie-free.
- A `"use cache"` module must only export async functions, and client components must not import one. Keep client-safe helpers (`src/lib/season.ts`) apart from cached getters (`src/lib/current-season.ts`).
- Dynamic route params are awaited inside `<Suspense>` (see `src/app/destinations/[slug]/page.tsx`) so client navigation stays instant. `generateStaticParams` must return at least one param.
- `Image` no longer uses `priority`. Use `loading="eager"` with `fetchPriority="high"` (the `eager` prop on `Photo`).

## Architecture

**Data flow.** The Supabase `destinations` table (schema in `supabase/migrations/0001_destinations.sql`, sample rows in `supabase/seed.sql`) is read by `src/lib/destinations.ts` through `createPublicClient()` in `src/lib/supabase/public.ts`. Rows are mapped from snake_case (`DestinationRow`) to camelCase (`Destination`) in `src/types/destination.ts`. Row level security exposes only `status = 'approved'` rows to the anon key, and the queries filter on it too. Cached reads are tagged `destinations` (and `destination:<slug>`) for future on-demand revalidation, and otherwise refresh hourly. The `status` and `submitted_by` columns are in place for the planned suggest-and-approve flow, and `lat`, `lng` and `currency_code` for the weather, map and currency features.

**Pages.**
- `src/app/layout.tsx` sets the fonts, `data-theme="light"` and `data-season` on `<body class="et">`, and renders the navigation, season ribbon and footer.
- `src/app/page.tsx` builds the home page: a hero for the current season, then `DestinationBrowser`, then region bands, then the gallery.
- `src/app/destinations/[slug]/page.tsx` is the detail page.

**Season and region logic.** The current season comes from the date (`getCurrentSeason`) and drives the layout's `data-season`, the ribbon, the hero and the default season filter. Regions (`riviera`, `alpine`, `nordic`, `atlantic`, `campagna`, `capitals`) tint each band and card through `data-region`. Copy for seasons and regions lives in `src/lib/content.ts`. Month ranges are zero-based (0 = January), and a range can wrap the year (December to February).

**Design system.** `src/styles/tokens.css` and `src/styles/bundle.css` are copied from the Euro Travel design system (published as a Claude artifact: https://claude.ai/artifact/3pUcWHRGNXUJomDGEQEC7x). Its front-page prototype is at https://claude.ai/artifact/GLp85vnZVVHZ8C4KacoARb. Components are plain CSS classes (`et-card`, `et-band`, `et-photo`, `et-chip`, and so on), so React components are thin wrappers around them, with no Tailwind. `src/styles/site.css` holds the page-level layout (`pg-*` classes). Follow the system's rules:
- Never hard-code a hue. Set `data-region` or `data-season` and use the `--region-*` and `--season-*` tokens.
- Use sentence case, with no uppercase transforms, no emoji and no exclamation marks.
- Keep a visible focus ring, and give every image meaningful `alt` text (or `alt=""` when adjacent text names the place).
- Fonts are loaded with `next/font` as `--nf-display` (Cormorant Garamond) and `--nf-sans` (Commissioner), mapped to the design system's `--font-display` and `--font-sans` in `src/app/globals.css`. `bundle.css` deliberately has its own Google Fonts `@import` removed.

**Photos.** Destination photos are hotlinked from `images.unsplash.com` (allowed in `next.config.ts`). `unsplashImage()` adds size and quality parameters, and links back to Unsplash must go through `unsplashLink()` so they carry the referral parameters. Every photo needs a visible photographer credit. Inside a card, credits are plain text, because a link would sit under the card's stretched title link.

## Planned integrations (constraints to respect)

- The onvaou routing API (https://onvaou.app/developers/routing-api.html) requires an `x-api-key` header, and its docs say to call it from a server only. Proxy it through a route handler or server component and show its attribution string. The free tier is non-commercial.
- Signed-in features use the cookie-based client in `src/lib/supabase/server.ts` (`@supabase/ssr`). Keep it separate from the cookie-free public client, and read cookies outside `"use cache"` scopes.

## Auth

Email and password through Supabase Auth. `src/proxy.ts` refreshes the session on each request (and sends signed-in users away from `/login` and `/signup`). `src/app/auth/actions.ts` holds the `signUp`, `logIn` and `logOut` server actions, used by `AuthForm` on `/login` and `/signup`. `src/app/auth/confirm/route.ts` finishes the email confirmation link. `getCurrentUser()` in `src/lib/auth.ts` verifies the JWT with `getClaims()`; it reads cookies, so call it only behind `<Suspense>` (the nav's `AccountLinks` does). In Supabase, add `<site url>/auth/confirm` to Auth > URL configuration > Redirect URLs, for localhost and for the Vercel domain.
