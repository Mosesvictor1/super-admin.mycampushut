import { useMemo, useState } from "react";
import {
  Store,
  ShoppingBag,
  Wallet,
  Percent,
  Search,
  Filter,
  Download,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BadgeCheck,
  Package,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  marketplaceKPIs,
  gmvTrend,
  vendorCategories,
  topVendors,
  marketplaceOrders,
  pendingVendors,
  type VendorStatus,
  type VendorTier,
} from "@/lib/mock-data";

const tierStyles: Record<VendorTier, string> = {
  Elite: "bg-gradient-to-br from-primary/15 to-accent/15 text-primary ring-primary/30",
  Verified: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.45_0.15_240)] ring-[oklch(0.45_0.15_240)]/20",
  Standard: "bg-muted text-muted-foreground ring-border",
};

const statusStyles: Record<VendorStatus, string> = {
  Active: "bg-primary-soft text-primary ring-primary/20",
  Pending: "bg-[oklch(0.97_0.05_80)] text-[oklch(0.55_0.15_80)] ring-[oklch(0.55_0.15_80)]/20",
  Suspended: "bg-[oklch(0.96_0.06_27)] text-destructive ring-destructive/20",
};

const orderStatusStyles: Record<string, string> = {
  Delivered: "bg-primary-soft text-primary",
  Shipped: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.45_0.15_240)]",
  Processing: "bg-[oklch(0.97_0.05_80)] text-[oklch(0.55_0.15_80)]",
  Cancelled: "bg-[oklch(0.96_0.06_27)] text-destructive",
};

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 px-3 py-2 shadow-card text-[12px]">
      {label && <div className="font-medium mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {p.name === "gmv" ? `₦${p.value}M` : Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  useDocumentTitle(
    "CampusHut Admin — Marketplace",
    "Vendor management, GMV, orders, and marketplace performance.",
  );

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | VendorStatus>("All");
  const [selected, setSelected] = useState<(typeof topVendors)[number] | null>(null);

  const filtered = useMemo(() => {
    return topVendors.filter((v) => {
      const matchQ =
        !q ||
        v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.owner.toLowerCase().includes(q.toLowerCase()) ||
        v.category.toLowerCase().includes(q.toLowerCase());
      const matchS = statusFilter === "All" || v.status === statusFilter;
      return matchQ && matchS;
    });
  }, [q, statusFilter]);

  return (
    <DashboardLayout
      title="Marketplace"
      subtitle="Vendors, GMV, and order operations across CampusHut"
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => toast.success("Vendor invitation link copied")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition shadow-card"
        >
          <Plus className="h-4 w-4" />
          Invite vendor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat icon={Wallet} tone="primary" label="GMV (30D)" value={marketplaceKPIs.gmv.value} delta={marketplaceKPIs.gmv.delta} />
        <MiniStat icon={Store} tone="blue" label="Active Vendors" value={marketplaceKPIs.vendors.value.toLocaleString()} delta={marketplaceKPIs.vendors.delta} />
        <MiniStat icon={ShoppingBag} tone="violet" label="Orders (30D)" value={marketplaceKPIs.orders.value.toLocaleString()} delta={marketplaceKPIs.orders.delta} />
        <MiniStat icon={Percent} tone="accent" label="Take Rate" value={marketplaceKPIs.takeRate.value} delta={marketplaceKPIs.takeRate.delta} />
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard title="GMV Trend" description="Gross merchandise value (₦M) and order volume · last 12 months">
            <div className="h-[300px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvTrend} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="gmv" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gmvGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Vendors by Category" description="Share of active vendors">
          <div className="relative h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorCategories}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                  stroke="none"
                >
                  {vendorCategories.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip content={<TT />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Vendors</div>
              <div className="text-2xl font-semibold tracking-tight tabular-nums">
                {marketplaceKPIs.vendors.value}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {vendorCategories.map((c) => (
              <div key={c.name} className="flex items-center gap-2 rounded-lg border border-border p-2 text-[12px]">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground truncate flex-1">{c.name}</span>
                <span className="font-semibold tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>


      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Vendors table */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex flex-wrap items-center gap-3 p-5 border-b border-border">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Vendor Management</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {filtered.length} of {topVendors.length} vendors
              </p>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search vendors…"
                  className="w-44 bg-transparent outline-none placeholder:text-muted-foreground/70"
                />
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 text-[12px]">
                {(["All", "Active", "Pending", "Suspended"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 transition",
                      statusFilter === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => toast.success("Vendor CSV export queued")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm hover:border-primary/40 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Vendor</th>
                  <th className="text-left font-medium px-5 py-3">Category</th>
                  <th className="text-left font-medium px-5 py-3">GMV</th>
                  <th className="text-left font-medium px-5 py-3">Orders</th>
                  <th className="text-left font-medium px-5 py-3">Rating</th>
                  <th className="text-left font-medium px-5 py-3">Tier</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr
                    key={v.name}
                    onClick={() => setSelected(v)}
                    className="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 text-[11px] font-semibold text-primary">
                          {v.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{v.name}</div>
                          <div className="text-[11.5px] text-muted-foreground truncate">{v.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-foreground/80">{v.category}</td>
                    <td className="px-5 py-3.5 tabular-nums font-semibold">
                      ₦{(v.gmv / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {v.orders.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-[12px] font-semibold text-primary">
                        <Star className="h-3 w-3 fill-current" />
                        {v.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                          tierStyles[v.tier],
                        )}
                      >
                        {v.tier === "Elite" && <BadgeCheck className="h-3 w-3" />}
                        {v.tier === "Verified" && <ShieldCheck className="h-3 w-3" />}
                        {v.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                          statusStyles[v.status],
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            v.status === "Active" && "bg-primary",
                            v.status === "Pending" && "bg-[oklch(0.65_0.15_80)]",
                            v.status === "Suspended" && "bg-destructive",
                          )}
                        />
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending approvals */}
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="p-5 border-b border-border">
            <h3 className="text-[15px] font-semibold tracking-tight">Pending Approvals</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {pendingVendors.length} vendor applications awaiting review
            </p>
          </div>
          <div className="p-3 space-y-2">
            {pendingVendors.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-border p-3 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 text-[11px] font-semibold text-primary">
                    {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-[11.5px] text-muted-foreground truncate">
                      {p.owner} · {p.category}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Submitted {p.submitted}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toast.error(`${p.name} rejected`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11.5px] hover:border-destructive/40 hover:text-destructive transition"
                    >
                      <XCircle className="h-3 w-3" />
                      Reject
                    </button>
                    <button
                      onClick={() => toast.success(`${p.name} approved`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11.5px] font-medium text-primary-foreground hover:brightness-110 transition"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">Recent Marketplace Orders</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Latest transactions across all vendors</p>
          </div>
          <button
            onClick={() => toast("Order log — full view coming soon")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm hover:border-primary/40 transition"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-5 py-3">Order ID</th>
                <th className="text-left font-medium px-5 py-3">Buyer</th>
                <th className="text-left font-medium px-5 py-3">Vendor</th>
                <th className="text-left font-medium px-5 py-3">Items</th>
                <th className="text-left font-medium px-5 py-3">Amount</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-left font-medium px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => toast(`Order ${o.id} — ${o.status}`)}
                  className="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono text-[12px] text-muted-foreground">{o.id}</td>
                  <td className="px-5 py-3.5 font-medium">{o.buyer}</td>
                  <td className="px-5 py-3.5 text-foreground/80">{o.vendor}</td>
                  <td className="px-5 py-3.5 tabular-nums">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Package className="h-3 w-3" />
                      {o.items}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums font-semibold">
                    ₦{o.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[11.5px] font-medium",
                        orderStatusStyles[o.status],
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor detail modal */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-primary">
                    {selected.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>
                      {selected.owner} · Joined {selected.joined}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
                <Stat label="Category" value={selected.category} />
                <Stat label="Tier" value={selected.tier} />
                <Stat label="GMV" value={`₦${(selected.gmv / 1_000_000).toFixed(2)}M`} />
                <Stat label="Orders" value={selected.orders.toLocaleString()} />
                <Stat label="Rating" value={`${selected.rating} / 5`} />
                <Stat label="Status" value={selected.status} />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    toast.error(`${selected.name} suspended`);
                    setSelected(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm hover:border-destructive/40 hover:text-destructive transition"
                >
                  Suspend
                </button>
                <button
                  onClick={() => {
                    toast.success(`Opened ${selected.name} storefront`);
                    setSelected(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
                >
                  View storefront
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
