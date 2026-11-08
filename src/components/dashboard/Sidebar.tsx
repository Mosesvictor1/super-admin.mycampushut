import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Users,
  Wallet,
  Briefcase,
  ClipboardList,
  Sparkles,
  BookOpen,
  FileBarChart,
  Store,
  ChevronsLeft,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Newspaper,
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { dashboardModules, type DashboardModule } from "@/lib/dashboard-modules";
import type { LucideIcon } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, module: "platform" },
  { to: "/platform", label: "Platform Overview", icon: Activity, module: "platform" },
  { to: "/users", label: "User Insights", icon: Users, module: "users" },
  { to: "/finance", label: "Finance & Subscription", icon: Wallet, module: "finance" },
  { to: "/jobs", label: "Jobs Analytics", icon: Briefcase, module: "jobs" },
  { to: "/assignments", label: "Assignments", icon: ClipboardList, module: "assignments" },
  { to: "/marketplace", label: "Marketplace", icon: Store, module: "marketplace" },
  { to: "/ai-courses", label: "AI Courses", icon: Sparkles, module: "aiCourses" },
  { to: "/library", label: "Learning Library", icon: BookOpen, module: "library" },
  { to: "/news-blog", label: "News & Blog", icon: Newspaper, module: "newsBlog" },
  { to: "/brand", label: "Brand Ads", icon: Megaphone, module: "brand" },
  { to: "/reports", label: "Reports", icon: FileBarChart, module: "reports" },
] satisfies {
  to: string;
  label: string;
  icon: LucideIcon;
  module?: DashboardModule;
}[];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 flex flex-col text-sidebar-foreground bg-sidebar transition-[width] duration-300 ease-out border-r border-sidebar-border",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
      style={{
        backgroundImage:
          "radial-gradient(120% 60% at 0% 0%, oklch(0.32 0.08 155 / 0.6), transparent 60%), radial-gradient(80% 40% at 100% 100%, oklch(0.55 0.16 148 / 0.18), transparent 70%)",
      }}
    >
      <Link
        to="/"
        className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border hover:opacity-90 transition-opacity"
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.18_148)] to-[oklch(0.55_0.16_148)] shadow-[0_8px_24px_-8px_oklch(0.55_0.16_148_/_0.6)]">
          <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.4} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight text-white truncate">
              CampusHut
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-sidebar-muted">
              Admin Console
            </div>
          </div>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-sidebar-muted">
            Workspace
          </div>
        )}
        {NAV.filter(({ module }) => !module || dashboardModules[module]).map(
          ({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-[oklch(0.32_0.06_155)] text-white sidebar-glow"
                    : "text-sidebar-foreground/80 hover:bg-[oklch(0.30_0.05_155)] hover:text-white",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.18_148)] shadow-[0_0_10px_oklch(0.85_0.18_148)]" />
                )}
              </Link>
            );
          },
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 transition-colors",
            !collapsed && "bg-[oklch(0.30_0.05_155_/_0.6)] hover:bg-[oklch(0.34_0.05_155_/_0.7)]",
          )}
        >
          <div className="relative shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_148)] to-[oklch(0.55_0.16_148)] text-sm font-semibold text-white">
              AK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[oklch(0.78_0.18_148)] ring-2 ring-sidebar" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">Victor Moses</div>
              <div className="flex items-center gap-1 text-[11px] text-sidebar-muted">
                <ShieldCheck className="h-3 w-3 text-[oklch(0.85_0.18_148)]" />
                Super Admin
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success("Signed out (demo)");
              }}
              className="rounded-lg p-1.5 text-sidebar-muted hover:bg-[oklch(0.35_0.05_155)] hover:text-white transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-[11px] text-sidebar-muted hover:bg-[oklch(0.30_0.05_155)] hover:text-white transition-colors"
        >
          <ChevronsLeft
            className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
