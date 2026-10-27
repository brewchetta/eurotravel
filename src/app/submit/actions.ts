"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { parseSubmission, slugify, type SubmissionErrors, type SubmissionValues } from "@/lib/submission";
import { createClient } from "@/lib/supabase/server";

export type SubmitState = {
  error?: string;
  errors?: SubmissionErrors;
  values?: SubmissionValues;
  done?: boolean;
};

/** Pending recommendations one person can have waiting at once. */
const MAX_PENDING = 5;
const UNIQUE_VIOLATION = "23505";

export async function submitRecommendation(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Authorize here too: the page only hides the form, it does not protect the action.
  const user = await getCurrentUser();
  if (!user) return { error: "Log in to recommend a place." };

  const { values, errors, data } = parseSubmission(formData);
  if (!data) {
    return { values, errors, error: "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("destinations")
    .select("id", { count: "exact", head: true })
    .eq("submitted_by", user.id)
    .eq("status", "pending");
  if ((count ?? 0) >= MAX_PENDING) {
    return {
      values,
      error: `You have ${MAX_PENDING} recommendations waiting for review. Wait for those before sending more.`,
    };
  }

  // Slugs are unique across every destination, including pending ones other people
  // cannot see, so a clash gets a short suffix. An admin rejects true duplicates.
  const base = slugify(data.name);
  let lastError: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("destinations").insert({
      ...data,
      slug,
      featured: false,
      status: "pending",
      submitted_by: user.id,
    });
    if (!error) {
      revalidatePath("/submit");
      return { done: true };
    }
    lastError = error.code ?? "unknown";
    if (error.code !== UNIQUE_VIOLATION) break;
  }

  console.error("Could not save recommendation:", lastError);
  return { values, error: "We could not save your recommendation. Try again in a moment." };
}
