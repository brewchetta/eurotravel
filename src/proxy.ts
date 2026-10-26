import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps the Supabase session fresh. Server Components cannot write cookies, so
 * the proxy refreshes an expiring token and forwards the new cookies both to
 * the rest of the request and to the browser.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Validates the token and refreshes it when needed. Do not run other
  // Supabase calls between creating the client and this one.
  const { data } = await supabase.auth.getClaims();

  // Signed-in users have no reason to see the sign-up and log-in pages.
  const { pathname } = request.nextUrl;
  if (data?.claims && (pathname === "/login" || pathname === "/signup")) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static files, image optimization and common image types.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
