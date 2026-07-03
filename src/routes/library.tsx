import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Eye, Star, Clock, FileText, Video, Layers, PlayCircle } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { libraryKPIs, resourceByType, topResources } from "@/lib/mock-data";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Learning Library" }] }),
  component: LibraryPage,
});

const typeIcon: Record<string, typeof FileText> = {
  Video: Video,
  Article: FileText,
  PDF: FileText,
  "PDF/Notes": FileText,
  Interactive: Layers,
};

function LibraryPage() {
  return (
    <DashboardLayout title="Learning Library" subtitle="Content catalog performance, views, ratings, and consumption">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={BookOpen} tone="primary" label="Total Resources" value={libraryKPIs.resources.value.toLocaleString()} delta={libraryKPIs.resources.delta} />
        <MiniStat icon={Eye} tone="blue" label="Views (30d)" value={libraryKPIs.views30d.value.toLocaleString()} delta={libraryKPIs.views30d.delta} />
        <MiniStat icon={Star} tone="accent" label="Avg. Rating" value={libraryKPIs.avgRating.value} suffix="/5" delta={libraryKPIs.avgRating.delta} />
        <MiniStat icon={Clock} tone="violet" label="Hours Consumed" value={libraryKPIs.hoursConsumed.value.toLocaleString()} delta={libraryKPIs.hoursConsumed.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Content Mix" description="Resource distribution by type">
          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resourceByType} dataKey="value" innerRadius={62} outerRadius={90} paddingAngle={3} stroke="none">
                  {resourceByType.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Catalog</div>
              <div className="text-xl font-semibold tabular-nums">8.4k</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {resourceByType.map((r) => (
              <div key={r.name} className="rounded-lg border border-border px-2.5 py-1.5 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
                <div className="mt-0.5 font-semibold tabular-nums">{r.value}%</div>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Top Resources</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Highest views this month</p>
            </div>
            <button className="text-[12px] text-primary hover:underline">Manage catalog</button>
          </div>
          <ul className="divide-y divide-border">
            {topResources.map((r, i) => {
              const Icon = typeIcon[r.type] ?? FileText;
              return (
                <li key={r.title} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary text-[11px] font-bold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium truncate">{r.title}</div>
                    <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
                      <Icon className="h-3 w-3" />
                      {r.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold tabular-nums">{r.views.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground justify-end">
                      <Star className="h-3 w-3 fill-current text-accent" />
                      {r.rating}
                    </div>
                  </div>
                  <button className="ml-2 rounded-lg p-1.5 text-muted-foreground hover:bg-primary-soft hover:text-primary">
                    <PlayCircle className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
