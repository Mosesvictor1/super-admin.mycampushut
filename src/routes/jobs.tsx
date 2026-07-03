import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Send, MessagesSquare, Award, Star } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { ApplicationFunnel } from "@/components/dashboard/Charts";
import {
  jobsKPIs,
  applicationsOverTime,
  topRoles,
  topRecruiters,
} from "@/lib/mock-data";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Jobs Analytics" }] }),
  component: JobsPage,
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
          <span className="font-semibold text-foreground tabular-nums">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function JobsPage() {
  return (
    <DashboardLayout title="Jobs Analytics" subtitle="Applications, hiring funnel, and recruiter performance">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={Briefcase} tone="primary" label="Active Jobs" value={jobsKPIs.activeJobs.value.toLocaleString()} delta={jobsKPIs.activeJobs.delta} />
        <MiniStat icon={Send} tone="blue" label="Applications" value={jobsKPIs.applications.value.toLocaleString()} delta={jobsKPIs.applications.delta} />
        <MiniStat icon={MessagesSquare} tone="violet" label="Interviews" value={jobsKPIs.interviews.value.toLocaleString()} delta={jobsKPIs.interviews.delta} />
        <MiniStat icon={Award} tone="accent" label="Hired" value={jobsKPIs.hired.value.toLocaleString()} delta={jobsKPIs.hired.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="Applications Over Time" description="Applications, interviews, and hires · last 7 weeks">
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationsOverTime} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <Tooltip content={<TT />} />
                  <Line type="monotone" dataKey="applied" stroke="oklch(0.55 0.15 240)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="interviews" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hired" stroke="oklch(0.72 0.18 50)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ApplicationFunnel />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Top Roles by Applications" description="Most applied job categories">
          <div className="h-[280px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRoles} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                <YAxis type="category" dataKey="role" tickLine={false} axisLine={false} width={110} tick={{ fill: "oklch(0.30 0.03 250)", fontSize: 11.5 }} />
                <Tooltip content={<TT />} cursor={{ fill: "oklch(0.96 0.01 240)" }} />
                <Bar dataKey="apps" fill="oklch(0.55 0.15 240)" radius={[0, 8, 8, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Top Recruiters</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">By hires this quarter</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Recruiter</th>
                  <th className="text-left font-medium px-5 py-3">Jobs</th>
                  <th className="text-left font-medium px-5 py-3">Hires</th>
                  <th className="text-left font-medium px-5 py-3">Conversion</th>
                  <th className="text-left font-medium px-5 py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topRecruiters.map((r) => (
                  <tr key={r.name} className="border-t border-border hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 text-[11px] font-semibold text-primary">
                          {r.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums">{r.jobs}</td>
                    <td className="px-5 py-3.5 tabular-nums font-semibold">{r.hires}</td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {((r.hires / r.jobs) * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-[12px] font-semibold text-primary">
                        <Star className="h-3 w-3 fill-current" />
                        {r.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
