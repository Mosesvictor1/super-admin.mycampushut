import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function DashboardQueryState({
  isLoading,
  error,
  onRetry,
  children,
}: {
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading dashboard data…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-destructive/30 bg-card p-8 text-center"
      >
        <p className="font-medium">Dashboard data could not be loaded.</p>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  return children;
}
