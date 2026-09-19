"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ClassForm } from "@/components/schedule/class-form";
import type { Lookup } from "@/lib/data/lookups";

export function AddClassDialog({
  coaches,
  locations,
  classTypes,
}: {
  coaches: Lookup[];
  locations: Lookup[];
  classTypes: Lookup[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Kelas</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Kelas">
        <ClassForm
          coaches={coaches}
          locations={locations}
          classTypes={classTypes}
          onSuccess={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
