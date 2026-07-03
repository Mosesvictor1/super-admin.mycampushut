import { createFileRoute } from "@tanstack/react-router";
import {
  Server,
  Activity,
  Zap,
  Database,
  Cloud,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/platform")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Platform Overview" }] }),
  component: PlatformPage,
});

const latency = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}:00`,
  api: 90 + Math.sin(i * 0.5) * 18 + (i > 14 && i < 20 ? 40 : 0),
  db: 45 + Math.cos(i * 0.4) * 10 + (i > 15 && i < 19 ? 22 : 0),
}));

const services = [
  { name: "API Gateway", uptime: 99.98, latency: "112 ms", status: "Operational" },
  { name: "Auth Service", uptime: 99.99, latency: "84 ms", status: "Operational" },
  { name: "Payments Worker", uptime: 99.82, latency: "246 ms", status: "Degraded" },
  { name: "AI Inference", uptime: 99.94, latency: "412 ms", status: "Operational" },
  { name: "Media CDN", uptime: 99.97, latency: "58 ms", status: "Operational" },
  { name: "Realtime WS", uptime: 99.91, latency: "72 ms", status: "Operational" },
] as const;

const statusCls: Record<(typeof services)[number]["status"], string> = {
  Operational: "bg-primary-soft text-primary ring-primary/20",
  Degraded: "bg-[oklch(0.96_0.04_50)] text-accent ring-accent/30",
};

function PlatformPage() {
  return (
    <DashboardLayout title="Platform Overview" subtitle="Infrastructure health, latency, and reliability across services">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={Activity} tone="primary" label="Overall Uptime" value="99.96" suffix="%" delta={0.04} />
        <MiniStat icon={Zap} tone="blue" label="Avg. API Latency" value="112" suffix="ms" delta={-4.2} />
        <MiniStat icon={Database} tone="violet" label="DB Query p95" value="68" suffix="ms" delta={2.1} />
        <MiniStat icon={Cloud} tone="accent" label="Error Rate" value="0.14" suffix="%" delta={-0.6} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard
            title="Latency — last 24h"
            description="API and database response time"
            action={
              <div className="flex items-center gap-3 text-[11.5px]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />API</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.18_300)]" />DB</span>
              </div>
            }
          >
            <div className="h-[280px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latency} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gApi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gDb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 10 }} interval={2} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `${v} ms`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="api" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gApi)" />
                  <Area type="monotone" dataKey="db" stroke="oklch(0.65 0.18 300)" strokeWidth={2} fill="url(#gDb)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Compute & Storage" description="Live resource utilization">
          <div className="space-y-4">
            {[
              { icon: Cpu, label: "CPU", value: 62, note: "12 nodes · us-east-1" },
              { icon: Server, label: "Memory", value: 48, note: "128 GB provisioned" },
              { icon: Database, label: "DB Connections", value: 74, note: "148 / 200" },
              { icon: ShieldCheck, label: "Cache Hit Rate", value: 92, note: "Redis · 1.8 GB" },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center gap-2 text-[12.5px]">
                  <r.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{r.label}</span>
                  <span className="ml-auto tabular-nums font-semibold">{r.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      r.value >= 80 ? "bg-destructive" : r.value >= 60 ? "bg-accent" : "bg-primary",
                    )}
                    style={{ width: `${r.value}%` }}
                  />
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{r.note}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-[15px] font-semibold tracking-tight">Service Health</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Live status across microservices</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Service</th>
                  <th className="text-left font-medium px-5 py-3">Uptime (30d)</th>
                  <th className="text-left font-medium px-5 py-3">Latency</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.name} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{s.name}</td>
                    <td className="px-5 py-3.5 tabular-nums">{s.uptime}%</td>
                    <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{s.latency}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                        statusCls[s.status],
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          s.status === "Operational" ? "bg-primary" : "bg-accent",
                        )} />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AlertCard />
      </div>

      <div className="mt-5">
        <ActivityFeed />
      </div>
    </DashboardLayout>
  );
}
