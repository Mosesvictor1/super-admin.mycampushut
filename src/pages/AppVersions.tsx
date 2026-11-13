import { useEffect, useState } from "react";
import {
  Activity,
  Apple,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  ExternalLink,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { contentApi, type AppVersionRequest } from "@/lib/campushut-content-api";
import { toast } from "sonner";

type Platform = AppVersionRequest["platform"];
type ReleaseForm = {
  platform: Platform;
  version: string;
  buildNumber: string;
  downloadUrl: string;
  active: boolean;
  existingId: string;
};
type CheckResult = {
  status: "idle" | "loading" | "success" | "error";
  value?: unknown;
  error?: string;
};
type CreatedRelease = AppVersionRequest & { id?: number; createdAt: string };

const emptyForm: ReleaseForm = {
  platform: "ANDROID",
  version: "",
  buildNumber: "",
  downloadUrl: "",
  active: true,
  existingId: "",
};
const PLATFORM_KEYS: Platform[] = ["ANDROID", "IOS"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const humanize = (key: string) => {
  const text = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Renders any value as readable text instead of raw JSON. */
function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "")
    return <span className="text-muted-foreground">Not provided</span>;
  if (typeof value === "boolean")
    return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
  if (typeof value === "string" && /^https?:\/\//.test(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-w-0 items-center gap-1 break-all text-primary hover:underline"
      >
        {value}
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );
  }
  if (Array.isArray(value))
    return <span>{value.map((item) => String(item)).join(", ") || "None"}</span>;
  if (isRecord(value)) return <KeyValueList data={value} />;
  return <span className="break-words">{String(value)}</span>;
}

