"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function review(formData: FormData, status: "approved" | "rejected") {
  // Never trust the page that rendered the button: check the role again here.
  const user = await getCurrentUser();
  if (user?.role !== "admin") throw new Error("Only admins can review recommendations.");

  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Missing recommendation.");

  const supabase = await createClient();
  // Only pending rows move, so a double click or a stale page cannot overwrite an earlier decision.
  const { data, error } = await supabase
    .from("destinations")
    .update({ status })
    .eq("id", id)
    .eq("status", "pending")
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(`Could not save the decision: ${error.message}`);

  if (data && status === "approved") {
    updateTag("destinations");
    updateTag(`destination:${data.slug}`);
  }
  revalidatePath("/admin/submissions");
  revalidatePath("/submit");
}

export async function approveRecommendation(formData: FormData) {
  await review(formData, "approved");
}

export async function rejectRecommendation(formData: FormData) {
  await review(formData, "rejected");
}
