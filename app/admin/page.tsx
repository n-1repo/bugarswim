import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getActiveChildren, getActiveCoaches, getActivePackages, getClassTypes, getLocations } from "@/lib/data/lookups";
import { StatCard } from "@/components/reports/stat-card";
import { CashflowChart } from "@/components/reports/cashflow-chart";
import { RevenueByProgramChart } from "@/components/reports/revenue-chart";
import { QuickActions } from "@/components/reports/quick-actions";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatMonth,
  formatTime,
  getJakartaDateString,
  getJakartaDayRangeIso,
} from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CASH_CATEGORY_LABEL: Record<string, string> = {
  payment_received: "Pembayaran Diterima",
  payroll: "Gaji Pelatih",
  manual_adjustment: "Penyesuaian Manual",
};

interface ExpiringSubRow {
  id: string;
  end_date: string | null;
  children: { full_name: string } | null;
  membership_packages: { name: string } | null;
}

interface OverdueInvoiceRow {
  id: string;
  amount: number;
  due_date: string;
  children: { full_name: string } | null;
}

interface TodayClassRow {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  profiles: { full_name: string } | null;
  locations: { name: string } | null;
  class_types: { name: string } | null;
  bookings: { id: string }[];
}

interface RecentCashRow {
  id: string;
  entry_date: string;
  category: string;
  direction: string;
  amount: number;
  reason: string | null;
}

interface ActivePromoRow {
  id: string;
  title: string;
  active_from: string;
  active_until: string | null;
}

