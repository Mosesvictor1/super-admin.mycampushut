import { createContext, useContext } from "react";
import type { OverviewFilters } from "@/lib/dashboard-api";

export interface DashboardDateRangeContextValue {
  range: string;
  filters: OverviewFilters;
  setDateRange: (range: string, filters: OverviewFilters) => void;
}

export const DashboardDateRangeContext = createContext<DashboardDateRangeContextValue | null>(null);

export function useDashboardDateRange() {
  const context = useContext(DashboardDateRangeContext);
  if (!context) {
    throw new Error("useDashboardDateRange must be used within DashboardDateRangeProvider");
  }
  return context;
}
