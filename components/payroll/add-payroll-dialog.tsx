"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PayrollRunForm } from "@/components/payroll/payroll-run-form";
import type { Lookup } from "@/lib/data/lookups";

export function AddPayrollDialog({ coaches }: { coaches: Lookup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Buat Gaji Baru</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Buat Gaji Baru">
        <PayrollRunForm coaches={coaches} onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
