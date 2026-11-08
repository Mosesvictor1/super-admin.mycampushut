import { Activity, BadgeCheck, Bell, GraduationCap, Users } from "lucide-react";
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
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardQueryState } from "@/components/dashboard/DashboardQueryState";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePlatformOverview } from "@/lib/dashboard-api";
import { useDashboardDateRange } from "@/components/dashboard/dashboard-date-range-context";
import type { DashboardExportData } from "@/lib/dashboard-export";

const chartColors = [
  "oklch(0.62 0.17 148)",
  "oklch(0.55 0.15 240)",
  "oklch(0.65 0.18 300)",
  "oklch(0.72 0.18 50)",
  "oklch(0.62 0.17 27)",
];

const count = (value?: number) => value?.toLocaleString() ?? "—";

export default function PlatformPage() {
  useDocumentTitle("CampusHut Admin — Platform Overview");
  const { filters } = useDashboardDateRange();
  const { data, isLoading, error, refetch } = usePlatformOverview(filters);
  const summary = data?.summary;
  const exportData: DashboardExportData | undefined = data
    ? {
        reportTitle: "Platform Overview",
        rangeLabel: "Last 30 days",
        filters,
        summary: [
          { metric: "Total students", value: summary?.totalStudents ?? "—" },
          { metric: "Daily active users", value: summary?.dailyActiveUsers ?? "—" },
          { metric: "Monthly active users", value: summary?.monthlyActiveUsers ?? "—" },
          { metric: "Active subscriptions", value: summary?.activeSubscriptions ?? "—" },
        ],
        sheets: [
          {
            name: "Growth Trend",
            columns: [
              { header: "Month", key: "month" },
              { header: "Total students", key: "totalStudents" },
              { header: "Daily active users", key: "dailyActiveUsers" },
            ],
            rows: data.growthTrend ?? [],
          },
          {
            name: "Subscriptions",
            columns: [
              { header: "Plan", key: "plan" },
              { header: "Count", key: "count" },
              { header: "Percentage", key: "percentage" },
            ],
            rows: data.subscriptionDistribution ?? [],
          },
          {
            name: "Top Universities",
            columns: [
              { header: "University", key: "university" },
              { header: "Student count", key: "studentCount" },
            ],
            rows: data.topUniversities ?? [],
          },
          {
            name: "Critical Alerts",
            columns: [
              { header: "Type", key: "alertType" },
              { header: "Title", key: "title" },
              { header: "Description", key: "description", width: 48 },
              { header: "Count", key: "count" },
              { header: "Severity", key: "severity" },
            ],
            rows: data.criticalAlerts ?? [],
          },
          {
            name: "Recent Activity",
            columns: [
              { header: "Event type", key: "eventType" },
              { header: "Description", key: "description", width: 48 },
              { header: "Occurred at", key: "occurredAt", width: 24 },
            ],
            rows: data.recentActivity ?? [],
          },
        ],
      }
    : undefined;

  return (
    <DashboardLayout
      title="Platform Overview"
      subtitle="Student growth, activity, and subscription health"
      exportData={exportData}
    >
      <DashboardQueryState isLoading={isLoading} error={error} onRetry={() => void refetch()}>
        {data && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniStat
                icon={GraduationCap}
                label="Total Students"
                value={count(summary?.totalStudents)}
                tone="primary"
              />
              <MiniStat
                icon={Activity}
                label="Daily Active Users"
                value={count(summary?.dailyActiveUsers)}
                tone="blue"
              />
              <MiniStat
                icon={Users}
                label="Monthly Active Users"
                value={count(summary?.monthlyActiveUsers)}
                tone="violet"
              />
              <MiniStat
                icon={BadgeCheck}
                label="Active Subscriptions"
                value={count(summary?.activeSubscriptions)}
                tone="accent"
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <ChartCard
                className="xl:col-span-2"
                title="Student Growth and Activity"
                description="Monthly totals and daily active users"
              >
                <div className="h-[300px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.growthTrend ?? []}
                      margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={chartColors[0]} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors[1]} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={chartColors[1]} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="oklch(0.92 0.008 240)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="totalStudents"
                        name="Total students"
                        stroke={chartColors[0]}
                        strokeWidth={2.5}
                        fill="url(#studentsGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dailyActiveUsers"
                        name="Daily active users"
                        stroke={chartColors[1]}
                        strokeWidth={2}
                        fill="url(#activeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard
                title="Subscription Distribution"
                description="Active subscriptions by plan"
              >
                <div className="h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.subscriptionDistribution ?? []}
                        dataKey="count"
                        nameKey="plan"
                        innerRadius={58}
                        outerRadius={86}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {(data.subscriptionDistribution ?? []).map((plan, index) => (
                          <Cell key={plan.plan} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {(data.subscriptionDistribution ?? []).map((plan, index) => (
                    <div
                      key={plan.plan}
                      className="flex items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            background: chartColors[index % chartColors.length],
                          }}
                        />
                        {plan.plan}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {count(plan.count)} · {plan.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <ChartCard title="Top Universities" description="By student count">
                <div className="h-[300px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topUniversities ?? []}
                      layout="vertical"
                      margin={{ top: 4, right: 16, left: 12, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="oklch(0.92 0.008 240)"
                        horizontal={false}
                      />
                      <XAxis type="number" tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="university"
                        width={110}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="studentCount"
                        name="Students"
                        fill={chartColors[0]}
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Critical Alerts" description="Items requiring attention">
                <div className="space-y-2.5">
                  {(data.criticalAlerts ?? []).map((alert, index) => (
                    <div
                      key={`${alert.alertType}-${index}`}
                      className="flex items-start gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                        <Bell className="h-[18px] w-[18px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{alert.title}</p>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] capitalize">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                      <span className="font-semibold tabular-nums">{count(alert.count)}</span>
                    </div>
                  ))}
                  {!data.criticalAlerts?.length && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No critical alerts reported.
                    </p>
                  )}
                </div>
              </ChartCard>
            </div>

            <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="text-[15px] font-semibold tracking-tight">Recent Activity</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest events reported by the platform
              </p>
              <ul className="mt-3 divide-y divide-border">
                {(data.recentActivity ?? []).map((event, index) => (
                  <li
                    key={`${event.eventType}-${event.occurredAt}-${index}`}
                    className="flex flex-wrap items-start gap-2 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{event.eventType}</p>
                    </div>
                    <time className="text-xs text-muted-foreground">{event.occurredAt}</time>
                  </li>
                ))}
                {!data.recentActivity?.length && (
                  <li className="py-8 text-center text-sm text-muted-foreground">
                    No recent activity reported.
                  </li>
                )}
              </ul>
            </section>
          </>
        )}
      </DashboardQueryState>
    </DashboardLayout>
  );
}
