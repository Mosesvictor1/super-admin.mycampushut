import type { ReactNode } from "react";
import type { DashboardExportData } from "@/lib/dashboard-export";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardLayout({
  title,
  subtitle,
  exportData,
  children,
}: {
  title: string;
  subtitle?: string;
  exportData?: DashboardExportData | (() => Promise<DashboardExportData>);
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNavbar title={title} subtitle={subtitle} exportData={exportData} />
        <main className="flex-1 px-6 py-6 animate-fade-in-up">{children}</main>
      </div>
    </div>
  );
}
