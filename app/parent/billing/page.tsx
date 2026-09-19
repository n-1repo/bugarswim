import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { INVOICE_STATUS_LABEL, INVOICE_STATUS_VARIANT } from "@/lib/status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ParentBillingPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: invoices, error }, { data: activeSubscriptions }, { data: usage }] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, amount, status, due_date, period_start, period_end, children(full_name)")
      .order("due_date", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("id, children(full_name), membership_packages(name)")
      .eq("status", "active"),
    supabase.from("subscription_usage").select("subscription_id, sessions_remaining, end_date, is_expired"),
  ]);

  const usageBySubscription = new Map((usage ?? []).map((u) => [u.subscription_id, u]));
  const activePacks = (activeSubscriptions ?? []).map((s) => ({
    ...(s as unknown as {
      id: string;
      children: { full_name: string } | null;
      membership_packages: { name: string } | null;
    }),
    usage: usageBySubscription.get(s.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tagihan</h1>
      <QueryErrorAlert error={error?.message} />

      {activePacks.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Paket Aktif</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anak</TableHead>
                <TableHead>Paket</TableHead>
                <TableHead>Sisa Sesi</TableHead>
                <TableHead>Berlaku s/d</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePacks.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.children?.full_name ?? "-"}</TableCell>
                  <TableCell>{row.membership_packages?.name ?? "-"}</TableCell>
                  <TableCell>{row.usage?.sessions_remaining ?? "-"}</TableCell>
                  <TableCell>
                    {row.usage?.end_date ?? "-"}
                    {row.usage?.is_expired ? (
                      <Badge variant="destructive" className="ml-2">
                        Kedaluwarsa
                      </Badge>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Anak</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(invoices ?? []).map((inv) => {
            const row = inv as unknown as {
              id: string;
              amount: number;
              status: string;
              due_date: string;
              period_start: string;
              period_end: string;
              children: { full_name: string } | null;
            };
            return (
              <TableRow key={row.id}>
                <TableCell>{row.children?.full_name ?? "-"}</TableCell>
                <TableCell>
                  {row.period_start} – {row.period_end}
                </TableCell>
                <TableCell>{row.due_date}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>
                  <Badge variant={INVOICE_STATUS_VARIANT[row.status] ?? "secondary"}>
                    {INVOICE_STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
          {(invoices ?? []).length === 0 ? <EmptyRow colSpan={5} message="Belum ada tagihan." /> : null}
        </TableBody>
      </Table>
    </div>
  );
}
