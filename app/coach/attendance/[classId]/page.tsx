import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { markAttendanceForm } from "@/lib/actions/attendance";
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

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: cls }, { data: bookings }] = await Promise.all([
    supabase
      .from("classes")
      .select("id, start_time, end_time, locations(name), class_types(name)")
      .eq("id", classId)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("id, is_attended, children(full_name)")
      .eq("class_id", classId),
  ]);

  if (!cls) notFound();

  const info = cls as unknown as {
    start_time: string;
    end_time: string;
    locations: { name: string } | null;
    class_types: { name: string } | null;
  };

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <BackLink href="/coach" label="Jadwal Saya" />
      <div>
        <h1 className="text-2xl font-semibold">{info.class_types?.name ?? "Kelas"}</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(info.start_time).toLocaleString("id-ID")} —{" "}
          {new Date(info.end_time).toLocaleTimeString("id-ID")} · {info.locations?.name}
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
          {(bookings ?? []).map((b) => {
            const booking = b as unknown as {
              id: string;
              is_attended: boolean;
              children: { full_name: string };
            };
            return (
              <TableRow key={booking.id}>
                <TableCell>{booking.children.full_name}</TableCell>
                <TableCell>{booking.is_attended ? "Hadir" : "Belum Hadir"}</TableCell>
                <TableCell>
                  <form action={markAttendanceForm}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="classId" value={classId} />
                    <input type="hidden" name="isAttended" value={(!booking.is_attended).toString()} />
                    <Button type="submit" size="sm" variant={booking.is_attended ? "outline" : "default"}>
                      {booking.is_attended ? "Tandai Belum Hadir" : "Tandai Hadir"}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            );
          })}
          {(bookings ?? []).length === 0 ? (
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
