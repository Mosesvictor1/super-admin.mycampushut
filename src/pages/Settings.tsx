import {
  ShieldCheck,
  Users,
  KeyRound,
  Plug,
  Bell,
  Mail,
  Building2,
  Palette,
  Check,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roles = [
  { name: "Super Admin", members: 3, scope: "Full access to all modules & billing", tone: "primary" },
  { name: "Finance Ops", members: 6, scope: "Finance module, transactions, exports", tone: "blue" },
  { name: "Growth Team", members: 9, scope: "Users, campaigns, engagement metrics", tone: "violet" },
  { name: "Placements", members: 5, scope: "Jobs, recruiters, hiring pipeline", tone: "accent" },
  { name: "Content Editor", members: 12, scope: "Library, AI courses, assignments", tone: "primary" },
] as const;

const initialIntegrations = [
  { name: "Stripe", desc: "Payments & subscriptions", status: "Connected", icon: "S" },
  { name: "SendGrid", desc: "Transactional email", status: "Connected", icon: "@" },
  { name: "Slack", desc: "Alerts & escalations", status: "Connected", icon: "#" },
  { name: "Segment", desc: "Product analytics pipeline", status: "Not connected", icon: "≡" },
  { name: "Zapier", desc: "Workflow automations", status: "Not connected", icon: "⚡" },
  { name: "Google Workspace", desc: "SSO & directory sync", status: "Connected", icon: "G" },
];

const toneCls = {
  primary: "bg-primary-soft text-primary",
  blue: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.50_0.15_240)]",
  violet: "bg-[oklch(0.96_0.04_300)] text-[oklch(0.55_0.18_300)]",
  accent: "bg-[oklch(0.96_0.04_50)] text-accent",
} as const;

export default function SettingsPage() {
  useDocumentTitle("CampusHut Admin — Settings");
  const [brand, setBrand] = useState("#16A34A");
  const [density, setDensity] = useState<"Cozy" | "Compact">("Cozy");
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [notifs, setNotifs] = useState([
    { label: "Critical alerts", desc: "Payment failures, downtime", on: true },
    { label: "Weekly digest", desc: "Every Monday 09:00 IST", on: true },
    { label: "Product updates", desc: "New features & changelogs", on: false },
    { label: "Security events", desc: "Sign-ins, role changes", on: true },
  ]);

  return (
    <DashboardLayout title="Settings" subtitle="Roles, permissions, integrations, and workspace configuration">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Workspace</h3>
              <p className="text-[12px] text-muted-foreground">CampusHut · Admin Console v1.0</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Organization name", value: "CampusHut EdTech Pvt. Ltd." },
              { label: "Support email", value: "admin@campushut.io" },
              { label: "Time zone", value: "Asia/Kolkata (GMT+05:30)" },
              { label: "Fiscal year start", value: "April" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-border p-3.5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                <div className="mt-1 text-[13.5px] font-medium truncate">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Appearance</h3>
              <p className="text-[12px] text-muted-foreground">Brand & theme</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-[12.5px]">Brand color</span>
              <div className="flex items-center gap-1">
                {["#16A34A", "#F97316", "#0EA5E9", "#8B5CF6"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBrand(c);
                      toast.success(`Brand color set to ${c}`);
                    }}
                    className={cn("h-6 w-6 rounded-md ring-1 ring-border cursor-pointer", c === brand && "ring-2 ring-primary")}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-[12.5px]">Density</span>
              <div className="flex items-center rounded-lg bg-muted p-0.5 text-[11.5px]">
                {(["Cozy", "Compact"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={cn("px-2.5 py-1 rounded-md", d === density ? "bg-card shadow-sm font-medium" : "text-muted-foreground")}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-[12.5px]">Sidebar theme</span>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">Emerald</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Roles & Permissions</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">Role-based access controls for the admin console</p>
            </div>
          </div>
          <button
            onClick={() => toast.success("Invite sent (demo)")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm hover:border-primary/40"
          >
            <Users className="h-3.5 w-3.5" />
            Invite member
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
          {roles.map((r) => (
            <div key={r.name} className="rounded-xl border border-border p-4 card-hover">
              <div className="flex items-center justify-between">
                <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11.5px] font-semibold", toneCls[r.tone])}>
                  <ShieldCheck className="h-3 w-3" />
                  {r.name}
                </span>
                <span className="text-[11.5px] text-muted-foreground tabular-nums">{r.members} members</span>
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground">{r.scope}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Plug className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">Integrations</h3>
                <p className="mt-0.5 text-[12px] text-muted-foreground">Connect the tools your team already uses</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
            {integrations.map((i, idx) => {
              const connected = i.status === "Connected";
              return (
                <div key={i.name} className="flex items-center gap-3 rounded-xl border border-border p-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-[15px] font-bold text-foreground/80">
                    {i.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium">{i.name}</div>
                    <div className="text-[11.5px] text-muted-foreground truncate">{i.desc}</div>
                  </div>
                  <button
                    onClick={() => {
                      setIntegrations((all) =>
                        all.map((x, j) =>
                          j === idx
                            ? { ...x, status: connected ? "Not connected" : "Connected" }
                            : x,
                        ),
                      );
                      toast.success(`${i.name} ${connected ? "disconnected" : "connected"}`);
                    }}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-medium",
                      connected
                        ? "bg-primary-soft text-primary"
                        : "bg-foreground text-background hover:brightness-110",
                    )}
                  >
                    {connected ? <Check className="h-3 w-3" /> : null}
                    {i.status}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card p-5">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-[15px] font-semibold tracking-tight">Notifications</h3>
          </div>
          <div className="mt-4 space-y-3">
            {notifs.map((n, idx) => (
              <button
                key={n.label}
                onClick={() =>
                  setNotifs((all) => all.map((x, j) => (j === idx ? { ...x, on: !x.on } : x)))
                }
                className="w-full flex items-center justify-between rounded-xl border border-border p-3 hover:border-primary/40 transition-colors"
              >
                <div className="min-w-0 text-left">
                  <div className="text-[13px] font-medium">{n.label}</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{n.desc}</div>
                </div>
                <span
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    n.on ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all", n.on ? "left-4" : "left-0.5")} />
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-border p-3.5">
            <div className="flex items-center gap-2 text-[12.5px] font-medium">
              <KeyRound className="h-3.5 w-3.5 text-accent" />
              API Keys
            </div>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              2 active keys · rotated 12 days ago
            </p>
            <button
              onClick={() => toast("Key management — coming soon")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-foreground px-2.5 py-1 text-[11.5px] font-medium text-background"
            >
              <Mail className="h-3 w-3" />
              Manage keys
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
