import { FileBarChart, Calendar, Download, ShieldCheck, Play } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { reportsList, auditEvents } from "@/lib/mock-data";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { toast } from "sonner";

const typeCls: Record<string, string> = {
  Finance: "bg-primary-soft text-primary",
  Users: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
  Jobs: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
  Courses: "bg-[oklch(0.96_0.04_50)] text-accent",
  Ops: "bg-muted text-muted-foreground",
};

export default function ReportsPage() {
  useDocumentTitle("CampusHut Admin — Reports");
  return (
    <DashboardLayout title="Reports" subtitle="Scheduled exports, ad-hoc reports, and audit trail">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={FileBarChart} tone="primary" label="Total Reports" value={reportsList.length} delta={0} />
        <MiniStat icon={Calendar} tone="blue" label="Scheduled" value={reportsList.filter((r) => r.schedule !== "On demand").length} delta={0} />
        <MiniStat icon={Download} tone="violet" label="Exports (30d)" value={"1,284"} delta={9.4} />
        <MiniStat icon={ShieldCheck} tone="accent" label="Audit Events (24h)" value={"312"} delta={4.1} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Scheduled & Saved Reports</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Managed exports across modules</p>
            </div>
            <button
              onClick={() => toast.success("Opening report builder…")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110"
            >
              <Play className="h-3.5 w-3.5" />
              New report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Name</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Schedule</th>
                  <th className="text-left font-medium px-5 py-3">Format</th>
                  <th className="text-left font-medium px-5 py-3">Owner</th>
                  <th className="text-left font-medium px-5 py-3">Last Run</th>
                  <th className="text-right font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {reportsList.map((r) => (
                  <tr key={r.name} className="border-t border-border hover:bg-muted/40">
                    <td className="px-5 py-3.5 font-medium">{r.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[11.5px] font-medium ${typeCls[r.type] ?? ""}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.schedule}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.format}</td>
                    <td className="px-5 py-3.5">{r.owner}</td>
                    <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{r.lastRun}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toast.success(`${r.name} · running now`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11.5px] hover:border-primary/40"
                      >
                        <Download className="h-3 w-3" /> Run
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-[15px] font-semibold tracking-tight">Audit Trail</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Recent admin actions</p>
          <ul className="mt-4 space-y-3">
            {auditEvents.map((e, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary text-[11px] font-bold">
                  {e.actor.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px]">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">{e.action.toLowerCase()}</span>
                  </div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{e.target}</div>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{e.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
