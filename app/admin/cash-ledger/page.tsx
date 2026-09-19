import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdjustmentForm } from "@/components/cash-ledger/adjustment-form";

const CATEGORY_LABEL: Record<string, string> = {
  payment_received: "Pembayaran Diterima",
  payroll: "Gaji Pelatih",
  manual_adjustment: "Penyesuaian Manual",
};

export default async function CashLedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; direction?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  const { data: latest } = await supabase
    .from("cash_ledger_with_balance")
    .select("running_balance")
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const latestBalance = latest?.running_balance ?? 0;

  let query = supabase
    .from("cash_ledger_with_balance")
    .select("id, entry_date, category, direction, amount, reason, running_balance", { count: "exact" });
  if (sp.q) query = query.ilike("reason", `%${sp.q}%`);
  if (sp.category) query = query.eq("category", sp.category);
  if (sp.direction) query = query.eq("direction", sp.direction);

  const { data: entries, count } = await query.order("entry_date", { ascending: false }).range(from, to);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Buku Kas</h1>
        <Badge variant={Number(latestBalance) >= 0 ? "success" : "destructive"} className="text-xs">
          Saldo: Rp {Number(latestBalance).toLocaleString("id-ID")}
        </Badge>
      </div>

      <h2 className="text-xs font-semibold text-muted-foreground">Riwayat Transaksi</h2>
      <ListControls
        searchPlaceholder="Cari keterangan..."
        filters={[
          {
            key: "category",
            label: "Semua Kategori",
            options: Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label })),
          },
          {
            key: "direction",
            label: "Semua Arah",
            options: [
              { value: "in", label: "Masuk" },
              { value: "out", label: "Keluar" },
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
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Arah</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Keterangan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(entries ?? []).map((e) => (
            <TableRow key={e.id}>
              <TableCell>{new Date(e.entry_date).toLocaleString("id-ID")}</TableCell>
              <TableCell>{CATEGORY_LABEL[e.category] ?? e.category}</TableCell>
              <TableCell>
                <Badge variant={e.direction === "in" ? "success" : "secondary"}>
                  {e.direction === "in" ? "Masuk" : "Keluar"}
                </Badge>
              </TableCell>
              <TableCell>Rp {Number(e.amount).toLocaleString("id-ID")}</TableCell>
              <TableCell>Rp {Number(e.running_balance).toLocaleString("id-ID")}</TableCell>
              <TableCell>{e.reason ?? "-"}</TableCell>
            </TableRow>
          ))}
          {(entries ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada transaksi.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Tambah Penyesuaian Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <AdjustmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
