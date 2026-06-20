import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number; // percent
  spark: { v: number }[];
  tone?: "primary" | "accent" | "violet" | "blue";
}

const toneMap = {
  primary: {
    grad: "from-[oklch(0.96_0.05_148)] to-transparent",
    icon: "bg-primary-soft text-primary",
    stroke: "var(--color-primary)",
    fill: "url(#sparkGreen)",
    gradId: "sparkGreen",
    c1: "oklch(0.62 0.17 148)",
  },
  accent: {
    grad: "from-[oklch(0.97_0.04_50)] to-transparent",
    icon: "bg-[oklch(0.96_0.04_50)] text-accent",
    stroke: "var(--color-accent)",
    fill: "url(#sparkOrange)",
    gradId: "sparkOrange",
    c1: "oklch(0.72 0.18 50)",
  },
  violet: {
    grad: "from-[oklch(0.96_0.04_300)] to-transparent",
    icon: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
    stroke: "oklch(0.65 0.18 300)",
    fill: "url(#sparkViolet)",
    gradId: "sparkViolet",
    c1: "oklch(0.65 0.18 300)",
  },
  blue: {
    grad: "from-[oklch(0.96_0.04_240)] to-transparent",
    icon: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
    stroke: "oklch(0.55 0.15 240)",
    fill: "url(#sparkBlue)",
    gradId: "sparkBlue",
    c1: "oklch(0.55 0.15 240)",
  },
};

export function KPICard({
  icon: Icon,
  label,
  value,
  delta,
  spark,
  tone = "primary",
}: KPICardProps) {
  const t = toneMap[tone];
  const positive = delta >= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card card-hover",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          t.grad,
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", t.icon)}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            positive
              ? "bg-primary-soft text-primary"
              : "bg-[oklch(0.96_0.06_27)] text-destructive",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(delta)}%
        </span>
      </div>

      <div className="relative mt-5">
        <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-[28px] font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </div>
      </div>

      <div className="relative -mx-2 -mb-2 mt-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={t.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={t.c1} stopOpacity={0.35} />
                <stop offset="100%" stopColor={t.c1} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={t.stroke}
              strokeWidth={2}
              fill={t.fill}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
