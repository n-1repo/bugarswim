import { createServerSupabaseClient } from "@/lib/supabase/server";
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

export default async function PackagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: packages } = await supabase
    .from("membership_packages")
    .select("id, name, price, sessions_included, validity_weeks, is_active")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Paket Keanggotaan</h1>
      <h2 className="text-sm font-semibold text-muted-foreground">Daftar Paket</h2>
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
