import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { AddCoachDialog } from "@/components/coaches/add-coach-dialog";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_active", { count: "exact" })
    .eq("role", "coach");
  if (sp.q) query = query.or(`full_name.ilike.%${sp.q}%,email.ilike.%${sp.q}%`);
  if (sp.status) query = query.eq("is_active", sp.status === "active");

  const { data: coaches, count, error } = await query.order("full_name").range(from, to);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pelatih</h1>
        <AddCoachDialog />
      </div>
      <QueryErrorAlert error={error?.message} />
      <ListControls
        searchPlaceholder="Cari nama atau email..."
        filters={[
          {
            key: "status",
            label: "Semua Status",
            options: [
              { value: "active", label: "Aktif" },
              { value: "inactive", label: "Nonaktif" },
            ],
          },
        ]}
        totalItems={count ?? 0}
        page={page}
        pageSize={pageSize}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(coaches ?? []).map((coach) => (
            <TableRow key={coach.id}>
              <TableCell>{coach.full_name}</TableCell>
              <TableCell>{coach.email}</TableCell>
              <TableCell>{coach.phone ?? "-"}</TableCell>
              <TableCell>
                <Badge variant={coach.is_active ? "success" : "secondary"}>
                  {coach.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/coaches/${coach.id}`}
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  Kelola
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {(coaches ?? []).length === 0 ? <EmptyRow colSpan={5} message="Belum ada pelatih." /> : null}
        </TableBody>
      </Table>
    </div>
  );
}
