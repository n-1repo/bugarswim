"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PackageForm } from "@/components/billing/package-form";

export function AddPackageDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Paket</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Paket Baru">
        <PackageForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
