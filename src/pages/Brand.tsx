import { useState, useMemo } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Trash2,
  Edit,
  TrendingUp,
  Percent,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  initialBrandAds,
  adPerformanceTrend,
  type BrandAd,
  type AdPlacement,
  type AdStatus,
} from "@/lib/mock-data";

const PLACEMENTS: AdPlacement[] = [
  "Dashboard Banner",
  "Sidebar Ad",
  "Job Board Sponsor",
  "Marketplace Special",
];

const STATUSES: AdStatus[] = ["Active", "Scheduled", "Ended"];

const IMAGE_PRESETS = [
  { name: "Digital Payments", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60" },
  { name: "Finance & Savings", url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60" },
  { name: "Telecommunications", url: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&auto=format&fit=crop&q=60" },
  { name: "Learning & Education", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card/95 px-3 py-2 shadow-card text-[12px]">
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.stroke }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BrandPage() {
  useDocumentTitle("CampusHut Admin — Brand Ads Management");

  const [ads, setAds] = useState<BrandAd[]>(initialBrandAds);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AdStatus>("All");
  const [placementFilter, setPlacementFilter] = useState<"All" | AdPlacement>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<BrandAd | null>(null);

  // Form states
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formCampaignTitle, setFormCampaignTitle] = useState("");
  const [formPlacement, setFormPlacement] = useState<AdPlacement>("Dashboard Banner");
  const [formStatus, setFormStatus] = useState<AdStatus>("Active");
  const [formBudget, setFormBudget] = useState(100000);
  const [formSpent, setFormSpent] = useState(0);
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formTargetAudience, setFormTargetAudience] = useState("");
  const [formImageUrl, setFormImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [formLinkUrl, setFormLinkUrl] = useState("");

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchQuery =
        !q ||
        ad.companyName.toLowerCase().includes(q.toLowerCase()) ||
        ad.campaignTitle.toLowerCase().includes(q.toLowerCase()) ||
        ad.targetAudience.toLowerCase().includes(q.toLowerCase());

      const matchStatus = statusFilter === "All" || ad.status === statusFilter;
      const matchPlacement = placementFilter === "All" || ad.placement === placementFilter;

      return matchQuery && matchStatus && matchPlacement;
    });
  }, [ads, q, statusFilter, placementFilter]);

  const kpis = useMemo(() => {
    const totalBudget = ads.reduce((sum, ad) => sum + ad.budget, 0);
    const activeAds = ads.filter((ad) => ad.status === "Active").length;
    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return { totalBudget, activeAds, totalImpressions, avgCtr };
  }, [ads]);

  const openCreateModal = () => {
    setEditingAd(null);
    setFormCompanyName("");
    setFormCampaignTitle("");
    setFormPlacement("Dashboard Banner");
    setFormStatus("Active");
    setFormBudget(250000);
    setFormSpent(0);
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );
    setFormTargetAudience("All students");
    setFormImageUrl(IMAGE_PRESETS[0].url);
    setCustomImageUrl("");
    setFormLinkUrl("https://");
    setIsModalOpen(true);
  };

  const openEditModal = (ad: BrandAd) => {
    setEditingAd(ad);
    setFormCompanyName(ad.companyName);
    setFormCampaignTitle(ad.campaignTitle);
    setFormPlacement(ad.placement);
    setFormStatus(ad.status);
    setFormBudget(ad.budget);
    setFormSpent(ad.spent);
    setFormStartDate(ad.startDate);
    setFormEndDate(ad.endDate);
    setFormTargetAudience(ad.targetAudience);
    setFormLinkUrl(ad.linkUrl);

    const isPreset = IMAGE_PRESETS.some((preset) => preset.url === ad.imageUrl);
    if (isPreset) {
      setFormImageUrl(ad.imageUrl);
      setCustomImageUrl("");
    } else {
      setFormImageUrl("custom");
      setCustomImageUrl(ad.imageUrl);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCompanyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!formCampaignTitle.trim()) {
      toast.error("Campaign title is required");
      return;
    }
    if (formBudget <= 0) {
      toast.error("Budget must be greater than zero");
      return;
    }
    if (!formStartDate || !formEndDate) {
      toast.error("Start and end dates are required");
      return;
    }

    const finalImageUrl = formImageUrl === "custom" ? customImageUrl : formImageUrl;
    if (!finalImageUrl.trim()) {
      toast.error("Ad image URL is required");
      return;
    }

    if (editingAd) {
      setAds((prev) =>
        prev.map((ad) =>
          ad.id === editingAd.id
            ? {
                ...ad,
                companyName: formCompanyName,
                campaignTitle: formCampaignTitle,
                placement: formPlacement,
                status: formStatus,
                budget: formBudget,
                spent: formSpent,
                startDate: formStartDate,
                endDate: formEndDate,
                targetAudience: formTargetAudience,
                imageUrl: finalImageUrl,
                linkUrl: formLinkUrl,
              }
            : ad
        )
      );
      toast.success("Campaign updated successfully");
    } else {
      const newAd: BrandAd = {
        id: `ad-${Date.now()}`,
        companyName: formCompanyName,
        campaignTitle: formCampaignTitle,
        placement: formPlacement,
        status: formStatus,
        budget: formBudget,
        spent: formSpent,
        startDate: formStartDate,
        endDate: formEndDate,
        targetAudience: formTargetAudience,
        imageUrl: finalImageUrl,
        linkUrl: formLinkUrl,
        impressions: 0,
        clicks: 0,
      };
      setAds((prev) => [newAd, ...prev]);
      toast.success("Ad campaign launched successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ad campaign?")) {
      setAds((prev) => prev.filter((ad) => ad.id !== id));
      toast.success("Ad campaign deleted successfully");
    }
  };

  const placementColors: Record<AdPlacement, string> = {
    "Dashboard Banner": "bg-primary-soft text-primary ring-primary/20",
    "Sidebar Ad": "bg-[oklch(0.96_0.04_240)] text-[oklch(0.45_0.15_240)] ring-[oklch(0.45_0.15_240)]/20",
    "Job Board Sponsor": "bg-[oklch(0.97_0.05_80)] text-[oklch(0.55_0.15_80)] ring-[oklch(0.55_0.15_80)]/20",
    "Marketplace Special": "bg-[oklch(0.96_0.05_300)] text-[oklch(0.65_0.18_300)] ring-[oklch(0.65_0.18_300)]/20",
  };

  const statusColors: Record<AdStatus, string> = {
    Active: "bg-primary-soft text-primary ring-primary/20",
    Scheduled: "bg-[oklch(0.97_0.05_80)] text-[oklch(0.55_0.15_80)] ring-[oklch(0.55_0.15_80)]/20",
    Ended: "bg-muted text-muted-foreground ring-border",
  };

  return (
    <DashboardLayout
      title="Brand & Ads Console"
      subtitle="Publish, schedule, and measure promotional campaigns for partner companies across the CampusHut platform"
    >
      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat
          icon={Megaphone}
          tone="primary"
          label="Active Campaigns"
          value={kpis.activeAds.toString()}
          delta={0}
        />
        <MiniStat
          icon={DollarSign}
          tone="violet"
          label="Total Ad Portfolio"
          value={`₦${(kpis.totalBudget / 1_000_000).toFixed(2)}M`}
          delta={0}
        />
        <MiniStat
          icon={TrendingUp}
          tone="blue"
          label="Total Ad Reach"
          value={kpis.totalImpressions.toLocaleString()}
          delta={0}
        />
        <MiniStat
          icon={Percent}
          tone="accent"
          label="Average CTR"
          value={`${kpis.avgCtr.toFixed(2)}%`}
          delta={0}
        />
      </div>

      {/* Chart and Sidebar */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ChartCard
            title="Real-time Ad Engagement Trend"
            description="Daily impressions vs clicks across all campaigns"
            action={
              <div className="flex items-center gap-3 text-[11.5px]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Impressions
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[oklch(0.55_0.15_240)]" /> Clicks
                </span>
              </div>
            }
          >
            <div className="h-[260px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adPerformanceTrend} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gImp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="oklch(0.55 0.15 240)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.92 0.008 240)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="impressions" stroke="oklch(0.62 0.17 148)" strokeWidth={2.5} fill="url(#gImp)" />
                  <Area type="monotone" dataKey="clicks" stroke="oklch(0.55 0.15 240)" strokeWidth={2} fill="url(#gClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Ad Guidelines / Best practices card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">Campus Ads Guidelines</h3>
            <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">
              Maintain clean, educational, and high-CTR banners for the student body. Always specify targeted demographics.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-2.5 text-[12.5px] items-start">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Dashboard Banner: 728 x 90 or 1200 x 300 ratios</span>
              </div>
              <div className="flex gap-2.5 text-[12.5px] items-start">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Sidebar Ad: 300 x 250 grid placement format</span>
              </div>
              <div className="flex gap-2.5 text-[12.5px] items-start">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Job Board Sponsor: Direct corporate logo link</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-[11.5px] text-muted-foreground">Placement Quality Index</span>
            <span className="text-sm font-bold text-primary flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              98.4%
            </span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search companies or keywords…"
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground">Placement:</span>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none cursor-pointer focus:border-primary/40"
            >
              <option value="All">All Placements</option>
              {PLACEMENTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none cursor-pointer focus:border-primary/40"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition shadow-card"
        >
          <Plus className="h-4 w-4" />
          Launch Campaign
        </button>
      </div>

      {/* Campaigns Listing Table */}
      <div className="mt-5 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Megaphone className="h-12 w-12 text-muted-foreground/60 mb-2" />
              <p className="font-medium text-foreground/80">No campaigns found</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Launch a campaign or refine search criteria.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/20">
                  <th className="text-left font-medium px-5 py-3.5">Brand / Company</th>
                  <th className="text-left font-medium px-5 py-3.5">Placement</th>
                  <th className="text-left font-medium px-5 py-3.5">Target Audience</th>
                  <th className="text-left font-medium px-5 py-3.5">Budget Usage</th>
                  <th className="text-right font-medium px-5 py-3.5">Impressions</th>
                  <th className="text-right font-medium px-5 py-3.5">CTR</th>
                  <th className="text-center font-medium px-5 py-3.5">Status</th>
                  <th className="text-center font-medium px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => {
                  const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
                  const pctSpent = Math.round((ad.spent / ad.budget) * 100);

                  return (
                    <tr
                      key={ad.id}
                      className="border-t border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.imageUrl}
                            alt={ad.companyName}
                            className="h-10 w-16 rounded-lg object-cover bg-muted shrink-0 border border-border"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-foreground block truncate">
                              {ad.companyName}
                            </span>
                            <span className="text-[12px] text-muted-foreground block truncate">
                              {ad.campaignTitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                            placementColors[ad.placement]
                          )}
                        >
                          {ad.placement}
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-[200px]">
                        <span className="text-[12.5px] text-foreground/80 line-clamp-2">
                          {ad.targetAudience}
                        </span>
                      </td>

                      <td className="px-5 py-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11.5px] mb-1 font-medium text-foreground/85">
                          <span>₦{ad.spent.toLocaleString()}</span>
                          <span className="text-muted-foreground">₦{ad.budget.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full bg-primary",
                              pctSpent >= 90 && "bg-destructive",
                              pctSpent >= 60 && pctSpent < 90 && "bg-accent"
                            )}
                            style={{ width: `${Math.min(100, pctSpent)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {pctSpent}% utilized · Ends {ad.endDate}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-mono text-[12.5px] text-foreground/80">
                        {ad.impressions.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="font-semibold text-foreground block tabular-nums">
                          {ctr.toFixed(2)}%
                        </span>
                        <span className="text-[10.5px] text-muted-foreground block tabular-nums">
                          {ad.clicks.toLocaleString()} clicks
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset",
                            statusColors[ad.status]
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              ad.status === "Active"
                                ? "bg-primary"
                                : ad.status === "Scheduled"
                                ? "bg-accent"
                                : "bg-muted-foreground"
                            )}
                          />
                          {ad.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {ad.linkUrl && (
                            <a
                              href={ad.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                              title="Visit Destination Link"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(ad)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                            title="Edit Campaign"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ad.id)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAd ? "Modify Ad Campaign" : "Launch New Campaign"}</DialogTitle>
            <DialogDescription>
              Set details, targeted placements, funding budget, and display content for the brand ad.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Brand / Company Name
                </label>
                <input
                  value={formCompanyName}
                  onChange={(e) => setFormCompanyName(e.target.value)}
                  placeholder="e.g. Google, PiggyVest"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Campaign Title
                </label>
                <input
                  value={formCampaignTitle}
                  onChange={(e) => setFormCampaignTitle(e.target.value)}
                  placeholder="e.g. Summer Savings Challenge"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Placement
                </label>
                <select
                  value={formPlacement}
                  onChange={(e) => setFormPlacement(e.target.value as AdPlacement)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                >
                  {PLACEMENTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Campaign Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AdStatus)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Budget (₦)
                </label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  placeholder="Budget"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Utilized Spend (₦)
                </label>
                <input
                  type="number"
                  value={formSpent}
                  onChange={(e) => setFormSpent(Number(e.target.value))}
                  placeholder="Spent"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  End Date
                </label>
                <input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Target Audience Criteria
                </label>
                <input
                  value={formTargetAudience}
                  onChange={(e) => setFormTargetAudience(e.target.value)}
                  placeholder="e.g. Computer Science majors, final-year students"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Destination URL
                </label>
                <input
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                  placeholder="https://company.com/campaign"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Campaign Banner Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground block">Choose from Presets:</span>
                    <select
                      value={formImageUrl === "custom" || IMAGE_PRESETS.some(p => p.url === formImageUrl) ? formImageUrl : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormImageUrl(val);
                        if (val !== "custom") {
                          setCustomImageUrl("");
                        }
                      }}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {IMAGE_PRESETS.map((preset) => (
                        <option key={preset.name} value={preset.url}>
                          {preset.name}
                        </option>
                      ))}
                      <option value="custom">Custom Image Link...</option>
                    </select>
                  </div>

                  {(formImageUrl === "custom" || !IMAGE_PRESETS.some(p => p.url === formImageUrl)) && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-muted-foreground block">Paste Custom URL:</span>
                      <input
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://example.com/banner.png"
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition shadow-card"
              >
                {editingAd ? "Save Changes" : "Launch Campaign"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
