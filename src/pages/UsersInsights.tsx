import { useEffect, useState } from "react";
import { Timer, UserPlus, Users, Zap } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardQueryState } from "@/components/dashboard/DashboardQueryState";
import { DataTable } from "@/components/dashboard/DataTable";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { fetchAllUserInsights, useUserInsights } from "@/lib/dashboard-api";
import { useDashboardDateRange } from "@/components/dashboard/dashboard-date-range-context";
import type { DashboardExportData } from "@/lib/dashboard-export";

const PAGE_SIZE = 20;
const number = (value?: number) => value?.toLocaleString() ?? "—";

export default function UsersInsightsPage() {
  useDocumentTitle(
    "CampusHut Admin — User Insights",
    "Student growth, retention, and regional distribution.",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { filters } = useDashboardDateRange();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading, error, refetch } = useUserInsights(search, page, PAGE_SIZE, filters);
  const summary = data?.summary;
  const students = (data?.students ?? []).map((student) => ({
    id: student.studentId,
    name: `${student.firstName} ${student.lastName}`.trim(),
    email: student.email,
    university: student.university,
    plan: student.plan,
    lastActive: student.lastActive,
    status: student.status,
  }));
  const totalStudents = data?.totalStudents;
  const pageTotal = totalStudents ?? students.length;
  const hasNext = data?.hasNext ?? page + 1 < Math.ceil(pageTotal / PAGE_SIZE);
  const exportData: (() => Promise<DashboardExportData>) | undefined = data
    ? async () => {
        const allInsights = await fetchAllUserInsights(search, filters, PAGE_SIZE);
        const allStudents = allInsights.students ?? [];
        return {
          reportTitle: "User Insights",
          rangeLabel: "Last 30 days",
          filters,
          summary: [
            {
              metric: "New students (30 days)",
              value: allInsights.summary?.newStudents30Days ?? "—",
            },
            {
              metric: "30-day retention (%)",
              value: allInsights.summary?.retention30DayPercent ?? "—",
            },
            {
              metric: "Average session duration (minutes)",
              value: allInsights.summary?.averageSessionDurationMinutes ?? "—",
            },
            {
              metric: "Activation rate (%)",
              value: allInsights.summary?.activationRatePercent ?? "—",
            },
            {
              metric: "Total matching students",
              value: allInsights.totalStudents ?? allStudents.length,
            },
            { metric: "Rows exported", value: allStudents.length },
          ],
          sheets: [
            {
              name: "Students",
              columns: [
                { header: "Student ID", key: "studentId" },
                { header: "First name", key: "firstName" },
                { header: "Last name", key: "lastName" },
                { header: "Email", key: "email", width: 32 },
                { header: "University", key: "university", width: 36 },
                { header: "Plan", key: "plan" },
                { header: "Last active", key: "lastActive", width: 26 },
                { header: "Status", key: "status" },
              ],
              rows: allStudents,
            },
            {
              name: "Retention Trend",
              columns: [
                { header: "Period", key: "period" },
                { header: "Retention (%)", key: "retentionPercent" },
              ],
              rows: allInsights.retentionTrend ?? [],
            },
            {
              name: "Top Regions",
              columns: [
                { header: "Region", key: "region" },
                { header: "Student count", key: "studentCount" },
              ],
              rows: allInsights.topRegions ?? [],
            },
          ],
        };
      }
    : undefined;

  return (
    <DashboardLayout
      title="User Insights"
      subtitle="Track student growth, engagement, and retention"
      exportData={exportData}
    >
      <DashboardQueryState isLoading={isLoading} error={error} onRetry={() => void refetch()}>
        {data && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniStat
                icon={UserPlus}
                tone="primary"
                label="New Students (30D)"
                value={number(summary?.newStudents30Days)}
              />
              <MiniStat
                icon={Users}
                tone="blue"
                label="30-Day Retention"
                value={summary?.retention30DayPercent ?? "—"}
                suffix={summary ? "%" : undefined}
              />
              <MiniStat
                icon={Timer}
                tone="violet"
                label="Avg. Session Duration"
                value={summary?.averageSessionDurationMinutes ?? "—"}
                suffix={summary ? "min" : undefined}
              />
              <MiniStat
                icon={Zap}
                tone="accent"
                label="Activation Rate"
                value={summary?.activationRatePercent ?? "—"}
                suffix={summary ? "%" : undefined}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-5">
              <ChartCard
                className="xl:col-span-3"
                title="Student Retention Over Time"
                description="Retention percentage by period"
              >
                <div className="h-[300px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.retentionTrend ?? []}
                      margin={{ top: 16, right: 16, left: -8, bottom: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="oklch(0.92 0.008 240)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="period"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                        tickFormatter={(value: number) => `${value}%`}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, "Retention"]} />
                      <Line
                        type="monotone"
                        dataKey="retentionPercent"
                        name="Retention"
                        stroke="oklch(0.62 0.17 148)"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard
                className="xl:col-span-2"
                title="Top Regions"
                description="Student count by region"
              >
                <ol className="space-y-1">
                  {(data.topRegions ?? []).map((region, index) => (
                    <li
                      key={region.region}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {region.region}
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {number(region.studentCount)}
                      </span>
                    </li>
                  ))}
                  {!data.topRegions?.length && (
                    <li className="py-8 text-center text-sm text-muted-foreground">
                      No regional data reported.
                    </li>
                  )}
                </ol>
              </ChartCard>
            </div>

            <div className="mt-5">
              <DataTable
                title="Student Overview"
                subtitle={`${number(totalStudents)} students`}
                rows={students}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                serverPagination={{
                  page,
                  size: data.size && data.size > 0 ? data.size : PAGE_SIZE,
                  total: pageTotal,
                  hasNext,
                  onPageChange: setPage,
                }}
              />
            </div>
          </>
        )}
      </DashboardQueryState>
    </DashboardLayout>
  );
}
