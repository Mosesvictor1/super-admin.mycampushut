import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  CircleAlert,
  ExternalLink,
  Eye,
  LoaderCircle,
  Megaphone,
  MoreHorizontal,
  MousePointer2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldBan,
  Target,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { contentApi, readArrayPayload, type AdCampaign, type Advertiser } from "@/lib/campushut-content-api";
import { initialBrandAds } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CampaignForm = { advertiserId: string; title: string; description: string; ctaText: string; ctaUrl: string; placement: string; priority: string; startDate: string; endDate: string; maxImpressions: string };
type AdvertiserForm = { companyName: string; contactName: string; email: string; phone: string };
type DashboardMetrics = { totalAdvertisers?: number; activeAdvertisers?: number; totalCampaigns?: number; pendingCampaigns?: number; activeCampaigns?: number; pausedCampaigns?: number; completedCampaigns?: number; totalImpressions?: number; totalClicks?: number; overallCtr?: number };

const emptyCampaign: CampaignForm = { advertiserId: "", title: "", description: "", ctaText: "Learn more", ctaUrl: "", placement: "", priority: "", startDate: "", endDate: "", maxImpressions: "" };
const emptyAdvertiser: AdvertiserForm = { companyName: "", contactName: "", email: "", phone: "" };
const getObject = (value: unknown, ...keys: string[]) => {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  for (const key of keys) if (record[key] && typeof record[key] === "object") return record[key] as Record<string, unknown>;
  return record;
};
const asString = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const asNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : 0;
const dateInput = (value?: string) => value ? value.slice(0, 10) : "";

function makeDemoCampaigns(): AdCampaign[] {
  return initialBrandAds.map((ad, index) => ({
    id: index + 1,
    advertiserId: index + 1,
    advertiserName: ad.companyName,
    title: ad.campaignTitle,
    description: ad.targetAudience,
    bannerUrl: ad.imageUrl,
    ctaText: "Learn more",
    ctaUrl: ad.linkUrl,
    placement: ad.placement,
    priority: "Standard",
    status: ad.status,
    startDate: ad.startDate,
    endDate: ad.endDate,
    maxImpressions: ad.impressions,
    currentImpressions: ad.impressions,
    currentClicks: ad.clicks,
  }));
}

