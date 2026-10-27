import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for the link in Supabase's confirmation email. It handles both
 * the PKCE `code` flow (the default) and the `token_hash` flow (custom email
 * templates), then sends the user home, signed in.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Google sends `error` (for example `access_denied`) when the user cancels on
  // its consent screen, with no `code` to exchange.
  if (!code && !tokenHash && searchParams.get("error")) {
    return NextResponse.redirect(new URL("/login?error=oauth", origin));
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/", origin));
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.redirect(new URL("/login?error=confirm", origin));
}
