import { useState } from "react";
import {
  Activity,
  Apple,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  LoaderCircle,
  Plus,
  RefreshCw,
  Smartphone,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { contentApi, type AppVersionRequest } from "@/lib/campushut-content-api";
import { toast } from "sonner";

type Platform = AppVersionRequest["platform"];
type ReleaseForm = { platform: Platform; version: string; buildNumber: string; downloadUrl: string; active: boolean; existingId: string };
type CheckResult = { status: "idle" | "loading" | "success" | "error"; value?: unknown; error?: string };
type CreatedRelease = AppVersionRequest & { id?: number; createdAt: string };

const emptyForm: ReleaseForm = { platform: "ANDROID", version: "", buildNumber: "", downloadUrl: "", active: true, existingId: "" };
const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "No value returned";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
};

export default function AppVersionsPage() {
  useDocumentTitle("CampusHut Admin — Mobile App Versions");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReleaseForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [releases, setReleases] = useState<CreatedRelease[]>([]);
  const [checks, setChecks] = useState<Record<Platform, CheckResult>>({
    ANDROID: { status: "idle" }, IOS: { status: "idle" },
  });
  const [adminChecks, setAdminChecks] = useState<Record<Platform, CheckResult>>({
    ANDROID: { status: "idle" }, IOS: { status: "idle" },
  });

  const runAdminCheck = async (platform: Platform) => {
    setAdminChecks((all) => ({ ...all, [platform]: { status: "loading" } }));
    try {
      const value = await contentApi.versions.adminCheck(platform);
      setAdminChecks((all) => ({ ...all, [platform]: { status: "success", value } }));
      toast.success(`${platform === "IOS" ? "iOS" : "Android"} release status refreshed`);
    } catch (cause) {
      const error = cause instanceof Error ? cause.message : "Release status could not be loaded.";
      setAdminChecks((all) => ({ ...all, [platform]: { status: "error", error } }));
      toast.error(error);
    }
  };

  const checkClientVersion = async (platform: Platform, version: string, build: number) => {
    setChecks((all) => ({ ...all, [platform]: { status: "loading" } }));
    try {
      const value = await contentApi.versions.check(platform, version, build);
      setChecks((all) => ({ ...all, [platform]: { status: "success", value } }));
    } catch (cause) {
      const error = cause instanceof Error ? cause.message : "Version check failed.";
      setChecks((all) => ({ ...all, [platform]: { status: "error", error } }));
      toast.error(error);
    }
  };

  const submitRelease = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request: AppVersionRequest = {
      platform: form.platform,
      version: form.version.trim(),
      buildNumber: Number(form.buildNumber),
      downloadUrl: form.downloadUrl.trim(),
      active: form.active,
    };
    if (!Number.isInteger(request.buildNumber) || request.buildNumber < 0) {
      toast.error("Enter a valid whole build number.");
      return;
    }
    setSaving(true);
    try {
      const existingId = Number(form.existingId);
      if (form.existingId && (!Number.isInteger(existingId) || existingId <= 0)) {
        toast.error("Enter a valid existing version ID, or leave it blank to create a release.");
        setSaving(false);
        return;
      }
      const response = form.existingId
        ? await contentApi.versions.update(existingId, request)
        : await contentApi.versions.create(request);
      const id = response && typeof response === "object" && "id" in response
        ? Number((response as { id: unknown }).id) : undefined;
      setReleases((all) => [{ ...request, id: Number.isFinite(id) ? id : undefined, createdAt: new Date().toISOString() }, ...all]);
      toast.success(form.existingId ? "App version updated" : "App version created");
      setOpen(false);
      setForm(emptyForm);
      void runAdminCheck(request.platform);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "The app version could not be created.");
    } finally {
      setSaving(false);
    }
  };

  const platforms: { key: Platform; label: string; icon: typeof Smartphone; accent: string }[] = [
    { key: "ANDROID", label: "Android", icon: Smartphone, accent: "text-primary" },
    { key: "IOS", label: "iOS", icon: Apple, accent: "text-foreground" },
  ];

  return (
    <DashboardLayout title="Mobile app versions" subtitle="Release controls and client compatibility checks">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniStat icon={Smartphone} label="Platforms" value="2" tone="primary" />
        <MiniStat icon={Activity} label="Release records this session" value={releases.length} tone="blue" />
        <MiniStat icon={Clock3} label="Version history" value="API unavailable" tone="accent" />
      </div>

      <section className="mt-7" aria-labelledby="platforms-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="platforms-title" className="text-base font-semibold">Platform status</h2><p className="mt-1 text-sm text-muted-foreground">Refresh status from the version service.</p></div>
          <Button onClick={() => setOpen(true)}><Plus /> Create app version</Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {platforms.map(({ key, label, icon: Icon, accent }) => {
            const result = adminChecks[key];
            return (
              <div key={key} className="border-y border-border py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted"><Icon className={`h-5 w-5 ${accent}`} /></div>
                    <div className="min-w-0"><h3 className="font-semibold">{label}</h3><p className="text-xs text-muted-foreground">{key} release channel</p></div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void runAdminCheck(key)} disabled={result.status === "loading"}>
                    {result.status === "loading" ? <LoaderCircle className="animate-spin" /> : <RefreshCw />} Refresh
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {result.status === "success" ? <><CheckCircle2 className="h-4 w-4 text-success" /><span className="font-medium">Connected</span><Badge variant="outline">Live</Badge></>
                    : result.status === "error" ? <><CircleAlert className="h-4 w-4 text-destructive" /><span className="font-medium">Unable to load status</span></>
                      : <><span className="h-2 w-2 rounded-full bg-muted-foreground" /><span className="text-muted-foreground">Status not checked</span></>}
                </div>
                {result.status === "success" && <pre className="mt-3 max-h-44 overflow-auto rounded-lg bg-muted/70 p-3 text-xs leading-relaxed">{formatValue(result.value)}</pre>}
                {result.status === "error" && <p role="alert" className="mt-2 text-xs text-muted-foreground">{result.error}</p>}
                <div className="mt-4 border-t border-border pt-4">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Client version check</h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_110px_auto]">
                    <Input aria-label={`${label} app version`} placeholder="Version (e.g. 2.4.0)" id={`${key}-version`} />
                    <Input aria-label={`${label} build number`} placeholder="Build" type="number" min="0" id={`${key}-build`} />
                    <Button variant="secondary" onClick={() => {
                      const version = (document.getElementById(`${key}-version`) as HTMLInputElement | null)?.value.trim();
                      const build = Number((document.getElementById(`${key}-build`) as HTMLInputElement | null)?.value);
                      if (!version || !Number.isInteger(build) || build < 0) { toast.error("Enter a version and valid build number first."); return; }
                      void checkClientVersion(key, version, build);
                    }} disabled={checks[key].status === "loading"}>
                      {checks[key].status === "loading" ? <LoaderCircle className="animate-spin" /> : <Activity />} Check
                    </Button>
                  </div>
                  {checks[key].status === "success" && <pre className="mt-3 max-h-36 overflow-auto rounded-lg bg-muted/70 p-3 text-xs">{formatValue(checks[key].value)}</pre>}
                  {checks[key].status === "error" && <p role="alert" className="mt-2 text-xs text-destructive">{checks[key].error}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="release-history-title">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div><h2 id="release-history-title" className="text-base font-semibold">Created in this session</h2><p className="mt-1 text-sm text-muted-foreground">The API does not expose a version-history list.</p></div>
          <Badge variant="outline">Session records</Badge>
        </div>
        {releases.length ? <div className="divide-y divide-border">
          {releases.map((release, index) => <div key={`${release.platform}-${release.version}-${index}`} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><Upload className="h-4 w-4" /></div><div><p className="font-medium">{release.platform === "IOS" ? "iOS" : "Android"} · {release.version} <span className="text-muted-foreground">(build {release.buildNumber})</span></p><p className="text-xs text-muted-foreground">Created {new Date(release.createdAt).toLocaleString()}</p></div></div>
            <div className="flex items-center gap-3"><Badge variant={release.active ? "default" : "secondary"}>{release.active ? "Active" : "Inactive"}</Badge><a href={release.downloadUrl} target="_blank" rel="noreferrer" aria-label="Open release download" className="rounded-md p-2 text-muted-foreground hover:bg-muted"><Download className="h-4 w-4" /></a></div>
          </div>)}
        </div> : <div className="py-10 text-center text-sm text-muted-foreground">No version records have been created in this session.</div>}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create app version</DialogTitle><DialogDescription>Register a release using the documented Android and iOS fields.</DialogDescription></DialogHeader>
          <form onSubmit={submitRelease} className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="existing-version-id">Existing version ID <span className="font-normal text-muted-foreground">(leave blank to create)</span></Label><Input id="existing-version-id" type="number" min="1" value={form.existingId} onChange={(event) => setForm({ ...form, existingId: event.target.value })} placeholder="Optional ID to update" /></div>
            <div className="space-y-1.5"><Label>Platform</Label><Select value={form.platform} onValueChange={(value: Platform) => setForm({ ...form, platform: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ANDROID">Android</SelectItem><SelectItem value="IOS">iOS</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label htmlFor="version-name">Version</Label><Input id="version-name" value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} placeholder="2.4.0" required /></div><div className="space-y-1.5"><Label htmlFor="build-number">Build number</Label><Input id="build-number" value={form.buildNumber} onChange={(event) => setForm({ ...form, buildNumber: event.target.value })} type="number" min="0" step="1" placeholder="240" required /></div></div>
            <div className="space-y-1.5"><Label htmlFor="download-url">Download URL</Label><Input id="download-url" type="url" value={form.downloadUrl} onChange={(event) => setForm({ ...form, downloadUrl: event.target.value })} placeholder="https://…" required /></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div><Label htmlFor="version-active">Make version active</Label><p className="mt-1 text-xs text-muted-foreground">The release becomes available to clients.</p></div><Switch id="version-active" checked={form.active} onCheckedChange={(active) => setForm({ ...form, active })} /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" /> : form.existingId ? <RefreshCw /> : <Plus />}{form.existingId ? "Update version" : "Create version"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}