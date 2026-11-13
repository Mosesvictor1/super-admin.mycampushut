import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.mycampushut.com/dashboard";

export interface OverviewFilters {
  startDate?: string;
  endDate?: string;
}

export interface Summary {
  newStudents30Days?: number;
  retention30DayPercent?: number;
  averageSessionDurationMinutes?: number;
  activationRatePercent?: number;
}

export interface UserInsightsOverview {
  summary?: Summary;
  retentionTrend?: { period: string; retentionPercent: number }[];
  topRegions?: { region: string; studentCount: number }[];
  students?: {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    university: string;
    plan: string;
    lastActive: string;
    status: string;
  }[];
  totalStudents?: number;
  page?: number;
  size?: number;
  hasNext?: boolean;
}

export interface PlatformOverview {
  summary?: {
    totalStudents?: number;
    dailyActiveUsers?: number;
    monthlyActiveUsers?: number;
    activeSubscriptions?: number;
  };
  growthTrend?: {
    month: string;
    totalStudents: number;
    dailyActiveUsers: number;
  }[];
  subscriptionDistribution?: {
    plan: string;
    count: number;
    percentage: number;
  }[];
  topUniversities?: { university: string; studentCount: number }[];
  recentActivity?: {
    eventType: string;
    description: string;
    occurredAt: string;
  }[];
  criticalAlerts?: {
    alertType: string;
    title: string;
    description: string;
    count: number;
    severity: string;
  }[];
}

export interface PaymentOverview {
  summary?: {
    successfulTransactions?: number;
    failedTransactions?: number;
    failureRatePercent?: number;
    totalRevenue?: { currency: string; revenue: number }[];
  };
  revenueTrend?: { month: string; currency: string; revenue: number }[];
  revenueByType?: {
    paymentType: string;
    currency: string;
    revenue: number;
    transactions: number;
  }[];
  paymentMethods?: {
    paymentMethod: string;
    currency: string;
    revenue: number;
    transactions: number;
  }[];
  recentTransactions?: {
    transactionId: number | null;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paymentType: string;
    paymentMethod: string;
    createdAt: string;
  }[];
}

export interface AICourseOverview {
  summary?: {
    enrollments?: number;
    completionRatePercent?: number;
    aiTutorSessions?: number;
    csatScore?: number | null;
  };
  enrollmentTrend?: {
    month: string;
    enrollments: number;
    completions: number;
  }[];
  assistantUsage?: {
    category: string;
    sessions: number;
    percentage: number;
  }[];
  topCourses?: {
    courseId: number;
    title: string;
    students: number;
    completedStudents: number;
    completionRatePercent: number;
  }[];
}

async function getDashboardData<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const url = new URL(`${baseUrl}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function usePlatformOverview(filters: OverviewFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "platform", filters],
    queryFn: () =>
      getDashboardData<PlatformOverview>("api/dashboard/platform/overview", { ...filters }),
  });
}

export function useUserInsights(
  search: string,
  page: number,
  size: number,
  filters: OverviewFilters = {},
) {
  return useQuery({
    queryKey: ["dashboard", "users", search, page, size, filters],
    queryFn: () => fetchUserInsightsPage(search, page, size, filters),
  });
}

function fetchUserInsightsPage(
  search: string,
  page: number,
  size: number,
  filters: OverviewFilters,
) {
  return getDashboardData<UserInsightsOverview>("api/dashboard/user-insights/overview", {
    page,
    size,
    search,
    ...filters,
  });
}

export async function fetchAllUserInsights(
  search: string,
  filters: OverviewFilters = {},
  size = 20,
) {
  const students: NonNullable<UserInsightsOverview["students"]> = [];
  let firstPage: UserInsightsOverview | undefined;
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const result = await fetchUserInsightsPage(search, page, size, filters);
    firstPage ??= result;
    const pageStudents = result.students ?? [];
    if (students.length + pageStudents.length > 1_048_575) {
      throw new Error("The matching student count exceeds Excel's worksheet row limit.");
    }
    students.push(...pageStudents);

    const pageSize = result.size && result.size > 0 ? result.size : size;
    hasNext =
      result.hasNext ??
      (result.totalStudents !== undefined && (page + 1) * pageSize < result.totalStudents);
    if (hasNext && !pageStudents.length) {
      throw new Error("The API indicated more students are available but returned an empty page.");
    }

    page += 1;
  }

  if (!firstPage) {
    throw new Error("The API did not return user insights.");
  }

  return { ...firstPage, students, page: 0, size: students.length, hasNext: false };
}

export function usePaymentOverview(filters: OverviewFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "payments", filters],
    queryFn: () =>
      getDashboardData<PaymentOverview>("api/dashboard/payments/overview", { ...filters }),
  });
}

export function useAICourseOverview(filters: OverviewFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "ai-courses", filters],
    queryFn: () =>
      getDashboardData<AICourseOverview>("api/dashboard/ai-courses/overview", { ...filters }),
  });
}
