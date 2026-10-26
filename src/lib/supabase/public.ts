import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for public reads (approved destinations).
 * It is safe inside `use cache` functions. Signed-in flows will get their own
 * cookie-based server client (via @supabase/ssr) when auth is added.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.",
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
