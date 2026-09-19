"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CoachForm } from "@/components/coaches/coach-form";

export function AddCoachDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Pelatih</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Pelatih">
        <CoachForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
