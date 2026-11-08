import { Calendar, CalendarRange, ChevronDown, Download, Search, Command } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardDateRange } from "./dashboard-date-range-context";
import { downloadDashboardWorkbook, type DashboardExportData } from "@/lib/dashboard-export";

const RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This quarter",
  "Year to date",
];

function formatCustomLabel(start: string, end: string) {
  if (!start || !end) return "Custom range";
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRangeFilters(range: string) {
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case "Today":
      break;
    case "Last 7 days":
      start.setDate(start.getDate() - 6);
      break;
    case "Last 30 days":
      start.setDate(start.getDate() - 29);
      break;
    case "Last 90 days":
      start.setDate(start.getDate() - 89);
      break;
    case "This quarter":
      start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
      break;
    case "Year to date":
      start.setMonth(0, 1);
      break;
    default:
      return {};
  }

  return { startDate: formatDateInput(start), endDate: formatDateInput(end) };
}

export function TopNavbar({
  title,
  subtitle,
  exportData,
}: {
  title: string;
  subtitle?: string;
  exportData?: DashboardExportData | (() => Promise<DashboardExportData>);
}) {
  const { range, filters, setDateRange } = useDashboardDateRange();
  const [q, setQ] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Date range dropdown state
  const [dateOpen, setDateOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const dateError = customStart && customEnd && customStart > customEnd;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    toast(`Searching "${q}"…`, { description: "Global search is a preview in this demo." });
  };

  const exportDashboard = async () => {
    if (!exportData || isExporting) return;
    setIsExporting(true);
    try {
      const workbookData = typeof exportData === "function" ? await exportData() : exportData;
      await downloadDashboardWorkbook(workbookData);
      toast.success("Excel workbook downloaded");
    } catch (error) {
      toast.error("Could not export dashboard data", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const applyCustomRange = () => {
    if (!customStart || !customEnd || dateError) return;
    setDateRange(formatCustomLabel(customStart, customEnd), {
      startDate: customStart,
      endDate: customEnd,
    });
    toast.success(`Range set to ${formatCustomLabel(customStart, customEnd)}`);
    setDateOpen(false);
    setCustomMode(false);
  };

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="flex items-center gap-4 px-6 py-3.5">
        <div className="min-w-0 hidden md:block">
          <div className="text-[15px] font-semibold tracking-tight text-foreground truncate">
            {title}
          </div>
          {subtitle && <div className="text-[12px] text-muted-foreground truncate">{subtitle}</div>}
        </div>

        <form
          onSubmit={onSearch}
          className="ml-auto flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-sm shadow-soft focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70"
            placeholder="Search students, transactions, jobs…"
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </form>

        <DropdownMenu
          open={dateOpen}
          onOpenChange={(o) => {
            setDateOpen(o);
            if (!o) setCustomMode(false);
          }}
        >
          <DropdownMenuTrigger asChild>
            <button className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-soft hover:border-primary/40 transition">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {range}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={customMode ? "w-72" : "w-48"}>
            {!customMode && (
              <>
                <DropdownMenuLabel>Date range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {RANGES.map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => {
                      setDateRange(r, getRangeFilters(r));
                      toast.success(`Range set to ${r}`);
                    }}
                  >
                    {r}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setCustomStart(filters.startDate ?? "");
                    setCustomEnd(filters.endDate ?? "");
                    setCustomMode(true);
                  }}
                  className="gap-2"
                >
                  <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                  Custom range…
                </DropdownMenuItem>
              </>
            )}

            {customMode && (
              <div className="p-1" onKeyDown={(e) => e.stopPropagation()}>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <CalendarRange className="h-3.5 w-3.5 text-muted-foreground" />
                  Custom range
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-2.5 px-2 py-2">
                  <label className="flex flex-col gap-1 text-[12px] font-medium text-muted-foreground">
                    Start date
                    <input
                      type="date"
                      value={customStart}
                      max={customEnd || undefined}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[12px] font-medium text-muted-foreground">
                    End date
                    <input
                      type="date"
                      value={customEnd}
                      min={customStart || undefined}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  {dateError && (
                    <div className="text-[11px] text-destructive">
                      Start date must be before end date.
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between gap-2 px-1 pt-1">
                  <button
                    onClick={() => setCustomMode(false)}
                    className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-muted/60 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={applyCustomRange}
                    disabled={!customStart || !customEnd || !!dateError}
                    className="rounded-lg bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground shadow-soft hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => void exportDashboard()}
          disabled={!exportData || isExporting}
          title={
            !exportData ? "No dashboard data is available to export." : "Download Excel workbook"
          }
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.62_0.17_148_/_0.6)] hover:brightness-110 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{isExporting ? "Exporting…" : "Export Excel"}</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card pl-1 pr-2.5 py-1 shadow-soft hover:border-primary/40 transition">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.16_148)] text-[11px] font-semibold text-primary-foreground">
                AK
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">Adebayo Ogunleye</div>
              <div className="text-[11px] font-normal text-muted-foreground">
                admin@campushut.io
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("Signed out (demo)")}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
