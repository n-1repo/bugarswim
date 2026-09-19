"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";

export interface CashFlowPoint {
  month: string;
  cash_in: number;
  cash_out: number;
  net: number;
}

export function CashflowChart({ data }: { data: CashFlowPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" fontSize={12} stroke="var(--color-muted-foreground)" tick={{ fill: "var(--color-muted-foreground)" }} />
          <YAxis
            fontSize={12}
            tickFormatter={(value: number) => formatCurrencyCompact(value)}
            width={80}
            stroke="var(--color-muted-foreground)"
            tick={{ fill: "var(--color-muted-foreground)" }}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-card-foreground)",
            }}
          />
          <Line type="monotone" dataKey="cash_in" stroke="var(--color-success)" name="Masuk" strokeWidth={2} />
          <Line type="monotone" dataKey="cash_out" stroke="var(--color-destructive)" name="Keluar" strokeWidth={2} />
          <Line type="monotone" dataKey="net" stroke="var(--color-primary)" name="Bersih" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
