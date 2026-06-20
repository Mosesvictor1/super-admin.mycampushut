import { createFileRoute } from "@tanstack/react-router";
import { Users, Activity, Wallet, BadgeCheck } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  ApplicationFunnel,
  PlanDonutChart,
  StudentGrowthChart,
  UniversitiesBarChart,
} from "@/components/dashboard/Charts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { DataTable } from "@/components/dashboard/DataTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusHut Admin — Platform Overview" },
      {
        name: "description",
        content:
          "Enterprise reporting dashboard for CampusHut — student growth, subscriptions, revenue, jobs, AI learning analytics in one premium console.",
      },
      { property: "og:title", content: "CampusHut Admin — Platform Overview" },
      {
        property: "og:description",
        content:
          "Real-time, role-gated analytics across all CampusHut modules. Built for administrators, finance, and operations.",
      },
    ],
  }),
  component: PlatformOverview,
});

const spark = (seed: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    v: 40 + Math.sin(i * 0.6 + seed) * 12 + i * (1.6 + (seed % 3)),
  }));

function PlatformOverview() {
  return (
    <DashboardLayout
      title="Platform Overview"
      subtitle="Real-time health across all CampusHut modules"
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label="Total Students"
          value="125,420"
          delta={12.4}
          spark={spark(1)}
          tone="primary"
        />
        <KPICard
          icon={Activity}
          label="Daily Active Users"
          value="18,540"
          delta={8.2}
          spark={spark(2)}
          tone="blue"
        />
        <KPICard
          icon={Wallet}
          label="Monthly Revenue"
          value="₦84,200"
          delta={15.7}
          spark={spark(3)}
          tone="accent"
        />
        <KPICard
          icon={BadgeCheck}
          label="Active Subscriptions"
          value="3,421"
          delta={-2.1}
          spark={spark(4)}
          tone="violet"
        />
      </div>

      {/* Main charts row */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <StudentGrowthChart />
        </div>
        <PlanDonutChart />
      </div>

      {/* Secondary row */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <UniversitiesBarChart />
        <ApplicationFunnel />
        <AlertCard />
      </div>

      {/* Activity + Table */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <DataTable />
        </div>
        <ActivityFeed />
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-muted-foreground">
        <span>
          CampusHut Reporting Dashboard · BRD v1.0 · Data refreshed{" "}
          <span className="text-foreground/80">just now</span>
        </span>
        <span>Confidential — Internal Use Only</span>
      </footer>
    </DashboardLayout>
  );
}
