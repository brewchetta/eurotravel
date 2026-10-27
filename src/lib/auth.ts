import "server-only";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Role = "user" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
};

/**
 * The signed-in user, or null. It reads cookies, so render it behind
 * `<Suspense>`. `getClaims()` verifies the token's signature, unlike
 * `getSession()`, whose cookie contents must not be trusted. The role comes
 * from `profiles`, which users can read but never write. Memoized per request.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    role: profile?.role === "admin" ? "admin" : "user",
  };
});

/** For admin pages: sends visitors to log in, and shows a 404 to everyone who is not an admin. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") notFound();
  return user;
}