function statusTone(status?: string) {
  const value = (status ?? "").toLowerCase();
  if (value.includes("active") || value.includes("approved")) return "bg-primary-soft text-primary";
  if (value.includes("pending") || value.includes("review") || value.includes("scheduled")) return "bg-accent/10 text-accent";
  if (value.includes("pause")) return "bg-muted text-muted-foreground";
  if (value.includes("complete") || value.includes("ended")) return "bg-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

export default function AdsManagerPage() {
  useDocumentTitle("CampusHut Admin — Ads Manager");
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(makeDemoCampaigns());
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({});
  const [placements, setPlacements] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<{ name: string; weight: number }[]>([]);
  const [liveCampaigns, setLiveCampaigns] = useState(false);
  const [liveAdvertisers, setLiveAdvertisers] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [advertiserError, setAdvertiserError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All campaigns");
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [advertiserDialog, setAdvertiserDialog] = useState(false);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>(emptyCampaign);
  const [advertiserForm, setAdvertiserForm] = useState<AdvertiserForm>(emptyAdvertiser);
  const [campaignImage, setCampaignImage] = useState<File | null>(null);
  const [advertiserImage, setAdvertiserImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [campaignDetails, setCampaignDetails] = useState<Record<string, unknown> | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [campaignResponse, advertiserResponse, dashboardResponse, placementResponse, priorityResponse] = await Promise.allSettled([
      contentApi.ads.adminCampaigns(),
      contentApi.advertisers.list(),
      contentApi.ads.dashboard(),
      contentApi.ads.placements(),
      contentApi.ads.priorities(),
    ]);

    if (campaignResponse.status === "fulfilled") {
      const payload = campaignResponse.value;
      const rows = readArrayPayload<AdCampaign>(payload, ["campaigns"]).filter((item) => typeof item.id === "number" && typeof item.title === "string");
      setCampaigns(rows);
      setLiveCampaigns(true);
      setCampaignError(null);
    } else {
      setCampaigns(makeDemoCampaigns());
      setLiveCampaigns(false);
      setCampaignError(campaignResponse.reason instanceof Error ? campaignResponse.reason.message : "Campaign API is unavailable.");
    }

    if (advertiserResponse.status === "fulfilled") {
      const rows = readArrayPayload<Advertiser>(advertiserResponse.value, ["advertisers"])
        .filter((item) => typeof item.id === "number" && typeof item.companyName === "string");
      setAdvertisers(rows);
      setLiveAdvertisers(true);
      setAdvertiserError(null);
    } else {
      setAdvertisers([]);
      setLiveAdvertisers(false);
      setAdvertiserError(advertiserResponse.reason instanceof Error ? advertiserResponse.reason.message : "Advertiser API is unavailable.");
    }

    if (dashboardResponse.status === "fulfilled") {
      const data = getObject(dashboardResponse.value, "dashboard");
      setMetrics(data as DashboardMetrics);
    } else setMetrics({});

    if (placementResponse.status === "fulfilled") {
      const payload = getObject(placementResponse.value);
      const values = Array.isArray(payload.placements) ? payload.placements.filter((item): item is string => typeof item === "string") : [];
      setPlacements(values);
    }

    if (priorityResponse.status === "fulfilled") {
      const values = readArrayPayload<{ name: string; weight: number }>(priorityResponse.value, ["priorities"]);
      setPriorities(values.filter((item) => typeof item.name === "string"));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const filtered = useMemo(() => campaigns.filter((campaign) => {
    const matchesText = [campaign.title, campaign.advertiserName, campaign.placement]
      .some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = filter === "All campaigns" || (campaign.status ?? "").toLowerCase() === filter.toLowerCase();
    return matchesText && matchesStatus;
  }), [campaigns, query, filter]);

  const openCampaign = () => {
    setCampaignForm({ ...emptyCampaign, placement: placements[0] ?? "", priority: priorities[0]?.name ?? "" });
    setCampaignImage(null);
    setCampaignDialog(true);
  };

  const submitCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!liveCampaigns) { toast.error("Campaign service is unavailable; sample records are read-only."); return; }
    const payload: Record<string, unknown> = {
      advertiserId: Number(campaignForm.advertiserId),
      title: campaignForm.title.trim(),
      description: campaignForm.description.trim(),
      ctaText: campaignForm.ctaText.trim(),
      ctaUrl: campaignForm.ctaUrl.trim(),
      placement: campaignForm.placement,
      priority: campaignForm.priority,
      startDate: campaignForm.startDate,
      endDate: campaignForm.endDate,
      maxImpressions: Number(campaignForm.maxImpressions),
    };
    if (!Number.isFinite(payload.advertiserId) || !Number.isFinite(payload.maxImpressions)) { toast.error("Select an advertiser and valid impression limit."); return; }
    setSaving(true);
    try {
      await contentApi.ads.create(payload, campaignImage);
      toast.success("Campaign created");
      setCampaignDialog(false);
      await loadData();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Campaign could not be created.");
    } finally { setSaving(false); }
  };

  const submitAdvertiser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!liveAdvertisers) { toast.error("Advertiser service is unavailable."); return; }
    setSaving(true);
    try {
      await contentApi.advertisers.create(advertiserForm, advertiserImage);
      toast.success("Advertiser created");
      setAdvertiserDialog(false);
      setAdvertiserForm(emptyAdvertiser);
      setAdvertiserImage(null);
      await loadData();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Advertiser could not be created.");
    } finally { setSaving(false); }
  };

  const changeCampaignStatus = async (campaign: AdCampaign, action: "pause" | "resume" | "complete" | "archive" | "approve") => {
    if (!liveCampaigns) { toast.error("Sample campaigns cannot be changed on the service."); return; }
    if (!campaign.id) return;
    try {
      await contentApi.ads.transition(campaign.id, action);
      toast.success(`Campaign ${action === "approve" ? "approved" : `${action}d`}`);
      await loadData();
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : "Campaign status could not be updated."); }
  };

  const openDetails = async (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetails(null);
    setDetailsLoading(true);
    if (liveCampaigns && campaign.id) {
      try {
        const [detail, analytics] = await Promise.all([contentApi.ads.byId(campaign.id), contentApi.ads.analytics(campaign.id)]);
        setCampaignDetails({ ...getObject(detail, "campaign"), ...getObject(analytics, "analytics") });
      } catch (cause) {
        setCampaignDetails(null);
        toast.error(cause instanceof Error ? cause.message : "Campaign insights could not be loaded.");
      }
    } else setCampaignDetails(campaign as Record<string, unknown>);
    setDetailsLoading(false);
  };

  const activeCount = metrics.activeCampaigns ?? campaigns.filter((campaign) => /active/i.test(campaign.status ?? "")).length;
  const totalImpressions = metrics.totalImpressions ?? campaigns.reduce((sum, campaign) => sum + asNumber(campaign.currentImpressions), 0);
  const totalClicks = metrics.totalClicks ?? campaigns.reduce((sum, campaign) => sum + asNumber(campaign.currentClicks), 0);
  const ctr = metrics.overallCtr ?? (totalImpressions ? (totalClicks / totalImpressions) * 100 : 0);
  const pendingCount = metrics.pendingCampaigns ?? campaigns.filter((campaign) => /pending|review/i.test(campaign.status ?? "")).length;

  const statusFilterOptions = ["All campaigns", "Active", "Pending", "Paused", "Completed"];

  return (
    <DashboardLayout title="Ads Manager" subtitle="Campaign delivery, advertisers, and performance">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2 text-sm"><span className={cn("h-2 w-2 rounded-full", liveCampaigns ? "bg-success" : "bg-accent")} /><span className="font-medium">{liveCampaigns ? "Live campaign data" : "Sample campaign data"}</span>{loading && <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />}</div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void loadData()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} /> Refresh</Button><Button onClick={openCampaign} disabled={!liveCampaigns}><Plus /> New campaign</Button></div>
      </div>

      {(campaignError || advertiserError) && <div role="status" className="mt-4 flex items-start gap-2 rounded-lg border border-accent/25 bg-accent/5 p-3 text-xs text-muted-foreground"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><p>Some live data is unavailable. Sample campaign content is read-only. {campaignError && `Campaigns: ${campaignError}`} {advertiserError && `Advertisers: ${advertiserError}`}</p></div>}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={Users} label="Advertisers" value={metrics.totalAdvertisers ?? advertisers.length} tone="primary" />
        <MiniStat icon={Megaphone} label="Active campaigns" value={activeCount} tone="blue" />
        <MiniStat icon={Eye} label="Impressions" value={totalImpressions.toLocaleString()} tone="violet" />
        <MiniStat icon={MousePointer2} label="Click-through rate" value={`${ctr.toFixed(2)}%`} tone="accent" />
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0" aria-labelledby="campaigns-title">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
            <div><h2 id="campaigns-title" className="text-base font-semibold">Campaigns</h2><p className="mt-1 text-sm text-muted-foreground">{filtered.length} campaigns · {pendingCount} awaiting review</p></div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value={statusFilterOptions[0]}>All</TabsTrigger>{statusFilterOptions.slice(1).map((option) => <TabsTrigger key={option} value={option}>{option}</TabsTrigger>)}</TabsList>
            </Tabs>
          </div>
          <div className="my-3 flex h-10 max-w-sm items-center gap-2 rounded-lg border border-input bg-card px-3"><Search className="h-4 w-4 text-muted-foreground" /><Input aria-label="Search campaigns" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Campaign or advertiser" className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" /></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-3 pr-4 font-medium">Campaign</th><th className="py-3 pr-4 font-medium">Placement</th><th className="py-3 pr-4 font-medium">Delivery</th><th className="py-3 pr-4 font-medium">Status</th><th className="py-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {filtered.map((campaign) => {
                  const impressions = asNumber(campaign.currentImpressions);
                  const limit = asNumber(campaign.maxImpressions);
                  const progress = limit ? Math.min(100, (impressions / limit) * 100) : 0;
                  return <tr key={campaign.id} className="border-b border-border/70 align-top hover:bg-muted/30">
                    <td className="py-4 pr-4"><button onClick={() => void openDetails(campaign)} className="flex max-w-[250px] items-start gap-3 text-left"><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-md bg-muted">{campaign.bannerUrl ? <img src={campaign.bannerUrl} alt="" className="h-full w-full object-cover" /> : <Megaphone className="h-4 w-4 text-primary" />}</div><span className="min-w-0"><span className="block truncate font-medium hover:text-primary">{campaign.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{campaign.advertiserName ?? "Advertiser"}</span></span></button></td>
                    <td className="py-4 pr-4 text-muted-foreground">{campaign.placement ?? "—"}</td>
                    <td className="py-4 pr-4"><div className="min-w-[130px]"><div className="flex justify-between gap-2 text-xs"><span>{impressions.toLocaleString()}</span><span className="text-muted-foreground">{limit ? `${limit.toLocaleString()} max` : "—"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div><span className="mt-1 block text-xs text-muted-foreground">{asNumber(campaign.currentClicks).toLocaleString()} clicks</span></div></td>
                    <td className="py-4 pr-4"><Badge variant="outline" className={cn("border-0", statusTone(campaign.status))}>{campaign.status ?? "Unknown"}</Badge></td>
                    <td className="py-3"><div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label={`View ${campaign.title} analytics`} title="View analytics" onClick={() => void openDetails(campaign)}><BarChart3 /></Button>
                      {/pending|review/i.test(campaign.status ?? "") && <Button variant="ghost" size="icon" aria-label={`Approve ${campaign.title}`} title="Approve" disabled={!liveCampaigns} onClick={() => void changeCampaignStatus(campaign, "approve")}><Check /></Button>}
                      {/active/i.test(campaign.status ?? "") ? <Button variant="ghost" size="icon" aria-label={`Pause ${campaign.title}`} title="Pause campaign" disabled={!liveCampaigns} onClick={() => void changeCampaignStatus(campaign, "pause")}><Pause /></Button> : /pause/i.test(campaign.status ?? "") ? <Button variant="ghost" size="icon" aria-label={`Resume ${campaign.title}`} title="Resume campaign" disabled={!liveCampaigns} onClick={() => void changeCampaignStatus(campaign, "resume")}><Play /></Button> : null}
                      <details className="relative"><summary className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-md hover:bg-muted" aria-label={`More actions for ${campaign.title}`}><MoreHorizontal className="h-4 w-4" /></summary><div className="absolute right-0 z-10 mt-1 w-40 rounded-md border border-border bg-popover p-1 shadow-md"><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs hover:bg-muted disabled:opacity-50" disabled={!liveCampaigns} onClick={() => void changeCampaignStatus(campaign, "complete")}><Check className="h-3.5 w-3.5" />Mark complete</button><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs hover:bg-muted disabled:opacity-50" disabled={!liveCampaigns} onClick={() => void changeCampaignStatus(campaign, "archive")}><ShieldBan className="h-3.5 w-3.5" />Archive campaign</button></div></details>
                    </div></td>
                  </tr>;
                })}
                {!filtered.length && <tr><td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">No campaigns match this view.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-7">
          <section aria-labelledby="delivery-title">
            <div className="flex items-center justify-between border-b border-border pb-3"><div><h2 id="delivery-title" className="text-base font-semibold">Delivery snapshot</h2><p className="mt-1 text-sm text-muted-foreground">Across campaign activity</p></div><Target className="h-5 w-5 text-primary" /></div>
            <dl className="divide-y divide-border">{[
              ["Active campaigns", metrics.activeCampaigns ?? activeCount],
              ["Paused campaigns", metrics.pausedCampaigns ?? campaigns.filter((campaign) => /pause/i.test(campaign.status ?? "")).length],
              ["Pending review", pendingCount],
              ["Total clicks", totalClicks.toLocaleString()],
            ].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between gap-3 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold tabular-nums">{value}</dd></div>)}</dl>
          </section>
          <section aria-labelledby="advertisers-title">
            <div className="flex items-center justify-between border-b border-border pb-3"><div><h2 id="advertisers-title" className="text-base font-semibold">Advertisers</h2><p className="mt-1 text-sm text-muted-foreground">{advertisers.length} live accounts</p></div><Button variant="outline" size="sm" onClick={() => { setAdvertiserForm(emptyAdvertiser); setAdvertiserImage(null); setAdvertiserDialog(true); }} disabled={!liveAdvertisers} aria-label="Add advertiser"><Plus /></Button></div>
            {advertisers.length ? <div className="divide-y divide-border">{advertisers.slice(0, 6).map((advertiser) => <div key={advertiser.id} className="flex items-center gap-3 py-3"><div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-muted">{advertiser.logoURL ? <img src={advertiser.logoURL} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-4 w-4 text-muted-foreground" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{advertiser.companyName}</p><p className="truncate text-xs text-muted-foreground">{advertiser.contactName}</p></div><Badge variant="outline" className={advertiser.active ? "border-0 bg-primary-soft text-primary" : "border-0 bg-muted text-muted-foreground"}>{advertiser.active ? "Active" : "Inactive"}</Badge></div>)}</div> : <div className="py-6 text-center text-sm text-muted-foreground">{liveAdvertisers ? "No advertiser accounts yet." : "Live advertiser accounts unavailable."}</div>}
          </section>
        </aside>
      </div>

      <Dialog open={campaignDialog} onOpenChange={setCampaignDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>Create campaign</DialogTitle><DialogDescription>Set the advertiser, placement, dates, and impression limit.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={submitCampaign}>
            <div className="space-y-1.5"><Label>Advertiser</Label><Select value={campaignForm.advertiserId} onValueChange={(value) => setCampaignForm({ ...campaignForm, advertiserId: value })}><SelectTrigger><SelectValue placeholder="Select advertiser" /></SelectTrigger><SelectContent>{advertisers.filter((advertiser) => advertiser.active).map((advertiser) => <SelectItem key={advertiser.id} value={String(advertiser.id)}>{advertiser.companyName}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label htmlFor="campaign-title">Campaign title</Label><Input id="campaign-title" value={campaignForm.title} onChange={(event) => setCampaignForm({ ...campaignForm, title: event.target.value })} required /></div>
            <div className="space-y-1.5"><Label htmlFor="campaign-description">Description</Label><Textarea id="campaign-description" value={campaignForm.description} onChange={(event) => setCampaignForm({ ...campaignForm, description: event.target.value })} rows={3} /></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label>Placement</Label><Select value={campaignForm.placement} onValueChange={(value) => setCampaignForm({ ...campaignForm, placement: value })}><SelectTrigger><SelectValue placeholder="Choose placement" /></SelectTrigger><SelectContent>{placements.map((placement) => <SelectItem key={placement} value={placement}>{placement}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Priority</Label><Select value={campaignForm.priority} onValueChange={(value) => setCampaignForm({ ...campaignForm, priority: value })}><SelectTrigger><SelectValue placeholder="Choose priority" /></SelectTrigger><SelectContent>{priorities.map((priority) => <SelectItem key={priority.name} value={priority.name}>{priority.name}{typeof priority.weight === "number" ? ` · ${priority.weight}` : ""}</SelectItem>)}</SelectContent></Select></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="campaign-start">Start date</Label><Input id="campaign-start" type="date" value={campaignForm.startDate} onChange={(event) => setCampaignForm({ ...campaignForm, startDate: event.target.value })} required /></div><div className="space-y-1.5"><Label htmlFor="campaign-end">End date</Label><Input id="campaign-end" type="date" value={campaignForm.endDate} onChange={(event) => setCampaignForm({ ...campaignForm, endDate: event.target.value })} required /></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="campaign-limit">Impression limit</Label><Input id="campaign-limit" type="number" min="1" step="1" value={campaignForm.maxImpressions} onChange={(event) => setCampaignForm({ ...campaignForm, maxImpressions: event.target.value })} required /></div><div className="space-y-1.5"><Label htmlFor="campaign-cta">Button label</Label><Input id="campaign-cta" value={campaignForm.ctaText} onChange={(event) => setCampaignForm({ ...campaignForm, ctaText: event.target.value })} required /></div></div>
            <div className="space-y-1.5"><Label htmlFor="campaign-url">Destination URL</Label><Input id="campaign-url" type="url" value={campaignForm.ctaUrl} onChange={(event) => setCampaignForm({ ...campaignForm, ctaUrl: event.target.value })} required /></div>
            <div className="space-y-1.5"><Label htmlFor="campaign-banner">Campaign banner</Label><Input id="campaign-banner" type="file" accept="image/*" onChange={(event) => setCampaignImage(event.target.files?.[0] ?? null)} /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setCampaignDialog(false)}>Cancel</Button><Button type="submit" disabled={saving || advertisers.filter((advertiser) => advertiser.active).length === 0}>{saving ? <LoaderCircle className="animate-spin" /> : <Plus />} Create campaign</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={advertiserDialog} onOpenChange={setAdvertiserDialog}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Add advertiser</DialogTitle><DialogDescription>Create an advertiser account for campaign management.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={submitAdvertiser}>{(["companyName", "contactName", "email", "phone"] as const).map((field) => <div key={field} className="space-y-1.5"><Label htmlFor={`advertiser-${field}`}>{({ companyName: "Company name", contactName: "Contact name", email: "Email address", phone: "Phone number" })[field]}</Label><Input id={`advertiser-${field}`} type={field === "email" ? "email" : "text"} value={advertiserForm[field]} onChange={(event) => setAdvertiserForm({ ...advertiserForm, [field]: event.target.value })} required /></div>)}<div className="space-y-1.5"><Label htmlFor="advertiser-logo">Company logo</Label><Input id="advertiser-logo" type="file" accept="image/*" onChange={(event) => setAdvertiserImage(event.target.files?.[0] ?? null)} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setAdvertiserDialog(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" /> : <Plus />} Add advertiser</Button></DialogFooter></form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedCampaign)} onOpenChange={(open) => { if (!open) setSelectedCampaign(null); }}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto"><DialogHeader><DialogTitle>{selectedCampaign?.title ?? "Campaign details"}</DialogTitle><DialogDescription>{selectedCampaign?.advertiserName ?? "Campaign performance and delivery"}</DialogDescription></DialogHeader>
          {detailsLoading ? <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />Loading campaign details…</div> : campaignDetails ? <div className="space-y-4">
            {selectedCampaign?.bannerUrl && <img src={selectedCampaign.bannerUrl} alt="Campaign banner" className="max-h-52 w-full rounded-lg object-cover" />}
            <div className="grid grid-cols-2 gap-3">{[["Status", campaignDetails.status], ["Placement", campaignDetails.placement], ["Impressions", campaignDetails.impressions ?? campaignDetails.currentImpressions], ["Clicks", campaignDetails.clicks ?? campaignDetails.currentClicks], ["CTR", typeof campaignDetails.ctr === "number" ? `${campaignDetails.ctr}%` : "—"], ["Impression limit", campaignDetails.maxImpressions]].map(([label, value]) => <div key={String(label)} className="border-b border-border py-2"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value === undefined || value === null ? "—" : String(value)}</p></div>)}</div>
            {campaignDetails.ctaUrl && <a href={String(campaignDetails.ctaUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Open campaign link <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div> : <p className="py-8 text-sm text-muted-foreground">Campaign detail and analytics are unavailable for this sample record.</p>}
          <DialogFooter><Button variant="outline" onClick={() => setSelectedCampaign(null)}>Close</Button><Button variant="secondary" onClick={() => { if (selectedCampaign?.ctaUrl) window.open(selectedCampaign.ctaUrl, "_blank", "noopener,noreferrer"); }} disabled={!selectedCampaign?.ctaUrl}>Visit destination <ArrowUpRight /></Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}