import { contentApiRequest, readArrayPayload } from "@/lib/campushut-content-api";

/** Same-origin prefix; the Vite dev proxy and Vercel rewrite map it to the upstream /referral service. */
const REFERRAL_BASE_URL = (import.meta.env.VITE_REFERRAL_BASE_URL ?? "/referral-proxy").replace(
  /\/+$/,
  "",
);

export interface AmbassadorTierRequest {
  tierName: string;
  minimumRegistrations: number;
  minimumPaidSubscriptions: number;
  rewardAmount: number;
  active: boolean;
}

export interface AmbassadorMonthlyPerformance {
  ambassadorId?: number;
  studentEmail?: string;
  ambassadorCode?: string;
  month?: number;
  year?: number;
  totalRegistered?: number;
  totalPaidSubscriptions?: number;
  conversionRate?: number;
  achievedTier?: string | null;
  rewardAmount?: number;
  rewardStatus?: string | null;
}

const request = <T>(path: string, options: Parameters<typeof contentApiRequest>[1] = {}) =>
  contentApiRequest<T>(path, { ...options, baseUrl: REFERRAL_BASE_URL });

const json = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const referralApi = {
  tiers: () => request<unknown>("/api/ambassador/tiers"),
  createTier: (tier: AmbassadorTierRequest) =>
    request<unknown>("/api/ambassador/tier/create", json(tier)),
  register: (studentEmail: string) =>
    request<unknown>("/api/ambassador/register", json({ studentEmail })),
  recordRegistration: (ambassadorCode: string, referredStudentEmail: string) =>
    request<unknown>("/api/ambassador/record-registration", {
      method: "POST",
      query: { ambassadorCode, referredStudentEmail },
    }),
  referralCode: (studentEmail: string) =>
    request<unknown>(`/api/ambassador/referral-code/${encodeURIComponent(studentEmail)}`),
  checkCode: (ambassadorCode: string) =>
    request<unknown>(`/api/ambassador/check-code/${encodeURIComponent(ambassadorCode)}`),
  performance: (ambassadorId: number, month: number, year: number) =>
    request<unknown>(`/api/ambassador/performance/${ambassadorId}`, { query: { month, year } }),
  dashboard: (studentEmail: string, month: number, year: number) =>
    request<unknown>("/api/ambassador/dashboard", { query: { studentEmail, month, year } }),
  monthlyReport: (month: number, year: number) =>
    request<unknown>("/api/ambassador/admin/monthly-report", { query: { month, year } }),
};

export const readAmbassadorReport = (value: unknown) =>
  readArrayPayload<AmbassadorMonthlyPerformance>(value, ["report", "ambassadors"]);

export const readTiers = (value: unknown) =>
  readArrayPayload<Partial<AmbassadorTierRequest> & { id?: number }>(value, ["tiers"]);
