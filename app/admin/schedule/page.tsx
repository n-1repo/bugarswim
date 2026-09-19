import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveChildren, getActiveCoaches, getClassTypes, getLocations } from "@/lib/data/lookups";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { AddClassDialog } from "@/components/schedule/add-class-dialog";
import { ManageClassDialog } from "@/components/schedule/manage-class-dialog";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { formatDateTime, formatTime } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClassRow {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  profiles: { full_name: string } | null;
  locations: { name: string } | null;
  class_types: { name: string } | null;
  bookings: { id: string; is_attended: boolean; children: { id: string; full_name: string } }[];
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{
    coach?: string;
    location?: string;
    classType?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("classes")
    .select(
      "id, start_time, end_time, capacity, profiles(full_name), locations(name), class_types(name), bookings(id, is_attended, children(id, full_name))",
      { count: "exact" }
    );
  if (sp.coach) query = query.eq("instructor_id", sp.coach);
  if (sp.location) query = query.eq("location_id", sp.location);
  if (sp.classType) query = query.eq("class_type_id", sp.classType);

  const [{ data, count, error }, coaches, locations, classTypes, allChildren] = await Promise.all([
    query.order("start_time").range(from, to),
    getActiveCoaches(),
    getLocations(),
    getClassTypes(),
    getActiveChildren(),
  ]);

  const classes = (data ?? []) as unknown as ClassRow[];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Jadwal Kelas</h1>
        <AddClassDialog coaches={coaches} locations={locations} classTypes={classTypes} />
      </div>
      <QueryErrorAlert error={error?.message} />
      <ListControls
        filters={[
          {
            key: "coach",
            label: "Semua Pelatih",
            options: coaches.map((c) => ({ value: c.id, label: c.name })),
          },
          {
            key: "location",
            label: "Semua Lokasi",
            options: locations.map((l) => ({ value: l.id, label: l.name })),
          },
          {
            key: "classType",
            label: "Semua Jenis",
            options: classTypes.map((c) => ({ value: c.id, label: c.name })),
          },
        ]}
        totalItems={count ?? 0}
        page={page}
        pageSize={pageSize}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>Pelatih</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Peserta</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((cls) => (
            <TableRow key={cls.id}>
              <TableCell>
                {formatDateTime(cls.start_time)} — {formatTime(cls.end_time)}
              </TableCell>
              <TableCell>{cls.profiles?.full_name ?? "-"}</TableCell>
              <TableCell>{cls.locations?.name ?? "-"}</TableCell>
              <TableCell>{cls.class_types?.name ?? "-"}</TableCell>
              <TableCell>
                {cls.bookings?.length ?? 0} / {cls.capacity}
              </TableCell>
              <TableCell>
                <ManageClassDialog
                  classId={cls.id}
                  info={cls}
                  bookings={cls.bookings ?? []}
                  allChildren={allChildren}
                />
              </TableCell>
            </TableRow>
          ))}
          {classes.length === 0 ? <EmptyRow colSpan={6} message="Belum ada jadwal kelas." /> : null}
        </TableBody>
      </Table>
    </div>
  );
}
