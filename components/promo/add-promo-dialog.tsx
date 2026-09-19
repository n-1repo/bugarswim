"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PromoForm } from "@/components/promo/promo-form";

export function AddPromoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Promo</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Promo Baru">
        <PromoForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
