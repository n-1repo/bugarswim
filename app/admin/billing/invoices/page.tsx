import { createServerSupabaseClient } from "@/lib/supabase/server";
import { markInvoicePaidForm, voidInvoiceForm } from "@/lib/actions/billing";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { ActionForm } from "@/components/shared/action-form";
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

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("invoices")
    .select("id, amount, status, due_date, period_start, period_end, children!inner(full_name)", {
      count: "exact",
    });
  if (sp.q) query = query.ilike("children.full_name", `%${sp.q}%`);
  if (sp.status) query = query.eq("status", sp.status);

  const { data: invoices, count, error } = await query.order("due_date", { ascending: false }).range(from, to);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Tagihan</h1>
      <QueryErrorAlert error={error?.message} />
      <h2 className="text-xs font-semibold text-muted-foreground">Daftar Tagihan</h2>
      <ListControls
        searchPlaceholder="Cari nama anak..."
        filters={[
          {
            key: "status",
            label: "Semua Status",
            options: Object.entries(INVOICE_STATUS_LABEL).map(([value, label]) => ({ value, label })),
          },
        ]}
        totalItems={count ?? 0}
        page={page}
        pageSize={pageSize}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Anak</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
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
                <TableCell>
                  {row.status === "outstanding" ? (
                    <div className="flex gap-2">
                      <ActionForm
                        action={markInvoicePaidForm}
                        fields={{ invoiceId: row.id }}
                        successMessage="Tagihan ditandai lunas"
                        size="sm"
                      >
                        Tandai Lunas
                      </ActionForm>
                      <ActionForm
                        action={voidInvoiceForm}
                        fields={{ invoiceId: row.id }}
                        confirmMessage="Batalkan tagihan ini? Tindakan ini tidak bisa dibatalkan."
                        successMessage="Tagihan dibatalkan"
                        size="sm"
                        variant="ghost"
                      >
                        Batalkan Tagihan
                      </ActionForm>
                    </div>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
          {(invoices ?? []).length === 0 ? <EmptyRow colSpan={6} message="Belum ada tagihan." /> : null}
        </TableBody>
      </Table>
    </div>
  );
}
