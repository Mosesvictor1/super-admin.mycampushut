import { Users, Activity, UserCheck, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { useDocumentTitle } from "@/hooks/use-document-title";

const spark = (seed: number) =>
  Array.from({ length: 14 }, (_, i) => ({
    v: 40 + Math.sin(i * 0.6 + seed) * 12 + i * (1.6 + (seed % 3)),
  }));

export default function IndexPage() {
  useDocumentTitle(
    "CampusHut Admin — Platform Overview",
    "Real-time reporting across CampusHut students, revenue, jobs, and AI learning.",
  );
  const navigate = useNavigate();

  return (
    <DashboardLayout
      title="Platform Overview"
      subtitle="Real-time health across all CampusHut modules"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <button className="text-left" onClick={() => navigate("/users")}>
          <KPICard icon={Users} label="Total Students" value="125,420" delta={12.4} spark={spark(1)} tone="primary" />
        </button>
        <button className="text-left" onClick={() => navigate("/users")}>
          <KPICard icon={Activity} label="Daily Active Users" value="18,540" delta={8.2} spark={spark(2)} tone="blue" />
        </button>
        <button className="text-left" onClick={() => navigate("/finance")}>
          <KPICard icon={Wallet} label="Monthly Revenue" value="₦84,200" delta={15.7} spark={spark(3)} tone="accent" />
        </button>
        <button className="text-left" onClick={() => navigate("/finance")}>
          <KPICard icon={BadgeCheck} label="Active Subscriptions" value="3,421" delta={-2.1} spark={spark(4)} tone="violet" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <StudentGrowthChart />
        </div>
        <PlanDonutChart />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <UniversitiesBarChart />
        <ApplicationFunnel />
        <AlertCard />
      </div>

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
