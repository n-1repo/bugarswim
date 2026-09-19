import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/reports/stat-card";
import { CashflowChart } from "@/components/reports/cashflow-chart";
import { RevenueByProgramChart } from "@/components/reports/revenue-chart";
import { EmptyRow } from "@/components/shared/empty-row";
import { QueryErrorAlert } from "@/components/shared/query-error-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatMonth } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const [
    { data: revenue, error: revenueError },
    { data: outstanding, error: outstandingError },
    { data: cashFlow, error: cashFlowError },
    { data: revenueByProgram, error: revenueByProgramError },
    { data: payrollCost, error: payrollCostError },
    { data: memberCounts, error: memberCountsError },
  ] = await Promise.all([
    supabase.from("report_revenue").select("month, revenue"),
    supabase.from("report_outstanding").select("outstanding_count, outstanding_amount").maybeSingle(),
    supabase.from("report_cash_flow").select("month, cash_in, cash_out, net"),
    supabase.from("report_revenue_by_program").select("package_name, revenue"),
    supabase.from("report_payroll_cost").select("month, payroll_cost"),
    supabase.from("report_member_counts").select("active_children, inactive_children").maybeSingle(),
  ]);

  const queryError =
    revenueError ??
    outstandingError ??
    cashFlowError ??
    revenueByProgramError ??
    payrollCostError ??
    memberCountsError;

  const totalRevenue = (revenue ?? []).reduce((sum, r) => sum + Number(r.revenue), 0);
  const totalPayrollCost = (payrollCost ?? []).reduce((sum, r) => sum + Number(r.payroll_cost), 0);

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

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <QueryErrorAlert error={queryError?.message} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
    </div>
  );
}
