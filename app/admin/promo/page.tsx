import { createServerSupabaseClient } from "@/lib/supabase/server";
import { deletePromoForm } from "@/lib/actions/promo";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { ActionForm } from "@/components/shared/action-form";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PromoForm } from "@/components/promo/promo-form";

export default async function PromoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();
  const nowIso = new Date().toISOString();

  let query = supabase
    .from("promo")
    .select("id, title, body, image_url, active_from, active_until", { count: "exact" });
  if (sp.q) query = query.or(`title.ilike.%${sp.q}%,body.ilike.%${sp.q}%`);
  if (sp.status === "active") {
    query = query.lte("active_from", nowIso).or(`active_until.is.null,active_until.gte.${nowIso}`);
  } else if (sp.status === "inactive") {
    query = query.or(`active_from.gt.${nowIso},active_until.lt.${nowIso}`);
  }

  const { data: promos, count, error } = await query.order("active_from", { ascending: false }).range(from, to);

  const now = new Date();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Promo</h1>
      <QueryErrorAlert error={error?.message} />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Tambah Promo Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoForm />
        </CardContent>
      </Card>

      <h2 className="text-xs font-semibold text-muted-foreground">Semua Promo</h2>
      <ListControls
        searchPlaceholder="Cari judul atau isi..."
        filters={[
          {
            key: "status",
            label: "Semua Status",
            options: [
              { value: "active", label: "Aktif" },
              { value: "inactive", label: "Tidak Aktif" },
            ],
          },
        ]}
        totalItems={count ?? 0}
        page={page}
        pageSize={pageSize}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {(promos ?? []).map((p) => {
          const isActive =
            new Date(p.active_from) <= now && (!p.active_until || new Date(p.active_until) >= now);
          return (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{p.title}</CardTitle>
                <Badge variant={isActive ? "success" : "secondary"}>
                  {isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">{p.body}</p>
                <ActionForm
                  action={deletePromoForm}
                  fields={{ promoId: p.id }}
                  confirmMessage="Hapus promo ini? Tindakan ini tidak bisa dibatalkan."
                  successMessage="Promo dihapus"
                  variant="destructive"
                  size="sm"
                >
                  Hapus
                </ActionForm>
              </CardContent>
            </Card>
          );
        })}
        {(promos ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada promo.</p>
        ) : null}
      </div>
    </div>
  );
}
