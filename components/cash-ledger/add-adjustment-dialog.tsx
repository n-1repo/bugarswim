"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AdjustmentForm } from "@/components/cash-ledger/adjustment-form";

export function AddAdjustmentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Penyesuaian Manual</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Penyesuaian Manual">
        <AdjustmentForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
