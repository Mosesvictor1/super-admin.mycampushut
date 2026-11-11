import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { studentRows as ALL_ROWS } from "@/lib/mock-data";
import { StudentDetailModal, type StudentDetail } from "./StudentDetailModal";

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-primary-soft text-primary ring-primary/20";
    case "suspended":
      return "bg-[oklch(0.96_0.06_50)] text-accent ring-accent/30";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

const planClass = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "basic":
      return "bg-[oklch(0.96_0.04_240)] text-[oklch(0.45_0.15_240)]";
    case "premium":
      return "bg-gradient-to-br from-primary/10 to-accent/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

interface ServerPagination {
  page: number;
  size: number;
  total: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function DataTable({
  title = "Student Analytics",
  subtitle,
  rows,
  perPage = 6,
  searchValue,
  onSearchChange,
  serverPagination,
}: {
  title?: string;
  subtitle?: string;
  rows?: StudentDetail[];
  perPage?: number;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  serverPagination?: ServerPagination;
} = {}) {
  const ROWS = rows ?? ALL_ROWS;
  const [q, setQ] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<StudentDetail | null>(null);
  const [open, setOpen] = useState(false);
  const search = searchValue ?? q;

  const filtered = useMemo(() => {
    const f = serverPagination
      ? [...ROWS]
      : ROWS.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.university.toLowerCase().includes(search.toLowerCase()),
        );
    f.sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return f;
  }, [search, sortAsc, ROWS, serverPagination]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      serverPagination ? serverPagination.total / serverPagination.size : filtered.length / perPage,
    ),
  );
  const currentPage = serverPagination ? serverPagination.page + 1 : page;
  const slice = serverPagination ? filtered : filtered.slice((page - 1) * perPage, page * perPage);
  const canGoNext = serverPagination ? serverPagination.hasNext : page < totalPages;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center gap-3 p-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {subtitle ?? `${serverPagination?.total ?? filtered.length} students`}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                if (onSearchChange) onSearchChange(value);
                else setQ(value);
                setPage(1);
              }}
              placeholder="Search students…"
              className="w-44 bg-transparent outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          {!serverPagination && (
            <>
              <button
                onClick={() => toast("Filters — coming soon")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm hover:border-primary/40 transition"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
              </button>
              <button
                onClick={() => toast.success("CSV export queued")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="text-left font-medium px-5 py-3">
                {serverPagination ? (
                  "Student"
                ) : (
                  <button
                    onClick={() => setSortAsc((s) => !s)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Student
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                )}
              </th>
              <th className="text-left font-medium px-5 py-3">University</th>
              <th className="text-left font-medium px-5 py-3">Plan</th>
              <th className="text-left font-medium px-5 py-3">Last Active</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr
                key={("id" in r ? r.id : undefined) ?? i}
                onClick={() => {
                  setSelected(r);
                  setOpen(true);
                }}
                className="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-[11px] font-semibold text-primary">
                      {r.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{r.name}</div>
                      <div className="text-[11.5px] text-muted-foreground truncate">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-foreground/80">{r.university}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11.5px] font-medium",
                      planClass(r.plan),
                    )}
                  >
                    {r.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground tabular-nums">{r.lastActive}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                      statusClass(r.status),
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        r.status.toLowerCase() === "active" && "bg-primary",
                        r.status.toLowerCase() === "suspended" && "bg-accent",
                        !["active", "suspended"].includes(r.status.toLowerCase()) &&
                          "bg-muted-foreground",
                      )}
                    />
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {!slice.length && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
        <div className="text-[12px] text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              serverPagination
                ? serverPagination.onPageChange(Math.max(0, serverPagination.page - 1))
                : setPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background disabled:opacity-40 hover:border-primary/40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              serverPagination
                ? serverPagination.onPageChange(serverPagination.page + 1)
                : setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={!canGoNext}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background disabled:opacity-40 hover:border-primary/40 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <StudentDetailModal student={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
