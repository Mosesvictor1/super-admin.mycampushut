import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNavbar title={title} subtitle={subtitle} />
        <main className="flex-1 px-6 py-6 animate-fade-in-up">{children}</main>
      </div>
    </div>
  );
}
