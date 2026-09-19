"use client";

import { useActionState } from "react";
import { updateCoach, toggleCoachActiveForm } from "@/lib/actions/coaches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionToast } from "@/components/shared/use-action-toast";
import { ActionForm } from "@/components/shared/action-form";

interface CoachDetail {
  id: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
}

export function CoachEditForm({ coach }: { coach: CoachDetail }) {
  const updateCoachWithId = updateCoach.bind(null, coach.id);
  const [state, formAction, pending] = useActionState(updateCoachWithId, {});
  useActionToast(state, "Perubahan disimpan");

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        {state.error ? (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nama Pelatih</Label>
          <Input id="fullName" name="fullName" defaultValue={coach.full_name} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Telepon</Label>
          <Input id="phone" name="phone" defaultValue={coach.phone ?? ""} />
        </div>
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>

      <ActionForm
        action={toggleCoachActiveForm}
        fields={{ coachId: coach.id, isActive: (!coach.is_active).toString() }}
        confirmMessage={
          coach.is_active
            ? "Nonaktifkan pelatih ini? Pelatih tidak akan bisa login sampai diaktifkan kembali."
            : undefined
        }
        successMessage={coach.is_active ? "Pelatih dinonaktifkan" : "Pelatih diaktifkan kembali"}
        variant={coach.is_active ? "destructive" : "secondary"}
      >
        {coach.is_active ? "Nonaktifkan Pelatih" : "Aktifkan Kembali"}
      </ActionForm>
    </div>
  );
}
