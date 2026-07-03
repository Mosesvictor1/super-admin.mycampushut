import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import {
  studentGrowth as growthData,
  planDistribution as plans,
  topUniversities as universities,
  applicationFunnel as funnel,
} from "@/lib/mock-data";

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 backdrop-blur px-3 py-2 shadow-card text-[12px]">
      {label && <div className="font-medium text-foreground mb-1">{label}</div>}
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

export function StudentGrowthChart() {
  return (
    <ChartCard
      title="Student Growth Trend"
      description="Total students vs daily active users · last 12 months"
      action={
        <div className="flex items-center gap-3 text-[11.5px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Students
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" /> DAU
          </span>
        </div>
      }
    >
      <div className="h-[300px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="gStu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.18 50)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="oklch(0.72 0.18 50)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<TooltipBox />} cursor={{ stroke: "oklch(0.62 0.17 148)", strokeOpacity: 0.2 }} />
            <Area type="monotone" dataKey="students" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gStu)" />
            <Area type="monotone" dataKey="active" stroke="oklch(0.72 0.18 50)" strokeWidth={2} fill="url(#gAct)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function PlanDonutChart() {
  const total = plans.reduce((a, b) => a + b.value, 0);
  return (
    <ChartCard
      title="Subscription Plans"
      description="Distribution across 3,421 active subscriptions"
    >
      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={plans}
              dataKey="value"
              innerRadius={62}
              outerRadius={86}
              paddingAngle={3}
              stroke="none"
            >
              {plans.map((p, i) => (
                <Cell key={i} fill={p.color} />
              ))}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Total
          </div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums">
            {total}%
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {plans.map((p) => (
          <div key={p.name} className="rounded-lg border border-border p-2">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </div>
            <div className="mt-0.5 text-sm font-semibold tabular-nums">{p.value}%</div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

export function UniversitiesBarChart() {
  return (
    <ChartCard
      title="Top Universities"
      description="By student registration (last 90 days)"
    >
      <div className="h-[280px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={universities} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gBar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.62 0.17 148)" />
                <stop offset="100%" stopColor="oklch(0.75 0.16 148)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={110} tick={{ fill: "oklch(0.30 0.03 250)", fontSize: 12 }} />
            <Tooltip content={<TooltipBox />} cursor={{ fill: "oklch(0.96 0.01 240)" }} />
            <Bar dataKey="v" fill="url(#gBar)" radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ApplicationFunnel() {
  const max = funnel[0].v;
  return (
    <ChartCard
      title="Application Funnel"
      description="Applied → Reviewed → Shortlisted → Hired"
    >
      <div className="space-y-3">
        {funnel.map((s, i) => {
          const pct = (s.v / max) * 100;
          const conv = i === 0 ? 100 : (s.v / funnel[i - 1].v) * 100;
          return (
            <div key={s.stage}>
              <div className="flex items-center justify-between text-[12px] mb-1.5">
                <span className="font-medium text-foreground">{s.stage}</span>
                <span className="text-muted-foreground tabular-nums">
                  {s.v.toLocaleString()}
                  <span className="ml-2 text-[11px] rounded-full bg-muted px-1.5 py-0.5">
                    {conv.toFixed(1)}%
                  </span>
                </span>
              </div>
              <div className="relative h-9 overflow-hidden rounded-xl bg-muted/60">
                <div
                  className="h-full rounded-xl transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${s.c} 0%, color-mix(in oklab, ${s.c} 60%, white) 100%)`,
                    boxShadow: `0 6px 18px -6px ${s.c}`,
                  }}
                />
              </div>
            </div>
          );
        })}
        <div className="mt-2 grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="rounded-lg bg-muted/40 p-2.5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Overall conversion
            </div>
            <div className="text-lg font-semibold text-primary tabular-nums">6.4%</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2.5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Avg time to hire
            </div>
            <div className="text-lg font-semibold tabular-nums">11.2d</div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
