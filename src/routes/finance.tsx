import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, Users, PieChart as PieIcon, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MiniStat } from "@/components/dashboard/MiniStat";
import {
  financeKPIs,
  revenueTrend,
  revenueByPlan,
  paymentMethods,
  transactions,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Finance & Subscription" }] }),
  component: FinancePage,
});

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 px-3 py-2 shadow-card text-[12px]">
      {label && <div className="font-medium mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            ₦{Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

const statusStyle = {
  Success: { cls: "bg-primary-soft text-primary ring-primary/20", Icon: CheckCircle2 },
  Failed: { cls: "bg-[oklch(0.96_0.06_27)] text-destructive ring-destructive/20", Icon: XCircle },
  Refunded: { cls: "bg-[oklch(0.96_0.04_50)] text-accent ring-accent/20", Icon: RotateCcw },
} as const;

function FinancePage() {
  return (
    <DashboardLayout title="Finance & Subscription" subtitle="MRR, revenue, churn, and payments across all plans">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={Wallet} tone="primary" label="MRR" value={financeKPIs.mrr.value} delta={financeKPIs.mrr.delta} />
        <MiniStat icon={TrendingUp} tone="blue" label="ARR" value={financeKPIs.arr.value} delta={financeKPIs.arr.delta} />
        <MiniStat icon={Users} tone="violet" label="ARPU" value={financeKPIs.arpu.value} delta={financeKPIs.arpu.delta} />
        <MiniStat icon={PieIcon} tone="accent" label="Churn Rate" value={financeKPIs.churn.value} delta={financeKPIs.churn.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard
            title="Revenue vs Target"
            description="Monthly recurring revenue (₦) · trailing 12 months"
            action={
              <div className="flex items-center gap-3 text-[11.5px]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />Target</span>
              </div>
            }
          >
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gRev)" />
                  <Line type="monotone" dataKey="target" stroke="oklch(0.72 0.18 50)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Revenue by Plan" description="Contribution to MRR">
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByPlan} dataKey="value" innerRadius={62} outerRadius={86} paddingAngle={3} stroke="none">
                  {revenueByPlan.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip content={<TT />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">MRR</div>
              <div className="text-xl font-semibold tabular-nums">₦84.2k</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {revenueByPlan.map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-[12.5px]">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="tabular-nums font-semibold">₦{p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Payment Methods" description="Share of successful transactions">
          <div className="h-[240px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethods} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip cursor={{ fill: "oklch(0.96 0.01 240)" }} />
                <Bar dataKey="value" fill="oklch(0.55 0.15 240)" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Recent Transactions</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Latest {transactions.length} payment events</p>
            </div>
            <button className="text-[12px] text-primary hover:underline">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Txn ID</th>
                  <th className="text-left font-medium px-5 py-3">User</th>
                  <th className="text-left font-medium px-5 py-3">Amount</th>
                  <th className="text-left font-medium px-5 py-3">Method</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-left font-medium px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const s = statusStyle[t.status];
                  return (
                    <tr key={t.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-[12px] text-muted-foreground">{t.id}</td>
                      <td className="px-5 py-3 font-medium">{t.user}</td>
                      <td className="px-5 py-3 tabular-nums font-semibold">₦{t.amount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-muted-foreground">{t.method}</td>
                      <td className="px-5 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset", s.cls)}>
                          <s.Icon className="h-3 w-3" />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground tabular-nums">{t.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
