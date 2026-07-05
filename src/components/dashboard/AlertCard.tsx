import {
  AlertTriangle,
  TrendingDown,
  LifeBuoy,
  Clock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "info";

type Alert = {
  icon: LucideIcon;
  severity: Severity;
  title: string;
  message: string;
  count: number;
  to: string;
};

const alerts: Alert[] = [
  {
    icon: AlertTriangle,
    severity: "critical",
    title: "Failed payments spike",
    message: "32 transactions failed in the last 24h.",
    count: 32,
    to: "/finance",
  },
  {
    icon: TrendingDown,
    severity: "warning",
    title: "High churn warning",
    message: "Premium plan churn up 4.2% WoW.",
    count: 41,
    to: "/finance",
  },
  {
    icon: LifeBuoy,
    severity: "warning",
    title: "Pending support tickets",
    message: "18 tickets unresolved for >24h.",
    count: 18,
    to: "/reports",
  },
  {
    icon: Clock,
    severity: "info",
    title: "Subscriptions expiring",
    message: "127 subscriptions expire this week.",
    count: 127,
    to: "/finance",
  },
];

const sev = {
  critical: {
    wrap: "border-[oklch(0.85_0.12_27_/_0.5)] bg-[oklch(0.97_0.03_27)]",
    icon: "bg-destructive/10 text-destructive",
    badge: "bg-destructive text-destructive-foreground",
  },
  warning: {
    wrap: "border-[oklch(0.85_0.12_50_/_0.5)] bg-[oklch(0.98_0.03_50)]",
    icon: "bg-accent/10 text-accent",
    badge: "bg-accent text-accent-foreground",
  },
  info: {
    wrap: "border-border bg-muted/40",
    icon: "bg-primary-soft text-primary",
    badge: "bg-primary text-primary-foreground",
  },
} as const;

export function AlertCard() {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Critical Alerts</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Requires admin attention
          </p>
        </div>
        <button
          onClick={() => navigate("/reports")}
          className="text-[12px] text-primary hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-2.5">
        {alerts.map((a, i) => {
          const s = sev[a.severity];
          return (
            <button
              key={i}
              onClick={() => navigate(a.to)}
              className={cn(
                "group w-full text-left flex items-center gap-3 rounded-xl border p-3 transition-all hover:-translate-y-px hover:shadow-soft",
                s.wrap,
              )}
            >
              <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", s.icon)}>
                <a.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-[13.5px] font-medium text-foreground truncate">
                    {a.title}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      s.badge,
                    )}
                  >
                    {a.count}
                  </span>
                </div>
                <div className="text-[12px] text-muted-foreground truncate">
                  {a.message}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
