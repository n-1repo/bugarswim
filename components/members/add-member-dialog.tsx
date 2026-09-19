"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MemberForm } from "@/components/members/member-form";
import type { Lookup } from "@/lib/data/lookups";

export function AddMemberDialog({ locations }: { locations: Lookup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tambah Anggota</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Daftarkan Anggota Baru">
        <MemberForm locations={locations} onSuccess={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
