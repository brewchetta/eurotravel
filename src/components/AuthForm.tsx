"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn, signUp, type AuthState } from "@/app/auth/actions";

const COPY = {
  login: {
    action: logIn,
    submit: "Log in",
    pending: "Logging in…",
    autoComplete: "current-password",
    switchText: "New here?",
    switchLink: { href: "/signup", label: "Create an account" },
  },
  signup: {
    action: signUp,
    submit: "Create account",
    pending: "Creating account…",
    autoComplete: "new-password",
    switchText: "Already have an account?",
    switchLink: { href: "/login", label: "Log in" },
  },
} as const;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const copy = COPY[mode];
  const [state, formAction, pending] = useActionState<AuthState, FormData>(copy.action, {});

  if (state.notice) {
    return (
      <div className="et-notice et-notice--success pg-auth__notice" role="status">
        <div>
          <p className="et-notice__title">{state.notice.title}</p>
          <p className="et-notice__text">{state.notice.text}</p>
        </div>
      </div>
    );
  }

  const errorId = "auth-error";

  return (
    <form action={formAction} className="et-stack pg-auth__form" noValidate>
      {state.error && (
        <div className="et-notice et-notice--danger pg-auth__notice" role="alert" id={errorId}>
          <p className="et-notice__text">{state.error}</p>
        </div>
      )}

      <div className="et-field">
        <label htmlFor="email">Email</label>
        <input
          className="et-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? errorId : undefined}
          required
        />
      </div>

      <div className="et-field">
        <label htmlFor="password">Password</label>
        <input
          className="et-input"
          id="password"
          name="password"
          type="password"
          autoComplete={copy.autoComplete}
          minLength={mode === "signup" ? 8 : undefined}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={mode === "signup" ? "password-hint" : undefined}
          required
        />
        {mode === "signup" && (
          <p className="et-hint" id="password-hint">
            At least 8 characters.
          </p>
        )}
      </div>

      <button className="et-btn et-btn--lg" type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? copy.pending : copy.submit}
      </button>

      <p className="et-body-sm">
        {copy.switchText} <Link href={copy.switchLink.href}>{copy.switchLink.label}</Link>
      </p>
    </form>
  );
}
