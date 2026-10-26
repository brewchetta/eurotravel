# Euro Travel

Slow journeys through Europe, in every season. Next.js (App Router) and Supabase, deployed on Vercel. Styled with the Euro Travel design system.

## Run it locally

1. Create a Supabase project. In the SQL editor, run `supabase/migrations/0001_destinations.sql`, then `supabase/seed.sql`.
2. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Project settings > API).
3. Install and start:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What is here

- `/` shows a hero for the current season, a season switcher over destination cards, regional bands and a gallery.
- `/destinations/[slug]` shows one destination.
- Destinations live in the `destinations` table. Only rows with `status = 'approved'` are public (row level security).
- Photographs are hotlinked from Unsplash and credited on every image.

## Design system

`src/styles/tokens.css` and `src/styles/bundle.css` come from the Euro Travel design system. `src/styles/site.css` holds the page-level layout. Fonts are Cormorant Garamond and Commissioner through `next/font`.

## Notes for development

This project uses Next.js 16 with Cache Components enabled (`next.config.ts`). Data reads sit in `use cache` functions (`src/lib/destinations.ts`), and Next's bundled docs are in `node_modules/next/dist/docs/`.

After changing destination rows in Supabase, cached pages refresh within an hour. The `destinations` cache tag is there for on-demand revalidation once an admin screen exists.
