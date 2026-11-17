import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, Gift, LoaderCircle, Percent, Plus, Search, UserPlus, Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardQueryState } from "@/components/dashboard/DashboardQueryState";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { readAmbassadorReport, readTiers, referralApi } from "@/lib/referral-api";
import { toast } from "sonner";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const money = (n: number | undefined) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const errorMessage = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

/** Pulls a readable message / code out of the loosely-shaped API envelopes. */
function describe(value: unknown): string {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  const body = isRecord(value.body) ? value.body : value;
  const parts = [body.ambassadorCode, body.referralCode, body.code, body.message, body.Message]
    .filter((v) => typeof v === "string" && v)
    .map(String);
  return parts.join(" · ") || JSON.stringify(body);
}

function rewardTone(status?: string | null) {
  const s = (status ?? "").toLowerCase();
  if (/paid|approved|complete/.test(s)) return "default" as const;
  if (/pending|processing/.test(s)) return "secondary" as const;
  return "outline" as const;
}

function useMutationToast<TArg>(
  fn: (arg: TArg) => Promise<unknown>,
  success: string,
  invalidate: string[] = [],
  onDone?: (result: unknown) => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (result) => {
      toast.success(success);
      invalidate.forEach((key) => void client.invalidateQueries({ queryKey: [key] }));
      onDone?.(result);
    },
    onError: (e) => toast.error(errorMessage(e, "Request failed.")),
  });
}

