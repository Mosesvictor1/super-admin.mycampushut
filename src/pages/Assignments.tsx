import { useState } from "react";
import { ClipboardList, CheckCircle2, Clock, AlertOctagon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { assignmentKPIs, submissionByWeek, assignmentsList } from "@/lib/mock-data";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AssignmentsPage() {
  useDocumentTitle("CampusHut Admin — Assignments");
  const [a, setA] = useState<(typeof assignmentsList)[number] | null>(null);

  return (
    <DashboardLayout title="Assignments" subtitle="Submission rates, timeliness, and course-level performance">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={ClipboardList} tone="primary" label="Active Assignments" value={assignmentKPIs.active.value} delta={assignmentKPIs.active.delta} />
        <MiniStat icon={CheckCircle2} tone="blue" label="Submission Rate" value={assignmentKPIs.submissionRate.value} suffix="%" delta={assignmentKPIs.submissionRate.delta} />
        <MiniStat icon={Clock} tone="violet" label="On-time Rate" value={assignmentKPIs.onTime.value} suffix="%" delta={assignmentKPIs.onTime.delta} />
        <MiniStat icon={AlertOctagon} tone="accent" label="Overdue" value={assignmentKPIs.overdue.value} delta={assignmentKPIs.overdue.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="Submissions by Week" description="On-time · late · missed">
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionByWeek} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "oklch(0.96 0.01 240)" }} />
                  <Legend wrapperStyle={{ fontSize: 11.5 }} iconType="circle" />
                  <Bar dataKey="onTime" name="On-time" stackId="a" fill="oklch(0.62 0.17 148)" />
                  <Bar dataKey="late" name="Late" stackId="a" fill="oklch(0.72 0.18 50)" />
                  <Bar dataKey="missed" name="Missed" stackId="a" fill="oklch(0.60 0.22 27)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Reminder Automation" description="Auto-nudges sent this week">
          <div className="space-y-3">
            {[
              { label: "Due tomorrow", sent: 842, opened: 640, tone: "primary" as const },
              { label: "Due in 3 days", sent: 1_240, opened: 812, tone: "blue" as const },
              { label: "Overdue > 1 day", sent: 386, opened: 214, tone: "accent" as const },
            ].map((r) => {
              const pct = Math.round((r.opened / r.sent) * 100);
              return (
                <div key={r.label} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-medium">{r.label}</span>
                    <span className="text-muted-foreground tabular-nums">{r.opened}/{r.sent}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        r.tone === "primary" && "bg-primary",
                        r.tone === "blue" && "bg-[oklch(0.55_0.15_240)]",
                        r.tone === "accent" && "bg-accent",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{pct}% opened</div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">Active Assignments</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{assignmentsList.length} assignments across all courses</p>
          </div>
          <button
            onClick={() => toast("Assignment management — coming soon")}
            className="text-[12px] text-primary hover:underline"
          >
            Manage all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-5 py-3">Assignment</th>
                <th className="text-left font-medium px-5 py-3">Course</th>
                <th className="text-left font-medium px-5 py-3">Due</th>
                <th className="text-left font-medium px-5 py-3">Submissions</th>
                <th className="text-left font-medium px-5 py-3">Avg. Score</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsList.map((row) => {
                const pct = Math.round((row.submissions / row.total) * 100);
                const overdue = row.due === "Overdue";
                return (
                  <tr
                    key={row.title}
                    onClick={() => setA(row)}
                    className="border-t border-border hover:bg-muted/40 cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-medium">{row.title}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{row.course}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                        overdue
                          ? "bg-[oklch(0.96_0.06_27)] text-destructive ring-destructive/20"
                          : "bg-primary-soft text-primary ring-primary/20",
                      )}>
                        {row.due}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[12px] tabular-nums text-muted-foreground">
                          {row.submissions}/{row.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums font-semibold">{row.avgScore}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!a} onOpenChange={(v) => !v && setA(null)}>
        <DialogContent>
          {a && (
            <>
              <DialogHeader>
                <DialogTitle>{a.title}</DialogTitle>
                <DialogDescription>{a.course} · Due {a.due}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
                <Field label="Submissions" value={`${a.submissions}/${a.total}`} />
                <Field label="Submission rate" value={`${Math.round((a.submissions / a.total) * 100)}%`} />
                <Field label="Avg. score" value={`${a.avgScore}%`} />
                <Field label="Course" value={a.course} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
