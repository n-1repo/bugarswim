import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getChild, listBookingsByClass, listClasses, listClassTypes, listLocations, markAttendance } from "@/lib/db";
import { formatDateTime, formatTime } from "@/lib/format";
import { BackLink } from "@/components/shared/back-link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendancePage() {
  const { classId } = useParams<{ classId: string }>();
  const [, forceRefresh] = useState(0);

  const swimClass = classId ? listClasses().find((c) => c.id === classId) : undefined;
  if (!classId || !swimClass) return <Navigate to="/coach" replace />;

  const location = listLocations().find((l) => l.id === swimClass.locationId);
  const classType = listClassTypes().find((t) => t.id === swimClass.classTypeId);
  const bookings = listBookingsByClass(classId);

  function handleToggle(bookingId: string, current: boolean) {
    markAttendance(bookingId, !current);
    forceRefresh((n) => n + 1);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <BackLink to="/coach" label="Jadwal Saya" />
      <div>
        <h1 className="text-2xl font-semibold">{classType?.name ?? "Kelas"}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(swimClass.startTime)} — {formatTime(swimClass.endTime)} · {location?.name}
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Anak</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const child = getChild(booking.childId);
            return (
              <TableRow key={booking.id}>
                <TableCell>{child?.fullName ?? "-"}</TableCell>
                <TableCell>{booking.isAttended ? "Hadir" : "Belum Hadir"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={booking.isAttended ? "outline" : "default"}
                    onClick={() => handleToggle(booking.id, booking.isAttended)}
                  >
                    {booking.isAttended ? "Tandai Belum Hadir" : "Tandai Hadir"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Belum ada peserta terdaftar di kelas ini.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