const LINK_CLASS = "text-sm font-medium text-primary underline-offset-2 hover:underline";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { startIso: todayStartIso, endIso: todayEndIso } = getJakartaDayRangeIso();
  const todayStr = getJakartaDateString();
  const plus7Str = getJakartaDateString(7);
  const nowIso = new Date().toISOString();

  const [
    { data: revenue, error: revenueError },
    { data: outstanding, error: outstandingError },
    { data: cashFlow, error: cashFlowError },
    { data: revenueByProgram, error: revenueByProgramError },
    { data: payrollCost, error: payrollCostError },
    { data: memberCounts, error: memberCountsError },
    { data: cashBalanceRow, error: cashBalanceError },
    { count: activeSubscriptionCount, error: activeSubscriptionError },
    { data: expiringSubsData, error: expiringSubsError },
    { data: overdueInvoicesData, error: overdueInvoicesError },
    { data: todaysClassesData, error: todaysClassesError },
    { data: recentCashData, error: recentCashError },
    { data: activePromosData, error: activePromosError },
    locations,
    coaches,
    classTypes,
    activeChildren,
    activePackages,
  ] = await Promise.all([
    supabase.from("report_revenue").select("month, revenue"),
    supabase.from("report_outstanding").select("outstanding_count, outstanding_amount").maybeSingle(),
    supabase.from("report_cash_flow").select("month, cash_in, cash_out, net"),
    supabase.from("report_revenue_by_program").select("package_name, revenue"),
    supabase.from("report_payroll_cost").select("month, payroll_cost"),
    supabase.from("report_member_counts").select("active_children, inactive_children").maybeSingle(),
    supabase.from("cash_ledger_with_balance").select("running_balance").order("entry_date", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("subscriptions")
      .select("id, end_date, children(full_name), membership_packages(name)")
      .eq("status", "active")
      .not("end_date", "is", null)
      .gte("end_date", todayStr)
      .lte("end_date", plus7Str)
      .order("end_date"),
    supabase
      .from("invoices")
      .select("id, amount, due_date, children(full_name)")
      .eq("status", "outstanding")
      .lt("due_date", todayStr)
      .order("due_date"),
    supabase
      .from("classes")
      .select("id, start_time, end_time, capacity, profiles(full_name), locations(name), class_types(name), bookings(id)")
      .gte("start_time", todayStartIso)
      .lt("start_time", todayEndIso)
      .order("start_time"),
    supabase
      .from("cash_ledger_with_balance")
      .select("id, entry_date, category, direction, amount, reason")
      .order("entry_date", { ascending: false })
      .limit(6),
    supabase
      .from("promo")
      .select("id, title, active_from, active_until")
      .lte("active_from", nowIso)
      .or(`active_until.is.null,active_until.gte.${nowIso}`)
      .order("active_from", { ascending: false }),
    getLocations(),
    getActiveCoaches(),
    getClassTypes(),
    getActiveChildren(),
    getActivePackages(),
  ]);

  const queryError = [
    revenueError,
    outstandingError,
    cashFlowError,
    revenueByProgramError,
    payrollCostError,
    memberCountsError,
    cashBalanceError,
    activeSubscriptionError,
    expiringSubsError,
    overdueInvoicesError,
    todaysClassesError,
    recentCashError,
    activePromosError,
  ].find(Boolean);

  const totalRevenue = (revenue ?? []).reduce((sum, r) => sum + Number(r.revenue), 0);
  const totalPayrollCost = (payrollCost ?? []).reduce((sum, r) => sum + Number(r.payroll_cost), 0);
  const cashBalance = Number(cashBalanceRow?.running_balance ?? 0);

  const expiringSubs = (expiringSubsData ?? []) as unknown as ExpiringSubRow[];
  const overdueInvoices = (overdueInvoicesData ?? []) as unknown as OverdueInvoiceRow[];
  const todaysClasses = (todaysClassesData ?? []) as unknown as TodayClassRow[];
  const recentCash = (recentCashData ?? []) as unknown as RecentCashRow[];
  const activePromos = (activePromosData ?? []) as unknown as ActivePromoRow[];
  const overdueSum = overdueInvoices.reduce((sum, i) => sum + Number(i.amount), 0);

  const cashFlowData = (cashFlow ?? []).map((c) => ({
    month: formatMonth(c.month),
    cash_in: Number(c.cash_in),
    cash_out: Number(c.cash_out),
    net: Number(c.net),
  }));

  const revenueByProgramData = (revenueByProgram ?? []).map((r) => ({
    package_name: r.package_name,
    revenue: Number(r.revenue),
  }));

  const alerts: { message: string; href: string }[] = [];
  if (overdueInvoices.length > 0) {
    alerts.push({
      message: `${overdueInvoices.length} tagihan jatuh tempo senilai ${formatCurrency(overdueSum)}`,
      href: "/admin/billing/invoices?status=outstanding",
    });
  }
  if (expiringSubs.length > 0) {
    alerts.push({
      message: `${expiringSubs.length} langganan akan berakhir dalam 7 hari`,
      href: "/admin/billing/subscriptions?status=active",
    });
  }
  if (cashBalance < 0) {
    alerts.push({ message: `Saldo kas negatif: ${formatCurrency(cashBalance)}`, href: "/admin/cash-ledger" });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <QueryErrorAlert error={queryError?.message} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Pendapatan" value={formatCurrency(totalRevenue)} />
        <StatCard
          title="Tagihan Belum Bayar"
          value={`${outstanding?.outstanding_count ?? 0} (${formatCurrency(outstanding?.outstanding_amount ?? 0)})`}
        />
        <StatCard title="Total Biaya Gaji" value={formatCurrency(totalPayrollCost)} />
        <StatCard
          title="Anggota Aktif / Nonaktif"
          value={`${memberCounts?.active_children ?? 0} / ${memberCounts?.inactive_children ?? 0}`}
        />
        <StatCard title="Saldo Kas" value={formatCurrency(cashBalance)} />
        <StatCard title="Langganan Aktif" value={String(activeSubscriptionCount ?? 0)} />
        <StatCard
          title="Tagihan Jatuh Tempo"
          value={`${overdueInvoices.length} (${formatCurrency(overdueSum)})`}
        />
        <StatCard title="Kelas Hari Ini" value={String(todaysClasses.length)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perlu Perhatian</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {alerts.map((a) => (
                <li key={a.href + a.message}>
                  <Link href={a.href} className={LINK_CLASS}>
                    {a.message}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada yang perlu diperhatikan saat ini.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Arus Kas Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <CashflowChart data={cashFlowData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendapatan per Program</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueByProgramChart data={revenueByProgramData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Peserta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>
                      {formatTime(cls.start_time)}–{formatTime(cls.end_time)}
                    </TableCell>
                    <TableCell>
                      {cls.class_types?.name ?? "-"} · {cls.profiles?.full_name ?? "-"}
                    </TableCell>
                    <TableCell>
                      {cls.bookings?.length ?? 0} / {cls.capacity}
                    </TableCell>
                  </TableRow>
                ))}
                {todaysClasses.length === 0 ? (
                  <EmptyRow colSpan={3} message="Tidak ada kelas hari ini." />
                ) : null}
              </TableBody>
            </Table>
            <Link href="/admin/schedule" className={LINK_CLASS}>
              Lihat semua jadwal →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Langganan Segera Berakhir</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anak</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Berakhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringSubs.slice(0, 5).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.children?.full_name ?? "-"}</TableCell>
                    <TableCell>{s.membership_packages?.name ?? "-"}</TableCell>
                    <TableCell>{s.end_date ? formatDate(s.end_date) : "-"}</TableCell>
                  </TableRow>
                ))}
                {expiringSubs.length === 0 ? (
                  <EmptyRow colSpan={3} message="Tidak ada langganan yang segera berakhir." />
                ) : null}
              </TableBody>
            </Table>
            <Link href="/admin/billing/subscriptions?status=active" className={LINK_CLASS}>
              Lihat semua langganan →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tagihan Jatuh Tempo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anak</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueInvoices.slice(0, 5).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.children?.full_name ?? "-"}</TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>{formatDate(inv.due_date)}</TableCell>
                  </TableRow>
                ))}
                {overdueInvoices.length === 0 ? (
                  <EmptyRow colSpan={3} message="Tidak ada tagihan jatuh tempo." />
                ) : null}
              </TableBody>
            </Table>
            <Link href="/admin/billing/invoices?status=outstanding" className={LINK_CLASS}>
              Lihat semua tagihan →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Kas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCash.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{formatDateTime(e.entry_date)}</TableCell>
                    <TableCell>
                      <Badge variant={e.direction === "in" ? "success" : "secondary"}>
                        {CASH_CATEGORY_LABEL[e.category] ?? e.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(e.amount)}</TableCell>
                  </TableRow>
                ))}
                {recentCash.length === 0 ? <EmptyRow colSpan={3} message="Belum ada transaksi." /> : null}
              </TableBody>
            </Table>
            <Link href="/admin/cash-ledger" className={LINK_CLASS}>
              Lihat buku kas →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biaya Gaji per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead>Biaya Gaji</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payrollCost ?? []).map((p) => (
                  <TableRow key={p.month}>
                    <TableCell>{formatMonth(p.month)}</TableCell>
                    <TableCell>{formatCurrency(p.payroll_cost)}</TableCell>
                  </TableRow>
                ))}
                {(payrollCost ?? []).length === 0 ? (
                  <EmptyRow colSpan={2} message="Belum ada data gaji." />
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promo Aktif</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {activePromos.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {activePromos.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="text-sm">{p.title}</span>
                    <Badge variant="success">Aktif</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada promo aktif.</p>
            )}
            <Link href="/admin/promo" className={LINK_CLASS}>
              Kelola promo →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActions
            locations={locations}
            coaches={coaches}
            classTypes={classTypes}
            childOptions={activeChildren}
            packages={activePackages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
