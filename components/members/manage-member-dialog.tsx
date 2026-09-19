"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { MemberEditForm } from "@/components/members/member-edit-form";
import type { Lookup } from "@/lib/data/lookups";

interface ChildDetail {
  id: string;
  full_name: string;
  date_of_birth: string;
  notes: string | null;
  address: string | null;
  preferred_location_id: string | null;
  is_active: boolean;
}

export function ManageMemberDialog({
  child,
  parent,
  locations,
}: {
  child: ChildDetail;
  parent: { full_name: string; email: string; phone: string | null } | null;
  locations: Lookup[];
}) {
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
      <Dialog open={open} onClose={() => setOpen(false)} title={child.full_name}>
        <div className="flex flex-col gap-4">
          {parent ? (
            <p className="text-sm text-muted-foreground">
              Orang tua: {parent.full_name} — {parent.email} {parent.phone ? `— ${parent.phone}` : ""}
            </p>
          ) : null}
          <MemberEditForm child={child} locations={locations} />
        </div>
      </Dialog>
    </>
  );
}
