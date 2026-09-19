"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { SubscriptionForm } from "@/components/billing/subscription-form";
import type { Lookup } from "@/lib/data/lookups";

export function AddSubscriptionDialog({
  childOptions,
  packages,
}: {
  childOptions: Lookup[];
  packages: Lookup[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Langganan</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Tambah Langganan">
        <SubscriptionForm childOptions={childOptions} packages={packages} onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
