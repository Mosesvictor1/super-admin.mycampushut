import { useState } from "react";
import {
  Users,
  UserPlus,
  Timer,
  Zap,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { userKPIs, studentRows } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const retention = [
  { label: "Week 1", pct: 100 },
  { label: "Week 2", pct: 84 },
  { label: "Month 1", pct: 72 },
  { label: "Month 2", pct: 58 },
  { label: "Month 3", pct: 41 },
  { label: "Month 6", pct: 28 },
];

const regions = [
  { name: "Lagos", users: 26_800, delta: 22.5 },
  { name: "Abuja", users: 18_500, delta: 15.5 },
  { name: "Ibadan", users: 15_700, delta: 13.2 },
  { name: "Benin", users: 10_600, delta: 8.9 },
  { name: "Port Harcourt", users: 8_900, delta: 7.5 },
  { name: "Kano", users: 6_300, delta: 5.3 },
  { name: "Enugu", users: 5_400, delta: 4.6 },
  { name: "Kaduna", users: 4_100, delta: 3.8 },
  { name: "Jos", users: 3_200, delta: 2.9 },
  { name: "Other", users: 18_400, delta: 15.5 },
];

const kpiSpark = (seed: number, tone: string) => (
  <div className="h-14 -mx-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={Array.from({ length: 14 }, (_, i) => ({
          v: 40 + Math.sin(i * 0.7 + seed) * 14 + i * 1.2,
        }))}
        margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`sp-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone} stopOpacity={0.35} />
            <stop offset="100%" stopColor={tone} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={tone} strokeWidth={2} fill={`url(#sp-${seed})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const kpis = [
  {
    label: "New Students (30D)",
    value: userKPIs.newSignups.value.toLocaleString(),
    delta: userKPIs.newSignups.delta,
    icon: UserPlus,
    tone: "primary" as const,
    stroke: "oklch(0.62 0.17 148)",
  },
  {
    label: "30-Day Retention",
    value: `${userKPIs.retention30d.value}%`,
    delta: userKPIs.retention30d.delta,
    icon: Users,
    tone: "blue" as const,
    stroke: "oklch(0.55 0.15 240)",
  },
  {
    label: "Avg. Session Duration",
    value: userKPIs.avgSession.value,
    delta: userKPIs.avgSession.delta,
    icon: Timer,
    tone: "violet" as const,
    stroke: "oklch(0.65 0.18 300)",
  },
  {
    label: "Activation Rate",
    value: `${userKPIs.activationRate.value}%`,
    delta: userKPIs.activationRate.delta,
    icon: Zap,
    tone: "accent" as const,
    stroke: "oklch(0.72 0.18 50)",
  },
];

const toneCls: Record<"primary" | "blue" | "violet" | "accent", string> = {
  primary: "bg-primary-soft text-primary",
  blue: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
  violet: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
  accent: "bg-[oklch(0.96_0.04_50)] text-accent",
};

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 px-3 py-2 shadow-card text-[12px]">
      {label && <div className="font-medium mb-1">{label}</div>}
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Retention:
        <span className="font-semibold text-foreground tabular-nums">{payload[0].value}%</span>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  icon: Icon,
  tone,
  stroke,
  seed,
  onClick,
}: {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  tone: "primary" | "blue" | "violet" | "accent";
  stroke: string;
  seed: number;
  onClick?: () => void;
}) {
  const positive = delta >= 0;
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-border bg-card p-5 shadow-card card-hover w-full"
    >
      <div className="flex items-start gap-3">
        <div className={cn("grid h-11 w-11 place-items-center rounded-full", toneCls[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
          <div className="mt-0.5 text-[26px] font-semibold tracking-tight tabular-nums">
            {value}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11.5px]">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-semibold",
            positive ? "text-primary" : "text-destructive",
          )}
        >
          <ArrowUpRight className={cn("h-3 w-3", !positive && "rotate-90")} />
          {Math.abs(delta)}%
        </span>
        <span className="text-muted-foreground">vs previous 30 days</span>
      </div>
      {kpiSpark(seed, stroke)}
    </button>
  );
}

