import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
};

/**
 * The signed-in user, or null. It reads cookies, so render it behind
 * `<Suspense>`. `getClaims()` verifies the token's signature, unlike
 * `getSession()`, whose cookie contents must not be trusted.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : "" };
}
