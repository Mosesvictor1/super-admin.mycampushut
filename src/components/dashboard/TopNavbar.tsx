import { Bell, Calendar, ChevronDown, Download, Search, Command } from "lucide-react";

export function TopNavbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 glass">
      <div className="flex items-center gap-4 px-6 py-3.5">
        {/* Title */}
        <div className="min-w-0 hidden md:block">
          <div className="text-[15px] font-semibold tracking-tight text-foreground truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-[12px] text-muted-foreground truncate">{subtitle}</div>
          )}
        </div>

        {/* Search */}
        <div className="ml-auto flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm shadow-soft focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
            placeholder="Search students, transactions, jobs…"
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        {/* Date filter */}
        <button className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-soft hover:border-primary/40 transition">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Last 30 days
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {/* Export */}
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.62_0.17_148_/_0.6)] hover:brightness-110 transition">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Bell */}
        <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-card shadow-soft hover:border-primary/40 transition">
          <Bell className="h-[18px] w-[18px] text-foreground/80" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-card animate-pulse-dot" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card pl-1 pr-2.5 py-1 shadow-soft hover:border-primary/40 transition">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.16_148)] text-[11px] font-semibold text-primary-foreground">
            AK
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
