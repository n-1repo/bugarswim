"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface RevenueByProgramPoint {
  package_name: string;
  revenue: number;
}

const compactRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function RevenueByProgramChart({ data }: { data: RevenueByProgramPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="package_name" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={(value: number) => compactRupiah.format(value)} width={80} />
          <Tooltip formatter={(value) => fullRupiah.format(Number(value))} />
          <Bar dataKey="revenue" fill="var(--color-primary)" name="Pendapatan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
