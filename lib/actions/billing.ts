"use server";

import { revalidatePath } from "next/cache";
import { requireActionRole } from "@/lib/auth/guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { packageSchema, subscriptionSchema } from "@/lib/validations/billing";
import { type ActionState } from "./types";

export async function createPackage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireActionRole("admin");
  const parsed = packageSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    sessionsIncluded: formData.get("sessionsIncluded") || undefined,
    validityWeeks: formData.get("validityWeeks") || undefined,
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("membership_packages").insert({
    name: parsed.data.name,
    price: parsed.data.price,
    sessions_included: parsed.data.sessionsIncluded ?? null,
    validity_weeks: parsed.data.validityWeeks,
    description: parsed.data.description ?? null,
  });
  if (error) return { ok: false, error: "Gagal menyimpan paket" };

  revalidatePath("/admin/billing/packages");
  return { ok: true };
}

export async function createSubscription(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireActionRole("admin");
  const parsed = subscriptionSchema.safeParse({
    childId: formData.get("childId"),
    packageId: formData.get("packageId"),
    startDate: formData.get("startDate"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabaseClient();
  const { data: pkg, error: pkgError } = await supabase
    .from("membership_packages")
    .select("validity_weeks")
    .eq("id", parsed.data.packageId)
    .single();
  if (pkgError || !pkg) return { ok: false, error: "Paket tidak ditemukan" };

  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + pkg.validity_weeks * 7);

  const { error } = await supabase.from("subscriptions").insert({
    child_id: parsed.data.childId,
    package_id: parsed.data.packageId,
    start_date: parsed.data.startDate,
    end_date: endDate.toISOString().slice(0, 10),
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Anak ini sudah memiliki langganan aktif" };
    }
    return { ok: false, error: "Gagal menyimpan langganan" };
  }

  revalidatePath("/admin/billing/subscriptions");
  return { ok: true };
}

export async function cancelSubscriptionForm(formData: FormData): Promise<void> {
  await requireActionRole("admin");
  const subscriptionId = String(formData.get("subscriptionId"));
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", end_date: new Date().toISOString().slice(0, 10) })
    .eq("id", subscriptionId);
  revalidatePath("/admin/billing/subscriptions");
}

export async function markInvoicePaidForm(formData: FormData): Promise<void> {
  await requireActionRole("admin");
  const invoiceId = String(formData.get("invoiceId"));
  const supabase = await createServerSupabaseClient();
  await supabase.rpc("mark_invoice_paid", { p_invoice_id: invoiceId });
  revalidatePath("/admin/billing/invoices");
  revalidatePath("/admin/cash-ledger");
}

export async function voidInvoiceForm(formData: FormData): Promise<void> {
  await requireActionRole("admin");
  const invoiceId = String(formData.get("invoiceId"));
  const supabase = await createServerSupabaseClient();
  await supabase.from("invoices").update({ status: "void" }).eq("id", invoiceId).eq("status", "outstanding");
  revalidatePath("/admin/billing/invoices");
}
