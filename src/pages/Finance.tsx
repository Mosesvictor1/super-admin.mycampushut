import { useState } from "react";
import { CheckCircle2, Timer, UserPlus, Users, XCircle, RotateCcw, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardQueryState } from "@/components/dashboard/DashboardQueryState";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePaymentOverview } from "@/lib/dashboard-api";
import { useDashboardDateRange } from "@/components/dashboard/dashboard-date-range-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Transaction = NonNullable<
  ReturnType<typeof usePaymentOverview>["data"]
>["recentTransactions"] extends (infer Item)[] | undefined
  ? Item
  : never;

const colors = [
  "oklch(0.62 0.17 148)",
  "oklch(0.55 0.15 240)",
  "oklch(0.65 0.18 300)",
  "oklch(0.72 0.18 50)",
];

const number = (value?: number) => value?.toLocaleString() ?? "—";
const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "successful":
    case "completed":
      return "bg-primary-soft text-primary ring-primary/20";
    case "failed":
    case "failure":
      return "bg-[oklch(0.96_0.06_27)] text-destructive ring-destructive/20";
    case "refunded":
      return "bg-[oklch(0.96_0.04_50)] text-accent ring-accent/20";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  if (["success", "successful", "completed"].includes(normalized)) {
    return <CheckCircle2 className="h-3 w-3" />;
  }
  if (["failed", "failure"].includes(normalized)) {
    return <XCircle className="h-3 w-3" />;
  }
  if (normalized === "refunded") return <RotateCcw className="h-3 w-3" />;
  return null;
};

export default function FinancePage() {
  useDocumentTitle("CampusHut Admin — Finance & Subscription");
  const { filters } = useDashboardDateRange();
  const { data, isLoading, error, refetch } = usePaymentOverview(filters);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const summary = data?.summary;
  const transactions = data?.recentTransactions ?? [];
  const revenueRows = (data?.revenueTrend ?? []).reduce<
    Record<string, Record<string, string | number>>
  >((rows, item) => {
    const row = rows[item.month] ?? { month: item.month };
    row[item.currency] = item.revenue;
    rows[item.month] = row;
    return rows;
  }, {});
  const revenueCurrencies = Array.from(
    new Set((data?.revenueTrend ?? []).map((item) => item.currency)),
  );

  return (
    <DashboardLayout
      title="Finance & Subscription"
      subtitle="Revenue trends, payment types, methods, and recent transactions"
    >
      <DashboardQueryState isLoading={isLoading} error={error} onRetry={() => void refetch()}>
        {data && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniStat
                icon={UserPlus}
                tone="primary"
                label="New Students (30D)"
                value={number(summary?.newStudents30Days)}
              />
              <MiniStat
                icon={Users}
                tone="blue"
                label="30-Day Retention"
                value={summary?.retention30DayPercent ?? "—"}
                suffix={summary ? "%" : undefined}
              />
              <MiniStat
                icon={Timer}
                tone="violet"
                label="Avg. Session Duration"
                value={summary?.averageSessionDurationMinutes ?? "—"}
                suffix={summary ? "min" : undefined}
              />
              <MiniStat
                icon={Zap}
                tone="accent"
                label="Activation Rate"
                value={summary?.activationRatePercent ?? "—"}
                suffix={summary ? "%" : undefined}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <ChartCard
                className="xl:col-span-2"
                title="Revenue Trend"
                description="Monthly revenue by currency"
              >
                <div className="h-[300px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={Object.values(revenueRows)}
                      margin={{ top: 10, right: 16, left: -8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="oklch(0.92 0.008 240)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <Tooltip />
                      {revenueCurrencies.map((currency, index) => (
                        <Line
                          key={currency}
                          type="monotone"
                          dataKey={currency}
                          name={currency}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2.5}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Revenue by Type" description="Revenue contribution">
                <div className="space-y-2">
                  {(data.revenueByType ?? []).map((item, index) => (
                    <div
                      key={`${item.paymentType}-${item.currency}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{item.paymentType}</div>
                        <div className="mt-0.5 text-muted-foreground">
                          {number(item.transactions)} transactions
                        </div>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums">
                        {item.currency} {number(item.revenue)}
                      </span>
                    </div>
                  ))}
                  {!data.revenueByType?.length && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No revenue by type reported.
                    </p>
                  )}
                </div>
              </ChartCard>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
              <ChartCard
                title="Transactions by Payment Method"
                description="Transaction count; revenue is listed by currency"
              >
                <div className="h-[260px] -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.paymentMethods ?? []}
                      margin={{ top: 10, right: 16, left: -8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="oklch(0.92 0.008 240)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="paymentMethod"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "oklch(0.52 0.02 250)", fontSize: 11 }}
                      />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar
                        dataKey="transactions"
                        name="Transactions"
                        fill={colors[1]}
                        radius={[7, 7, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5">
                  {(data.paymentMethods ?? []).map((item, index) => (
                    <div
                      key={`${item.paymentMethod}-${item.currency}-${index}`}
                      className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs"
                    >
                      <span className="truncate">{item.paymentMethod}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {item.currency} {number(item.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card xl:col-span-2">
                <div className="border-b border-border px-5 py-4">
                  <h3 className="text-[15px] font-semibold tracking-tight">Recent Transactions</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Latest {transactions.length} payment events
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3 text-left font-medium">Reference</th>
                        <th className="px-4 py-3 text-left font-medium">Amount</th>
                        <th className="px-4 py-3 text-left font-medium">Method</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((item) => (
                        <tr
                          key={item.transactionId}
                          onClick={() => setTransaction(item)}
                          className="cursor-pointer border-t border-border hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-mono text-xs">{item.reference}</td>
                          <td className="px-4 py-3 font-semibold tabular-nums">
                            {item.currency} {number(item.amount)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.paymentMethod}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                                statusClass(item.status),
                              )}
                            >
                              <StatusIcon status={item.status} />
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {item.createdAt}
                          </td>
                        </tr>
                      ))}
                      {!transactions.length && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-sm text-muted-foreground"
                          >
                            No transactions reported.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <Dialog open={!!transaction} onOpenChange={(open) => !open && setTransaction(null)}>
              <DialogContent>
                {transaction && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="font-mono">{transaction.reference}</DialogTitle>
                      <DialogDescription>Transaction details</DialogDescription>
                    </DialogHeader>
                    <dl className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
                      <Field label="Transaction ID" value={String(transaction.transactionId)} />
                      <Field
                        label="Amount"
                        value={`${transaction.currency} ${number(transaction.amount)}`}
                      />
                      <Field label="Payment type" value={transaction.paymentType} />
                      <Field label="Method" value={transaction.paymentMethod} />
                      <Field label="Status" value={transaction.status} />
                      <Field label="Date" value={transaction.createdAt} />
                    </dl>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </DashboardQueryState>
    </DashboardLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
