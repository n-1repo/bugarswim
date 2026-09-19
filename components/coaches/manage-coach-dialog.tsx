"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { CoachEditForm } from "@/components/coaches/coach-edit-form";

interface CoachDetail {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
}

export function ManageCoachDialog({ coach }: { coach: CoachDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-primary underline-offset-2 transition-colors hover:underline hover:opacity-80 active:opacity-60"
      >
        Kelola
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={coach.full_name}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{coach.email}</p>
          <CoachEditForm coach={coach} />
        </div>
      </Dialog>
    </>
  );
}
