"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";

export interface RevenueByProgramPoint {
  package_name: string;
  revenue: number;
}

export function RevenueByProgramChart({ data }: { data: RevenueByProgramPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="package_name" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(value: number) => formatCurrencyCompact(value)} width={80} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="revenue" fill="var(--color-primary)" name="Pendapatan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
