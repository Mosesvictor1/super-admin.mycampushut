import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserPlus,
  Timer,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
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
import { DataTable } from "@/components/dashboard/DataTable";
import {
  userKPIs,
  dailyActive,
  cohortRetention,
  geoDistribution,
  deviceSplit,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Users Analytics" }] }),
  component: UsersPage,
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
            {Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function heatColor(v: number) {
  if (v === 0) return "bg-muted/40 text-muted-foreground/40";
  if (v >= 80) return "bg-[oklch(0.55_0.17_148)] text-white";
  if (v >= 65) return "bg-[oklch(0.68_0.16_148)] text-white";
  if (v >= 50) return "bg-[oklch(0.80_0.13_148)] text-[oklch(0.25_0.05_155)]";
  if (v >= 35) return "bg-[oklch(0.90_0.09_148)] text-[oklch(0.25_0.05_155)]";
  return "bg-primary-soft text-primary";
}

const deviceIcons = { Mobile: Smartphone, Desktop: Monitor, Tablet: Tablet } as const;

function UsersPage() {
  return (
    <DashboardLayout title="Users Analytics" subtitle="Student growth, retention, cohorts, and engagement">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={UserPlus} tone="primary" label="New Signups (30d)" value={userKPIs.newSignups.value.toLocaleString()} delta={userKPIs.newSignups.delta} />
        <MiniStat icon={Users} tone="blue" label="30-day Retention" value={userKPIs.retention30d.value} suffix="%" delta={userKPIs.retention30d.delta} />
        <MiniStat icon={Timer} tone="violet" label="Avg. Session" value={userKPIs.avgSession.value} delta={userKPIs.avgSession.delta} />
        <MiniStat icon={Zap} tone="accent" label="Activation Rate" value={userKPIs.activationRate.value} suffix="%" delta={userKPIs.activationRate.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="Daily & Weekly Active Users" description="DAU vs WAU · last 7 days">
            <div className="h-[280px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActive} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gDAU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gWAU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="wau" stroke="oklch(0.55 0.15 240)" strokeWidth={2} fill="url(#gWAU)" />
                  <Area type="monotone" dataKey="dau" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gDAU)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Device Split" description="Session distribution by device">
          <div className="relative h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceSplit} dataKey="value" innerRadius={54} outerRadius={78} paddingAngle={3} stroke="none">
                  {deviceSplit.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<TT />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {deviceSplit.map((d) => {
              const Icon = deviceIcons[d.name as keyof typeof deviceIcons];
              return (
                <div key={d.name} className="flex items-center gap-3 rounded-lg border border-border p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[12.5px] font-medium">{d.name}</span>
                  <span className="ml-auto tabular-nums text-sm font-semibold">{d.value}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="Cohort Retention" description="% of users returning by cohort week">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left font-medium py-2 pr-4">Cohort</th>
                    {["W1", "W2", "W3", "W4", "W8", "W12"].map((w) => (
                      <th key={w} className="font-medium py-2 px-1 text-center">{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohortRetention.map((r) => (
                    <tr key={r.cohort} className="border-t border-border">
                      <td className="py-2 pr-4 font-medium">{r.cohort}</td>
                      {[r.w1, r.w2, r.w3, r.w4, r.w8, r.w12].map((v, i) => (
                        <td key={i} className="px-1 py-1">
                          <div className={cn("grid h-8 place-items-center rounded-md text-[11.5px] font-semibold tabular-nums", heatColor(v))}>
                            {v ? `${v}%` : "—"}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Geo Distribution" description="Top regions by users">
          <div className="h-[280px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoDistribution} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                <YAxis type="category" dataKey="region" tickLine={false} axisLine={false} width={90} tick={{ fill: "oklch(0.30 0.03 250)", fontSize: 11.5 }} />
                <Tooltip content={<TT />} cursor={{ fill: "oklch(0.96 0.01 240)" }} />
                <Bar dataKey="users" fill="oklch(0.62 0.17 148)" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-5">
        <DataTable />
      </div>
    </DashboardLayout>
  );
}
