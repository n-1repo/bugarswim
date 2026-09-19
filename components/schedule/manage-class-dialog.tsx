"use client";

import { useState } from "react";
import { deleteClassForm, removeBookingForm } from "@/lib/actions/schedule";
import { Dialog } from "@/components/ui/dialog";
import { ActionForm } from "@/components/shared/action-form";
import { EmptyRow } from "@/components/shared/empty-row";
import { AddBookingForm } from "@/components/schedule/add-booking-form";
import { formatDateTime, formatTime } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lookup } from "@/lib/data/lookups";

interface ClassBooking {
  id: string;
  is_attended: boolean;
  children: { id: string; full_name: string };
}

export function ManageClassDialog({
  classId,
  info,
  bookings,
  allChildren,
}: {
  classId: string;
  info: {
    start_time: string;
    end_time: string;
    capacity: number;
    profiles: { full_name: string } | null;
    locations: { name: string } | null;
    class_types: { name: string } | null;
  };
  bookings: ClassBooking[];
  allChildren: Lookup[];
}) {
  const [open, setOpen] = useState(false);
  const bookedChildIds = new Set(bookings.map((b) => b.children.id));
  const availableChildren = allChildren.filter((c) => !bookedChildIds.has(c.id));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        Kelola
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={info.class_types?.name ?? "Kelola Kelas"}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {formatDateTime(info.start_time)} — {formatTime(info.end_time)} · {info.locations?.name} ·{" "}
              {info.profiles?.full_name}
            </p>
            <ActionForm
              action={deleteClassForm}
              fields={{ classId }}
              confirmMessage={`Hapus kelas ini beserta ${bookings.length} pendaftaran yang ada? Tindakan ini tidak bisa dibatalkan.`}
              successMessage="Kelas dihapus"
              variant="destructive"
              size="sm"
            >
              Hapus Kelas
            </ActionForm>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">
              Peserta ({bookings.length} / {info.capacity})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Anak</TableHead>
                  <TableHead>Kehadiran</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.children.full_name}</TableCell>
                    <TableCell>{booking.is_attended ? "Hadir" : "Belum"}</TableCell>
                    <TableCell>
                      <ActionForm
                        action={removeBookingForm}
                        fields={{ bookingId: booking.id }}
                        successMessage="Pendaftaran dibatalkan"
                        variant="ghost"
                        size="sm"
                      >
                        Batalkan Pendaftaran
                      </ActionForm>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 ? <EmptyRow colSpan={3} message="Belum ada peserta." /> : null}
              </TableBody>
            </Table>
            <AddBookingForm classId={classId} availableChildren={availableChildren} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
