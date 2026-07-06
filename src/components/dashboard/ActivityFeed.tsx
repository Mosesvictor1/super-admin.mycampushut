import {
  UserPlus,
  CreditCard,
  CheckCircle2,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

type Activity = {
  icon: LucideIcon;
  tone: "primary" | "blue" | "violet" | "accent";
  title: string;
  meta: string;
  time: string;
};

const data: Activity[] = [
  {
    icon: UserPlus,
    tone: "primary",
    title: "New student registered",
    meta: "Chinedu Okafor · University of Lagos",
    time: "2m ago",
  },
  {
    icon: CreditCard,
    tone: "blue",
    title: "Subscription renewed — Premium",
    meta: "₦24,000 · Aisha Bello",
    time: "8m ago",
  },
  {
    icon: CheckCircle2,
    tone: "violet",
    title: "AI Course completed",
    meta: "Generative AI Fundamentals · Tunde A.",
    time: "14m ago",
  },
  {
    icon: Briefcase,
    tone: "accent",
    title: "Job application submitted",
    meta: "Frontend Intern · Andela",
    time: "27m ago",
  },
  {
    icon: UserPlus,
    tone: "primary",
    title: "New student registered",
    meta: "Ngozi Eze · University of Nigeria, Nsukka",
    time: "42m ago",
  },
  {
    icon: CreditCard,
    tone: "blue",
    title: "Subscription upgraded — Basic → Premium",
    meta: "₦12,000 · Emeka N.",
    time: "1h ago",
  },
];

const toneCls: Record<Activity["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  blue: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
  violet: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
  accent: "bg-[oklch(0.96_0.04_50)] text-accent",
};

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Recent Activity</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Live platform events
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
        </div>
      </div>

      <ul className="space-y-1">
        {data.map((a, i) => (
          <li
            key={i}
            className="group flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-muted/60"
          >
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneCls[a.tone]}`}
            >
              <a.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-medium text-foreground truncate">
                {a.title}
              </div>
              <div className="text-[12px] text-muted-foreground truncate">{a.meta}</div>
            </div>
            <div className="text-[11px] text-muted-foreground whitespace-nowrap pt-0.5">
              {a.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
