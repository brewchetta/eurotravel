"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  /** Shown instead of the form, for example after asking the user to confirm their email. */
  notice?: { title: string; text: string };
  email?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

async function getOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address.", email };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a password of at least ${MIN_PASSWORD_LENGTH} characters.`, email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await getOrigin()}/auth/confirm` },
  });

  if (error) {
    if (error.code === "weak_password") {
      return { error: "That password is too easy to guess. Try a longer or less common one.", email };
    }
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return { error: "Too many attempts. Wait a minute and try again.", email };
    }
    return { error: "We could not create your account. Try again in a moment.", email };
  }

  // With email confirmation on, Supabase returns no session until the link is
  // opened. It answers the same way for an address that already exists, so the
  // message does not reveal which addresses have accounts.
  if (!data.session) {
    return {
      email,
      notice: {
        title: "Check your email",
        text: `If ${email} can be used to sign up, a confirmation link is on its way. Open it to finish creating your account.`,
      },
    };
  }

  redirect("/");
}

export async function logIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Confirm your email first. The link is in the message we sent you.", email };
    }
    if (error.status === 429) {
      return { error: "Too many attempts. Wait a minute and try again.", email };
    }
    return { error: "That email and password do not match.", email };
  }

  redirect("/");
}

/**
 * Starts Google sign-in. Supabase runs the OAuth exchange and sends the user
 * back to `/auth/confirm` with a `code`, which that route turns into a session.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await getOrigin()}/auth/confirm` },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
