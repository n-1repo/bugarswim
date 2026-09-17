"use client";

import { useActionState } from "react";
import { updateCoach, toggleCoachActiveForm } from "@/lib/actions/coaches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CoachDetail {
  id: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
}

export function CoachEditForm({ coach }: { coach: CoachDetail }) {
  const updateCoachWithId = updateCoach.bind(null, coach.id);
  const [state, formAction, pending] = useActionState(updateCoachWithId, {});

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

      <form action={toggleCoachActiveForm}>
        <input type="hidden" name="coachId" value={coach.id} />
        <input type="hidden" name="isActive" value={(!coach.is_active).toString()} />
        <Button type="submit" variant={coach.is_active ? "destructive" : "secondary"}>
          {coach.is_active ? "Nonaktifkan Pelatih" : "Aktifkan Kembali"}
        </Button>
      </form>
    </div>
  );
}
