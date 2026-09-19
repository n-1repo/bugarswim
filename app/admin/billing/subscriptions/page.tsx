import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveChildren, getActivePackages } from "@/lib/data/lookups";
import { cancelSubscriptionForm } from "@/lib/actions/billing";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { ActionForm } from "@/components/shared/action-form";
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
import { AddSubscriptionDialog } from "@/components/billing/add-subscription-dialog";

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  paused: "Ditunda",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
};

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; packageId?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("subscriptions")
    .select("id, status, start_date, end_date, children!inner(full_name), membership_packages(name)", {
      count: "exact",
    });
  if (sp.q) query = query.ilike("children.full_name", `%${sp.q}%`);
  if (sp.status) query = query.eq("status", sp.status);
  if (sp.packageId) query = query.eq("package_id", sp.packageId);

  const [
    { data: subscriptions, count, error },
    { data: usage },
    childOptions,
    activePackages,
    { data: allPackages },
  ] = await Promise.all([
      query.order("start_date", { ascending: false }).range(from, to),
      supabase.from("subscription_usage").select("subscription_id, sessions_remaining, is_expired"),
      getActiveChildren(),
      getActivePackages(),
      supabase.from("membership_packages").select("id, name").order("name"),
    ]);

  const usageBySubscription = new Map((usage ?? []).map((u) => [u.subscription_id, u]));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Langganan</h1>
        <AddSubscriptionDialog childOptions={childOptions} packages={activePackages} />
      </div>
      <QueryErrorAlert error={error?.message} />
      <h2 className="text-xs font-semibold text-muted-foreground">Daftar Langganan</h2>
      <ListControls
        searchPlaceholder="Cari nama anak..."
        filters={[
          {
            key: "status",
            label: "Semua Status",
            options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
          },
          {
            key: "packageId",
            label: "Semua Paket",
            options: (allPackages ?? []).map((p) => ({ value: p.id, label: p.name })),
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
            <TableHead>Paket</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Sisa Sesi</TableHead>
            <TableHead>Berlaku s/d</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(subscriptions ?? []).map((s) => {
            const row = s as unknown as {
              id: string;
              status: string;
              start_date: string;
              end_date: string | null;
              children: { full_name: string } | null;
              membership_packages: { name: string } | null;
            };
            const usageRow = usageBySubscription.get(row.id);
            return (
              <TableRow key={row.id}>
                <TableCell>{row.children?.full_name ?? "-"}</TableCell>
                <TableCell>{row.membership_packages?.name ?? "-"}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{usageRow?.sessions_remaining ?? "-"}</TableCell>
                <TableCell>
                  {row.end_date ?? "-"}
                  {usageRow?.is_expired ? (
                    <Badge variant="destructive" className="ml-2">
                      Kedaluwarsa
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant={row.status === "active" ? "success" : "secondary"}>
                    {STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {row.status === "active" ? (
                    <ActionForm
                      action={cancelSubscriptionForm}
                      fields={{ subscriptionId: row.id }}
                      confirmMessage="Batalkan langganan ini? Tindakan ini tidak bisa dibatalkan."
                      successMessage="Langganan dibatalkan"
                      variant="ghost"
                      size="sm"
                    >
                      Batalkan Langganan
                    </ActionForm>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
          {(subscriptions ?? []).length === 0 ? (
            <EmptyRow colSpan={7} message="Belum ada langganan." />
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