export default function UsersInsightsPage() {
  useDocumentTitle(
    "CampusHut Admin — User Insights",
    "Student growth, retention curves, and top regions across the CampusHut platform.",
  );
  const [regionsOpen, setRegionsOpen] = useState(false);

  return (
    <DashboardLayout
      title="User Insights"
      subtitle="Track growth, engagement, and retention."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <KpiTile
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            icon={k.icon}
            tone={k.tone}
            stroke={k.stroke}
            seed={i + 1}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Retention */}
        <div className="xl:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Student Retention Over Time</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                % of students who remain active over time
              </p>
            </div>
          </div>
          <div className="mt-4 h-[300px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retention} margin={{ top: 20, right: 20, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11.5 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<TT />} />
                <Line
                  type="monotone"
                  dataKey="pct"
                  stroke="oklch(0.62 0.17 148)"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: "oklch(0.62 0.17 148)", strokeWidth: 0 }}
                  activeDot={{ r: 7 }}
                  label={{
                    position: "top",
                    fontSize: 12,
                    fill: "oklch(0.20 0.03 250)",
                    fontWeight: 600,
                    formatter: (v: number) => `${v}%`,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RetentionTile icon={TrendingUp} value="84%" label="returned after Week 2" tone="primary" />
            <RetentionTile icon={Calendar} value="72%" label="still active after 30 days" tone="blue" />
            <RetentionTile icon={Clock} value="41%" label="active after 90 days" tone="violet" />
          </div>
        </div>

        {/* Top Regions */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Top Regions by Student Count</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Where your students are based
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1">
            {regions.slice(0, 7).map((r, i) => (
              <li
                key={r.name}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setRegionsOpen(true)}
              >
                <div
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    i === 0
                      ? "bg-[oklch(0.85_0.18_75)] text-[oklch(0.35_0.15_75)]"
                      : i === 1
                        ? "bg-[oklch(0.88_0.02_240)] text-[oklch(0.35_0.05_250)]"
                        : i === 2
                          ? "bg-[oklch(0.86_0.10_50)] text-[oklch(0.40_0.15_50)]"
                          : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </div>
                <div className="text-[13.5px] font-medium">{r.name}</div>
                <div className="ml-auto flex items-center gap-4">
                  <div className="text-[14px] font-semibold tabular-nums">
                    {r.users.toLocaleString()}
                  </div>
                  <div className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary tabular-nums w-14 justify-end">
                    <ArrowUpRight className="h-3 w-3" />
                    {r.delta}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setRegionsOpen(true)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-[13px] font-medium hover:border-primary/40 hover:bg-muted/40 transition"
          >
            View all regions
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Student Overview */}
      <div className="mt-5">
        <DataTable
          title="Student Overview"
          subtitle={`${studentRows.length} of ${studentRows.length} students`}
          perPage={8}
        />
      </div>

      {/* Regions modal */}
      <Dialog open={regionsOpen} onOpenChange={setRegionsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>All Regions</DialogTitle>
            <DialogDescription>Student count by region · last 30 days</DialogDescription>
          </DialogHeader>
          <ul className="mt-2 max-h-[420px] overflow-y-auto divide-y divide-border">
            {regions.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3 py-2.5">
                <div className="w-6 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[13.5px] font-medium">{r.name}</div>
                <div className="ml-auto flex items-center gap-4">
                  <div className="text-[13px] font-semibold tabular-nums">
                    {r.users.toLocaleString()}
                  </div>
                  <div className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary tabular-nums w-14 justify-end">
                    <ArrowUpRight className="h-3 w-3" />
                    {r.delta}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function RetentionTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone: "primary" | "blue" | "violet";
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
      <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", toneCls[tone])}>
        <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-[18px] font-semibold tabular-nums leading-none">{value}</div>
        <div className="mt-1 text-[11.5px] text-muted-foreground truncate">{label}</div>
      </div>
    </div>
  );
}
