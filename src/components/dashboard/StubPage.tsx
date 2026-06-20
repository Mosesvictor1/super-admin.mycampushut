import { DashboardLayout } from "./DashboardLayout";
import { Construction } from "lucide-react";

export function StubPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-16 text-center shadow-card">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Construction className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
          This module is scoped in the BRD and ships in upcoming sprints. The Platform
          Overview is the MVD landing page — start there to explore the full design system.
        </p>
      </div>
    </DashboardLayout>
  );
}
