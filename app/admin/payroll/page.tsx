import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveCoaches } from "@/lib/data/lookups";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddPayrollDialog } from "@/components/payroll/add-payroll-dialog";

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; coach?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("payroll_runs")
    .select(
      "id, period_start, period_end, base_salary, bonus, thr, total_amount, status, profiles!inner(full_name)",
      { count: "exact" }
    );
  if (sp.q) query = query.ilike("profiles.full_name", `%${sp.q}%`);
  if (sp.status) query = query.eq("status", sp.status);
  if (sp.coach) query = query.eq("coach_id", sp.coach);

  const [{ data: runs, count, error }, activeCoaches, { data: allCoaches }] = await Promise.all([
    query.order("period_start", { ascending: false }).range(from, to),
    getActiveCoaches(),
    supabase.from("profiles").select("id, full_name").eq("role", "coach").order("full_name"),
  ]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gaji Pelatih</h1>
        <AddPayrollDialog coaches={activeCoaches} />
      </div>

      <QueryErrorAlert error={error?.message} />
      <h2 className="text-xs font-semibold text-muted-foreground">Riwayat Gaji</h2>
      <ListControls
        searchPlaceholder="Cari nama pelatih..."
        filters={[
          {
            key: "status",
            label: "Semua Status",
            options: [
              { value: "draft", label: "Draf" },
              { value: "posted", label: "Terposting" },
            ],
          },
          {
            key: "coach",
            label: "Semua Pelatih",
            options: (allCoaches ?? []).map((c) => ({ value: c.id, label: c.full_name })),
          },
        ]}
        totalItems={count ?? 0}
        page={page}
        pageSize={pageSize}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pelatih</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Gaji Pokok</TableHead>
            <TableHead>Bonus</TableHead>
            <TableHead>THR</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(runs ?? []).map((r) => {
            const row = r as unknown as {
              id: string;
              period_start: string;
              period_end: string;
              base_salary: number;
              bonus: number;
              thr: number;
              total_amount: number;
              status: string;
              profiles: { full_name: string } | null;
            };
            return (
              <TableRow key={row.id}>
                <TableCell>{row.profiles?.full_name ?? "-"}</TableCell>
                <TableCell>
                  {row.period_start} – {row.period_end}
                </TableCell>
                <TableCell>{formatCurrency(row.base_salary)}</TableCell>
                <TableCell>{formatCurrency(row.bonus)}</TableCell>
                <TableCell>{formatCurrency(row.thr)}</TableCell>
                <TableCell>{formatCurrency(row.total_amount)}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "posted" ? "success" : "secondary"}>
                    {row.status === "posted" ? "Terposting" : "Draf"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
          {(runs ?? []).length === 0 ? <EmptyRow colSpan={7} message="Belum ada data gaji." /> : null}
        </TableBody>
      </Table>
    </div>
  );
}
