import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "accent" | "violet" | "blue";

const toneCls: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-[oklch(0.96_0.04_50)] text-accent",
  violet: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
  blue: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
};

export function MiniStat({
  icon: Icon,
  label,
  value,
  delta,
  suffix,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delta?: number;
  suffix?: string;
  tone?: Tone;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card card-hover">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", toneCls[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              positive
                ? "bg-primary-soft text-primary"
                : "bg-[oklch(0.96_0.06_27)] text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-[26px] font-semibold tracking-tight text-foreground tabular-nums">
          {value}
          {suffix && <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
