import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Finance & Subscription" }] }),
  component: () => <StubPage title="Finance & Subscription" subtitle="MRR, revenue, churn, transactions" />,
});