function KeyValueList({ data, hide = [] }: { data: Record<string, unknown>; hide?: string[] }) {
  const entries = Object.entries(data).filter(([key]) => !hide.includes(key));
  if (!entries.length) return <p className="text-sm text-muted-foreground">No details returned.</p>;
  return (
    <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
      {entries.map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="text-muted-foreground">{humanize(key)}</dt>
          <dd className="min-w-0">
            <FieldValue value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Latest release card for the admin status endpoint. */
function ReleaseSummary({ value }: { value: unknown }) {
  if (!isRecord(value)) {
    return (
      <p className="mt-3 text-sm">
        {value ? String(value) : "No release has been registered yet."}
      </p>
    );
  }
  if (!("latestVersion" in value)) {
    return (
      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <KeyValueList data={value} hide={["Status", "status"]} />
      </div>
    );
  }
  const { latestVersion, latestBuild, downloadUrl, active, message, Message, appId } =
    value as Record<string, unknown>;
  const note = (message ?? Message) as string | undefined;
  return (
    <div className="mt-3 rounded-lg bg-muted/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Latest version</p>
          <p className="text-2xl font-semibold tracking-tight">{String(latestVersion ?? "—")}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Build {latestBuild !== undefined ? String(latestBuild) : "—"}
            {appId !== undefined ? ` · App ID ${String(appId)}` : ""}
          </p>
        </div>
        <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>
      </div>
      {typeof downloadUrl === "string" && downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-w-0 items-center gap-1.5 break-all text-sm text-primary hover:underline"
        >
          <Download className="h-3.5 w-3.5 shrink-0" />
          Open download page
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )}
      {note && <p className="mt-3 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default function AppVersionsPage() {
  useDocumentTitle("CampusHut Admin — Mobile App Versions");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReleaseForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [releases, setReleases] = useState<CreatedRelease[]>([]);
  const [checks, setChecks] = useState<Record<Platform, CheckResult>>({
    ANDROID: { status: "idle" },
    IOS: { status: "idle" },
  });
  const [adminChecks, setAdminChecks] = useState<Record<Platform, CheckResult>>({
    ANDROID: { status: "idle" },
    IOS: { status: "idle" },
  });

  const runAdminCheck = async (platform: Platform, silent = false) => {
    setAdminChecks((all) => ({ ...all, [platform]: { status: "loading" } }));
    try {
      const value = await contentApi.versions.adminCheck(platform);
      setAdminChecks((all) => ({ ...all, [platform]: { status: "success", value } }));
      if (!silent)
        toast.success(`${platform === "IOS" ? "iOS" : "Android"} release status refreshed`);
    } catch (cause) {
      const error = cause instanceof Error ? cause.message : "Release status could not be loaded.";
      setAdminChecks((all) => ({ ...all, [platform]: { status: "error", error } }));
      if (!silent) toast.error(error);
    }
  };

  // Load both platforms automatically when the page opens.
  useEffect(() => {
    PLATFORM_KEYS.forEach((platform) => void runAdminCheck(platform, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const id =
        response && typeof response === "object" && "id" in response
          ? Number((response as { id: unknown }).id)
          : undefined;
      setReleases((all) => [
        {
          ...request,
          id: Number.isFinite(id) ? id : undefined,
          createdAt: new Date().toISOString(),
        },
        ...all,
      ]);
      toast.success(form.existingId ? "App version updated" : "App version created");
      setOpen(false);
      setForm(emptyForm);
      void runAdminCheck(request.platform, true);
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
    <DashboardLayout
      title="Mobile app versions"
      subtitle="Release controls and client compatibility checks"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MiniStat icon={Smartphone} label="Platforms" value="2" tone="primary" />
        <MiniStat
          icon={Activity}
          label="Release records this session"
          value={releases.length}
          tone="blue"
        />
        <MiniStat icon={Clock3} label="Version history" value="API unavailable" tone="accent" />
      </div>

      <section className="mt-7" aria-labelledby="platforms-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="platforms-title" className="text-base font-semibold">
              Platform status
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The latest release for each platform loads automatically.
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus /> Create app version
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {platforms.map(({ key, label, icon: Icon, accent }) => {
            const result = adminChecks[key];
            return (
              <div key={key} className="border-y border-border py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-muted">
                      <Icon className={`h-5 w-5 ${accent}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{label}</h3>
                      <p className="text-xs text-muted-foreground">{key} release channel</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void runAdminCheck(key)}
                    disabled={result.status === "loading"}
                  >
                    {result.status === "loading" ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <RefreshCw />
                    )}{" "}
                    Refresh
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {result.status === "success" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="font-medium">Connected</span>
                      <Badge variant="outline">Live</Badge>
                    </>
                  ) : result.status === "error" ? (
                    <>
                      <CircleAlert className="h-4 w-4 text-destructive" />
                      <span className="font-medium">Unable to load status</span>
                    </>
                  ) : result.status === "loading" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading latest release…</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="text-muted-foreground">Status not checked</span>
                    </>
                  )}
                </div>
                {result.status === "success" && <ReleaseSummary value={result.value} />}
                {result.status === "error" && (
                  <p role="alert" className="mt-2 text-xs text-muted-foreground">
                    {result.error}
                  </p>
                )}
                <div className="mt-4 border-t border-border pt-4">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Client version check
                  </h4>
                  <div className="mt-2 grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_110px_auto]">
                    <Input
                      aria-label={`${label} app version`}
                      placeholder="Version (e.g. 2.4.0)"
                      id={`${key}-version`}
                    />
                    <Input
                      aria-label={`${label} build number`}
                      placeholder="Build"
                      type="number"
                      min="0"
                      id={`${key}-build`}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const version = (
                          document.getElementById(`${key}-version`) as HTMLInputElement | null
                        )?.value.trim();
                        const build = Number(
                          (document.getElementById(`${key}-build`) as HTMLInputElement | null)
                            ?.value,
                        );
                        if (!version || !Number.isInteger(build) || build < 0) {
                          toast.error("Enter a version and valid build number first.");
                          return;
                        }
                        void checkClientVersion(key, version, build);
                      }}
                      disabled={checks[key].status === "loading"}
                    >
                      {checks[key].status === "loading" ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Activity />
                      )}{" "}
                      Check
                    </Button>
                  </div>
                  {checks[key].status === "success" && (
                    <div className="mt-3 rounded-lg bg-muted/50 p-3">
                      {isRecord(checks[key].value) ? (
                        <KeyValueList
                          data={checks[key].value as Record<string, unknown>}
                          hide={["Status", "status"]}
                        />
                      ) : (
                        <FieldValue value={checks[key].value} />
                      )}
                    </div>
                  )}
                  {checks[key].status === "error" && (
                    <p role="alert" className="mt-2 text-xs text-destructive">
                      {checks[key].error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="release-history-title">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 id="release-history-title" className="text-base font-semibold">
              Created in this session
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The API does not expose a version-history list.
            </p>
          </div>
          <Badge variant="outline">Session records</Badge>
        </div>
        {releases.length ? (
          <div className="divide-y divide-border">
            {releases.map((release, index) => (
              <div
                key={`${release.platform}-${release.version}-${index}`}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {release.platform === "IOS" ? "iOS" : "Android"} · {release.version}{" "}
                      <span className="text-muted-foreground">(build {release.buildNumber})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(release.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={release.active ? "default" : "secondary"}>
                    {release.active ? "Active" : "Inactive"}
                  </Badge>
                  <a
                    href={release.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open release download"
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No version records have been created in this session.
          </div>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create app version</DialogTitle>
            <DialogDescription>
              Register a release using the documented Android and iOS fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRelease} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="existing-version-id">
                Existing version ID{" "}
                <span className="font-normal text-muted-foreground">(leave blank to create)</span>
              </Label>
              <Input
                id="existing-version-id"
                type="number"
                min="1"
                value={form.existingId}
                onChange={(event) => setForm({ ...form, existingId: event.target.value })}
                placeholder="Optional ID to update"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(value: Platform) => setForm({ ...form, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANDROID">Android</SelectItem>
                  <SelectItem value="IOS">iOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="version-name">Version</Label>
                <Input
                  id="version-name"
                  value={form.version}
                  onChange={(event) => setForm({ ...form, version: event.target.value })}
                  placeholder="2.4.0"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="build-number">Build number</Label>
                <Input
                  id="build-number"
                  value={form.buildNumber}
                  onChange={(event) => setForm({ ...form, buildNumber: event.target.value })}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="240"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="download-url">Download URL</Label>
              <Input
                id="download-url"
                type="url"
                value={form.downloadUrl}
                onChange={(event) => setForm({ ...form, downloadUrl: event.target.value })}
                placeholder="https://…"
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="version-active">Make version active</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  The release becomes available to clients.
                </p>
              </div>
              <Switch
                id="version-active"
                checked={form.active}
                onCheckedChange={(active) => setForm({ ...form, active })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <LoaderCircle className="animate-spin" />
                ) : form.existingId ? (
                  <RefreshCw />
                ) : (
                  <Plus />
                )}
                {form.existingId ? "Update version" : "Create version"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
