import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { deleteClassForm, removeBookingForm } from "@/lib/actions/schedule";
import { BackLink } from "@/components/shared/back-link";
import { ActionForm } from "@/components/shared/action-form";
import { EmptyRow } from "@/components/shared/empty-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: cls }, { data: bookings }, { data: allChildren }] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "id, start_time, end_time, capacity, profiles(full_name), locations(name), class_types(name)"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("id, is_attended, children(id, full_name)")
      .eq("class_id", id),
    supabase.from("children").select("id, full_name").eq("is_active", true).order("full_name"),
  ]);

  if (!cls) notFound();

  const bookedChildIds = new Set(
    (bookings ?? []).map((b) => (b as unknown as { children: { id: string } }).children.id)
  );
  const availableChildren = (allChildren ?? [])
    .filter((c) => !bookedChildIds.has(c.id))
    .map((c) => ({ id: c.id, name: c.full_name }));

  const info = cls as unknown as {
    start_time: string;
    end_time: string;
    capacity: number;
    profiles: { full_name: string } | null;
    locations: { name: string } | null;
    class_types: { name: string } | null;
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <BackLink href="/admin/schedule" label="Jadwal Kelas" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{info.class_types?.name ?? "Kelas"}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(info.start_time)} —{" "}
            {formatTime(info.end_time)} · {info.locations?.name} ·{" "}
            {info.profiles?.full_name}
          </p>
        </div>
        <ActionForm
          action={deleteClassForm}
          fields={{ classId: id }}
          confirmMessage={`Hapus kelas ini beserta ${(bookings ?? []).length} pendaftaran yang ada? Tindakan ini tidak bisa dibatalkan.`}
          successMessage="Kelas dihapus"
          variant="destructive"
          size="sm"
        >
          Hapus Kelas
        </ActionForm>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Peserta ({(bookings ?? []).length} / {info.capacity})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Anak</TableHead>
                <TableHead>Kehadiran</TableHead>
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
                    <TableCell>{booking.is_attended ? "Hadir" : "Belum"}</TableCell>
                    <TableCell>
                      <ActionForm
                        action={removeBookingForm}
                        fields={{ bookingId: booking.id, classId: id }}
                        successMessage="Pendaftaran dibatalkan"
                        variant="ghost"
                        size="sm"
                      >
                        Batalkan Pendaftaran
                      </ActionForm>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(bookings ?? []).length === 0 ? (
                <EmptyRow colSpan={3} message="Belum ada peserta." />
              ) : null}
            </TableBody>
          </Table>
          <AddBookingForm classId={id} availableChildren={availableChildren} />
        </CardContent>
      </Card>
    </div>
  );
}
