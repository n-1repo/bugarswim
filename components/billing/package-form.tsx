"use client";

import { useActionState } from "react";
import { createPackage } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionToast } from "@/components/shared/use-action-toast";

export function PackageForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createPackage, {});
  useActionToast(state, "Paket berhasil ditambahkan", onSuccess);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nama Paket</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" name="price" type="number" min={0} step={1000} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sessionsIncluded">Jumlah Sesi</Label>
          <Input id="sessionsIncluded" name="sessionsIncluded" type="number" min={1} step={1} placeholder="mis. 1 atau 4" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="validityWeeks">Masa Berlaku (minggu)</Label>
        <Input id="validityWeeks" name="validityWeeks" type="number" min={1} step={1} defaultValue={6} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Deskripsi</Label>
        <Input id="description" name="description" />
      </div>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Menyimpan..." : "Tambah Paket"}
      </Button>
    </form>
  );
}
