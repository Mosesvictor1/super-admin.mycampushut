import { useState, type ReactNode } from "react";
import type { OverviewFilters } from "@/lib/dashboard-api";
import { DashboardDateRangeContext } from "./dashboard-date-range-context";

export function DashboardDateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState("Last 30 days");
  const [filters, setFilters] = useState<OverviewFilters>({});
  const setDateRange = (nextRange: string, nextFilters: OverviewFilters) => {
    setRange(nextRange);
    setFilters(nextFilters);
  };

  return (
    <DashboardDateRangeContext.Provider value={{ range, filters, setDateRange }}>
      {children}
    </DashboardDateRangeContext.Provider>
  );
}
