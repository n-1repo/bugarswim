"use server";

import { redirect } from "next/navigation";
import { getSession, createSession, clearSession } from "@/lib/auth/session";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validations/auth";
import { roleHome } from "@/lib/auth/roles";

export interface ChangePasswordState {
  error?: string;
}

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Kata sandi tidak valid" };
  }

  const supabase = createAdminSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", session.sub)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await clearSession();
    redirect("/login?deactivated=1");
  }

  const { data: credentials } = await supabase
    .from("auth_credentials")
    .select("password_hash")
    .eq("profile_id", session.sub)
    .maybeSingle();

  if (!credentials) {
    return { error: "Kata sandi saat ini salah" };
  }

  const currentValid = await verifyPassword(parsed.data.currentPassword, credentials.password_hash);
  if (!currentValid) {
    return { error: "Kata sandi saat ini salah" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);

  await supabase
    .from("auth_credentials")
    .update({ password_hash: passwordHash })
    .eq("profile_id", session.sub);

  await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", session.sub);

  await createSession({
    id: session.sub,
    email: session.email,
    fullName: session.full_name,
    role: session.app_role,
  });

  redirect(roleHome(session.app_role));
}
