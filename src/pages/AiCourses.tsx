import { useState } from "react";
import { GraduationCap, MessagesSquare, Timer, UserPlus, Zap, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { useAICourseOverview, type AICourseOverview } from "@/lib/dashboard-api";
import { useDashboardDateRange } from "@/components/dashboard/dashboard-date-range-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Course = NonNullable<AICourseOverview["topCourses"]>[number];
const number = (value?: number) => value?.toLocaleString() ?? "—";

export default function AiCoursesPage() {
  useDocumentTitle("CampusHut Admin — AI Courses");
  const { filters } = useDashboardDateRange();
  const { data, isLoading, error, refetch } = useAICourseOverview(filters);
  const [course, setCourse] = useState<Course | null>(null);
  const summary = data?.summary;

  return (
    <DashboardLayout
      title="AI Courses"
      subtitle="Course enrollment, completion, and AI assistant usage"
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
                icon={GraduationCap}
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

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <ChartCard
                className="xl:col-span-2"
                title="Enrollments and Completions"
                description="Monthly course activity"
                action={
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.18_300)]" />
                      Enrollments
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Completions
                    </span>
                  </div>
                }
              >
                <div className="h-[300px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.enrollmentTrend ?? []}
                      margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="completeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
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
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="enrollments"
                        name="Enrollments"
                        stroke="oklch(0.65 0.18 300)"
                        strokeWidth={2.5}
                        fill="url(#enrollGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="completions"
                        name="Completions"
                        stroke="oklch(0.62 0.17 148)"
                        strokeWidth={2.5}
                        fill="url(#completeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="AI Assistant Usage" description="Sessions by category">
                <div className="space-y-4">
                  {(data.assistantUsage ?? []).map((usage) => (
                    <div key={usage.category}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-medium">{usage.category}</span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {number(usage.sessions)} · {usage.percentage}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, Math.max(0, usage.percentage))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {!data.assistantUsage?.length && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No assistant usage reported.
                    </p>
                  )}
                  <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    <MessagesSquare className="h-4 w-4" />
                    AI assistant usage reported by category
                  </div>
                </div>
              </ChartCard>
            </div>

            <section className="mt-5 rounded-2xl border border-border bg-card shadow-card">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-[15px] font-semibold tracking-tight">Top Courses</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Ranked course enrollment and completion
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
                {(data.topCourses ?? []).map((item) => (
                  <button
                    key={item.courseId}
                    onClick={() => setCourse(item)}
                    className="card-hover rounded-xl border border-border p-4 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-[oklch(0.65_0.18_300_/_0.15)] text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold tracking-tight">{item.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {number(item.students)} students · {number(item.completedStudents)} completed
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Completion</span>
                        <span className="font-semibold tabular-nums text-foreground">
                          {item.completionRatePercent}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, Math.max(0, item.completionRatePercent))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
                {!data.topCourses?.length && (
                  <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                    No course data reported.
                  </p>
                )}
              </div>
            </section>

            <Dialog open={!!course} onOpenChange={(open) => !open && setCourse(null)}>
              <DialogContent>
                {course && (
                  <>
                    <DialogHeader>
                      <DialogTitle>{course.title}</DialogTitle>
                      <DialogDescription>Course analytics</DialogDescription>
                    </DialogHeader>
                    <dl className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
                      <Field label="Course ID" value={String(course.courseId)} />
                      <Field label="Students" value={number(course.students)} />
                      <Field label="Completed students" value={number(course.completedStudents)} />
                      <Field label="Completion rate" value={`${course.completionRatePercent}%`} />
                    </dl>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </DashboardQueryState>
    </DashboardLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold tabular-nums">{value}</div>
    </div>
  );
}
