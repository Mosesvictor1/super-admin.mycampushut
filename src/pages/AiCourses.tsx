import { useState } from "react";
import { Sparkles, GraduationCap, MessagesSquare, Star } from "lucide-react";
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
import { aiCourseKPIs, enrollmentTrend, aiCourses } from "@/lib/mock-data";
import { useDocumentTitle } from "@/hooks/use-document-title";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AiCoursesPage() {
  useDocumentTitle("CampusHut Admin — AI Courses");
  const [course, setCourse] = useState<(typeof aiCourses)[number] | null>(null);

  return (
    <DashboardLayout title="AI Courses" subtitle="Enrollments, completion, engagement, and CSAT">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={GraduationCap} tone="primary" label="Enrollments" value={aiCourseKPIs.enrollments.value.toLocaleString()} delta={aiCourseKPIs.enrollments.delta} />
        <MiniStat icon={Sparkles} tone="blue" label="Completion Rate" value={aiCourseKPIs.completion.value} suffix="%" delta={aiCourseKPIs.completion.delta} />
        <MiniStat icon={MessagesSquare} tone="violet" label="AI Tutor Sessions" value={aiCourseKPIs.aiSessions.value.toLocaleString()} delta={aiCourseKPIs.aiSessions.delta} />
        <MiniStat icon={Star} tone="accent" label="CSAT" value={aiCourseKPIs.csat.value} suffix="/5" delta={aiCourseKPIs.csat.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="Enrollments vs Completions" description="Monthly trend">
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrend} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gEnr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="oklch(0.65 0.18 300)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="enrolled" stroke="oklch(0.65 0.18 300)" strokeWidth={2.5} fill="url(#gEnr)" />
                  <Area type="monotone" dataKey="completed" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gComp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="AI Assistant Usage" description="Session mix this month">
          <div className="space-y-3">
            {[
              { name: "Doubt solving", pct: 42, color: "oklch(0.62 0.17 148)" },
              { name: "Code review", pct: 26, color: "oklch(0.55 0.15 240)" },
              { name: "Concept explain", pct: 18, color: "oklch(0.65 0.18 300)" },
              { name: "Practice quiz", pct: 14, color: "oklch(0.72 0.18 50)" },
            ].map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground tabular-nums">{s.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-semibold tracking-tight">Top Courses</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">By enrollment and engagement</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
          {aiCourses.map((c) => (
            <button
              key={c.title}
              onClick={() => setCourse(c)}
              className="text-left rounded-xl border border-border p-4 card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-[oklch(0.65_0.18_300_/_0.15)] text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-[11.5px] font-semibold text-primary">
                  <Star className="h-3 w-3 fill-current" />
                  {c.rating}
                </span>
              </div>
              <div className="mt-3 text-[14px] font-semibold tracking-tight">{c.title}</div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">{c.hours} hrs · {c.students.toLocaleString()} students</div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11.5px] text-muted-foreground">
                  <span>Completion</span>
                  <span className="tabular-nums font-semibold text-foreground">{c.completion}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.completion}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!course} onOpenChange={(v) => !v && setCourse(null)}>
        <DialogContent>
          {course && (
            <>
              <DialogHeader>
                <DialogTitle>{course.title}</DialogTitle>
                <DialogDescription>{course.hours} hours · {course.students.toLocaleString()} students enrolled</DialogDescription>
              </DialogHeader>
              <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
                <F label="Completion" value={`${course.completion}%`} />
                <F label="Rating" value={`${course.rating} / 5`} />
                <F label="Students" value={course.students.toLocaleString()} />
                <F label="Hours" value={String(course.hours)} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function F({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold tabular-nums">{value}</div>
    </div>
  );
}
