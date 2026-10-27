import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { GoogleButton } from "@/components/GoogleButton";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <section className="pg-sec">
      <div className="et-container">
        <Reveal className="et-stack pg-auth">
          <p className="et-eyebrow">Welcome back</p>
          <h1 className="et-display-lg">Log in to Euro Travel</h1>
          <Suspense fallback={null}>
            <ConfirmError searchParams={searchParams} />
          </Suspense>
          <GoogleButton />
          <p className="pg-auth__divider et-body-sm" aria-hidden="true">or</p>
          <AuthForm mode="login" />
        </Reveal>
      </div>
    </section>
  );
}

async function ConfirmError({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { error } = await searchParams;
  if (error === "oauth") {
    return (
      <div className="et-notice et-notice--warning pg-auth__notice" role="alert">
        <p className="et-notice__text">
          Google sign-in did not finish. Try again, or log in with your email.
        </p>
      </div>
    );
  }
  if (error !== "confirm") return null;
  return (
    <div className="et-notice et-notice--warning pg-auth__notice" role="alert">
      <p className="et-notice__text">
        That confirmation link has expired or was already used. Log in, or create your account
        again to get a new link.
      </p>
    </div>
  );
}
