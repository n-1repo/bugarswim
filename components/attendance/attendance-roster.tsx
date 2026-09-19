"use client";

import { useMemo, useState } from "react";
import { markAttendanceForm } from "@/lib/actions/attendance";
import { ActionForm } from "@/components/shared/action-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotesField } from "@/components/attendance/notes-field";

export interface AttendanceBooking {
  id: string;
  isAttended: boolean;
  notes: string | null;
  childName: string;
}

export function AttendanceRoster({
  classId,
  bookings,
}: {
  classId: string;
  bookings: AttendanceBooking[];
}) {
  const [search, setSearch] = useState("");
  const attendedCount = bookings.filter((b) => b.isAttended).length;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter((b) => b.childName.toLowerCase().includes(term));
  }, [bookings, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Badge variant={bookings.length > 0 && attendedCount === bookings.length ? "success" : "secondary"}>
          {attendedCount} / {bookings.length} Hadir
        </Badge>
      </div>

      {bookings.length > 5 ? (
        <Input
          placeholder="Cari nama anak..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Anak</TableHead>
            <TableHead>Kehadiran</TableHead>
            <TableHead>Catatan (opsional)</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.childName}</TableCell>
              <TableCell>
                <Badge variant={b.isAttended ? "success" : "outline"}>
                  {b.isAttended ? "Hadir" : "Belum Hadir"}
                </Badge>
              </TableCell>
              <TableCell>
                <NotesField bookingId={b.id} classId={classId} notes={b.notes} />
              </TableCell>
              <TableCell>
                <ActionForm
                  action={markAttendanceForm}
                  fields={{
                    bookingId: b.id,
                    classId,
                    isAttended: (!b.isAttended).toString(),
                  }}
                  successMessage={b.isAttended ? "Ditandai belum hadir" : "Ditandai hadir"}
                  size="sm"
                  variant={b.isAttended ? "outline" : "default"}
                >
                  {b.isAttended ? "Tandai Belum Hadir" : "Tandai Hadir"}
                </ActionForm>
              </TableCell>
            </TableRow>
          ))}
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                {bookings.length === 0
                  ? "Belum ada peserta terdaftar di kelas ini."
                  : "Tidak ada anak yang cocok dengan pencarian."}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
