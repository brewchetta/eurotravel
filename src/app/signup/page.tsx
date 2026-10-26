import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <section className="pg-sec">
      <div className="et-container">
        <Reveal className="et-stack pg-auth">
          <p className="et-eyebrow">Join Euro Travel</p>
          <h1 className="et-display-lg">Create your account</h1>
          <p className="et-body-lg">
            Save places you love and, soon, suggest your own favorite spots.
          </p>
          <AuthForm mode="signup" />
        </Reveal>
      </div>
    </section>
  );
}