export default function AmbassadorsPage() {
  useDocumentTitle("CampusHut Admin — Ambassador Referrals");
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [search, setSearch] = useState("");
  const [tierOpen, setTierOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [tierForm, setTierForm] = useState({
    tierName: "",
    minimumRegistrations: "",
    minimumPaidSubscriptions: "",
    rewardAmount: "",
    active: true,
  });
  const [email, setEmail] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [codeToCheck, setCodeToCheck] = useState("");
  const [recordCode, setRecordCode] = useState("");
  const [recordEmail, setRecordEmail] = useState("");
  const [toolResult, setToolResult] = useState("");

  const report = useQuery({
    queryKey: ["ambassador-report", month, year],
    queryFn: async () => readAmbassadorReport(await referralApi.monthlyReport(month, year)),
  });
  const tiers = useQuery({
    queryKey: ["ambassador-tiers"],
    queryFn: async () => readTiers(await referralApi.tiers()),
  });

  const createTier = useMutationToast(
    referralApi.createTier,
    "Tier created",
    ["ambassador-tiers", "ambassador-report"],
    () => {
      setTierOpen(false);
      setTierForm({
        tierName: "",
        minimumRegistrations: "",
        minimumPaidSubscriptions: "",
        rewardAmount: "",
        active: true,
      });
    },
  );
  const register = useMutationToast(
    referralApi.register,
    "Ambassador registered",
    ["ambassador-report"],
    (r) => {
      setRegisterOpen(false);
      setEmail("");
      const text = describe(r);
      if (text) toast.info(text);
    },
  );
  const recordReg = useMutationToast(
    (a: { code: string; email: string }) => referralApi.recordRegistration(a.code, a.email),
    "Referral registration recorded",
    ["ambassador-report"],
    (r) => {
      setRecordCode("");
      setRecordEmail("");
      setToolResult(describe(r));
    },
  );
  const lookup = useMutationToast(
    (a: { kind: "code" | "check" | "dashboard"; value: string }) =>
      a.kind === "code"
        ? referralApi.referralCode(a.value)
        : a.kind === "check"
          ? referralApi.checkCode(a.value)
          : referralApi.dashboard(a.value, month, year),
    "Done",
    [],
    (r) => setToolResult(describe(r)),
  );

  const rows = (report.data ?? []).filter((r) =>
    `${r.studentEmail ?? ""} ${r.ambassadorCode ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const all = report.data ?? [];
  const totalReg = all.reduce((s, r) => s + (r.totalRegistered ?? 0), 0);
  const totalPaid = all.reduce((s, r) => s + (r.totalPaidSubscriptions ?? 0), 0);
  const totalRewards = all.reduce((s, r) => s + (r.rewardAmount ?? 0), 0);
  const conversion = totalReg ? (totalPaid / totalReg) * 100 : 0;

  const submitTier = (event: React.FormEvent) => {
    event.preventDefault();
    const minimumRegistrations = Number(tierForm.minimumRegistrations);
    const minimumPaidSubscriptions = Number(tierForm.minimumPaidSubscriptions);
    const rewardAmount = Number(tierForm.rewardAmount);
    if (
      !Number.isInteger(minimumRegistrations) ||
      minimumRegistrations < 0 ||
      !Number.isInteger(minimumPaidSubscriptions) ||
      minimumPaidSubscriptions < 0 ||
      !(rewardAmount >= 0)
    ) {
      toast.error("Targets must be whole numbers and the reward a positive amount.");
      return;
    }
    createTier.mutate({
      tierName: tierForm.tierName.trim(),
      minimumRegistrations,
      minimumPaidSubscriptions,
      rewardAmount,
      active: tierForm.active,
    });
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <DashboardLayout
      title="Ambassador referrals"
      subtitle="Student ambassador performance, tiers and rewards"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[140px]" aria-label="Month">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[100px]" aria-label="Year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTierOpen(true)}>
            <Plus /> Create tier
          </Button>
          <Button onClick={() => setRegisterOpen(true)}>
            <UserPlus /> Register ambassador
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={Users} label="Ambassadors" value={all.length} tone="primary" />
        <MiniStat icon={UserPlus} label="Referred sign-ups" value={totalReg} tone="blue" />
        <MiniStat
          icon={Percent}
          label="Paid conversion"
          value={conversion.toFixed(1)}
          suffix="%"
          tone="violet"
        />
        <MiniStat
          icon={Gift}
          label="Rewards this month"
          value={money(totalRewards)}
          tone="accent"
        />
      </div>

      <section className="mt-7" aria-labelledby="report-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="report-title" className="text-base font-semibold">
            Monthly report · {MONTHS[month - 1]} {year}
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search email or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search ambassadors"
            />
          </div>
        </div>
        <DashboardQueryState
          isLoading={report.isLoading}
          error={report.error}
          onRetry={() => void report.refetch()}
        >
          <div className="rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ambassador</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Registered</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length ? (
                  rows.map((r, i) => (
                    <TableRow key={r.ambassadorId ?? i}>
                      <TableCell className="font-medium">{r.studentEmail ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{r.ambassadorCode ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.totalRegistered ?? 0}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.totalPaidSubscriptions ?? 0}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {(r.conversionRate ?? 0).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        {r.achievedTier ? (
                          <Badge variant="outline">{r.achievedTier}</Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(r.rewardAmount)}
                      </TableCell>
                      <TableCell>
                        {r.rewardStatus ? (
                          <Badge variant={rewardTone(r.rewardStatus)}>{r.rewardStatus}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No ambassador activity for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DashboardQueryState>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="tiers-title">
          <h2 id="tiers-title" className="mb-3 text-base font-semibold">
            Reward tiers
          </h2>
          <DashboardQueryState
            isLoading={tiers.isLoading}
            error={tiers.error}
            onRetry={() => void tiers.refetch()}
          >
            {tiers.data?.length ? (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                {tiers.data.map((t, i) => (
                  <div
                    key={t.id ?? t.tierName ?? i}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{t.tierName ?? "Unnamed tier"}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.minimumRegistrations ?? 0} sign-ups · {t.minimumPaidSubscriptions ?? 0}{" "}
                          paid
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">{money(t.rewardAmount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No tiers yet. Create one to start rewarding ambassadors.
              </p>
            )}
          </DashboardQueryState>
        </section>

        <section aria-labelledby="tools-title">
          <h2 id="tools-title" className="mb-3 text-base font-semibold">
            Lookup &amp; manual tools
          </h2>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="space-y-1.5">
              <Label htmlFor="lookup-email">Ambassador email</Label>
              <div className="flex gap-2">
                <Input
                  id="lookup-email"
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="student@school.edu"
                />
                <Button
                  variant="secondary"
                  disabled={!lookupEmail.trim() || lookup.isPending}
                  onClick={() => lookup.mutate({ kind: "code", value: lookupEmail.trim() })}
                >
                  Get code
                </Button>
                <Button
                  variant="secondary"
                  disabled={!lookupEmail.trim() || lookup.isPending}
                  onClick={() => lookup.mutate({ kind: "dashboard", value: lookupEmail.trim() })}
                >
                  Dashboard
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="check-code">Validate code</Label>
              <div className="flex gap-2">
                <Input
                  id="check-code"
                  value={codeToCheck}
                  onChange={(e) => setCodeToCheck(e.target.value)}
                  placeholder="Ambassador code"
                />
                <Button
                  variant="secondary"
                  disabled={!codeToCheck.trim() || lookup.isPending}
                  onClick={() => lookup.mutate({ kind: "check", value: codeToCheck.trim() })}
                >
                  Check
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="record-code">Record referred registration</Label>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  id="record-code"
                  value={recordCode}
                  onChange={(e) => setRecordCode(e.target.value)}
                  placeholder="Ambassador code"
                />
                <Input
                  aria-label="Referred student email"
                  type="email"
                  value={recordEmail}
                  onChange={(e) => setRecordEmail(e.target.value)}
                  placeholder="Referred email"
                />
                <Button
                  disabled={!recordCode.trim() || !recordEmail.trim() || recordReg.isPending}
                  onClick={() =>
                    recordReg.mutate({ code: recordCode.trim(), email: recordEmail.trim() })
                  }
                >
                  Record
                </Button>
              </div>
            </div>
            {toolResult && (
              <p role="status" className="break-words rounded-lg bg-muted/50 p-3 text-sm">
                {toolResult}
              </p>
            )}
          </div>
        </section>
      </div>

      <Dialog open={tierOpen} onOpenChange={setTierOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create ambassador tier</DialogTitle>
            <DialogDescription>Set the monthly targets and reward for this tier.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitTier} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tier-name">Tier name</Label>
              <Input
                id="tier-name"
                required
                value={tierForm.tierName}
                onChange={(e) => setTierForm({ ...tierForm, tierName: e.target.value })}
                placeholder="Gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tier-regs">Min. registrations</Label>
                <Input
                  id="tier-regs"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={tierForm.minimumRegistrations}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, minimumRegistrations: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tier-paid">Min. paid subs</Label>
                <Input
                  id="tier-paid"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={tierForm.minimumPaidSubscriptions}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, minimumPaidSubscriptions: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tier-reward">Reward amount (₦)</Label>
              <Input
                id="tier-reward"
                type="number"
                min="0"
                step="any"
                required
                value={tierForm.rewardAmount}
                onChange={(e) => setTierForm({ ...tierForm, rewardAmount: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="tier-active">Active</Label>
              <Switch
                id="tier-active"
                checked={tierForm.active}
                onCheckedChange={(active) => setTierForm({ ...tierForm, active })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTierOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTier.isPending}>
                {createTier.isPending ? <LoaderCircle className="animate-spin" /> : <Plus />} Create
                tier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register ambassador</DialogTitle>
            <DialogDescription>
              A unique ambassador code is generated for the student.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              register.mutate(email.trim());
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="amb-email">Student email</Label>
              <Input
                id="amb-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.edu"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRegisterOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={register.isPending}>
                {register.isPending ? <LoaderCircle className="animate-spin" /> : <UserPlus />}{" "}
                Register
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
