"use client";

import { useActionState, useRef } from "react";
import { updateBookingNotesForm } from "@/lib/actions/attendance";
import { useActionToast } from "@/components/shared/use-action-toast";
import { Input } from "@/components/ui/input";

export function NotesField({
  bookingId,
  classId,
  notes,
}: {
  bookingId: string;
  classId: string;
  notes: string | null;
}) {
  const [state, formAction] = useActionState(updateBookingNotesForm, {});
  useActionToast(state, "Catatan disimpan");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="classId" value={classId} />
      <Input
        name="notes"
        defaultValue={notes ?? ""}
        placeholder="Tambahkan catatan..."
        className="min-w-40"
        onBlur={(e) => {
          if (e.target.value === (notes ?? "")) return;
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
