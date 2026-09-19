"use server";

import { revalidatePath } from "next/cache";
import { requireActionRole } from "@/lib/auth/guard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type ActionState } from "./types";

export async function markAttendanceForm(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireActionRole("coach");
  const bookingId = String(formData.get("bookingId"));
  const classId = String(formData.get("classId"));
  const isAttended = formData.get("isAttended") === "true";

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({
      is_attended: isAttended,
      attended_at: isAttended ? new Date().toISOString() : null,
    })
    .eq("id", bookingId);

  if (error) {
    return { ok: false, error: "Gagal menyimpan kehadiran" };
  }

  revalidatePath(`/coach/attendance/${classId}`);
  return { ok: true };
}

export async function updateBookingNotesForm(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireActionRole("coach");
  const bookingId = String(formData.get("bookingId"));
  const classId = String(formData.get("classId"));
  const notes = String(formData.get("notes") ?? "").trim();

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("bookings")
    .update({ notes: notes || null })
    .eq("id", bookingId);

  if (error) {
    return { ok: false, error: "Gagal menyimpan catatan" };
  }

  revalidatePath(`/coach/attendance/${classId}`);
  return { ok: true };
}
