import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/list-params";
import { ListControls } from "@/components/shared/list-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PackageForm } from "@/components/billing/package-form";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; pageSize?: string }>;
}) {
  const sp = await searchParams;
  const { page, pageSize, from, to } = parsePagination(sp);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("membership_packages")
    .select("id, name, price, sessions_included, validity_weeks, is_active", { count: "exact" });
  if (sp.q) query = query.ilike("name", `%${sp.q}%`);
  if (sp.status) query = query.eq("is_active", sp.status === "active");

  const { data: packages, count } = await query.order("name").range(from, to);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Paket Keanggotaan</h1>
      <h2 className="text-sm font-semibold text-muted-foreground">Daftar Paket</h2>
      <ListControls
        searchPlaceholder="Cari nama paket..."
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
            <TableHead>Harga</TableHead>
            <TableHead>Sesi</TableHead>
            <TableHead>Masa Berlaku</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(packages ?? []).map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>Rp {Number(p.price).toLocaleString("id-ID")}</TableCell>
              <TableCell>{p.sessions_included ?? "-"}</TableCell>
              <TableCell>{p.validity_weeks} minggu</TableCell>
            </TableRow>
          ))}
          {(packages ?? []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada paket.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Tambah Paket Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <PackageForm />
        </CardContent>
      </Card>
    </div>
  );
}
