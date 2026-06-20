import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/platform")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Platform Overview" }] }),
  component: () => <StubPage title="Platform Overview" subtitle="Cross-module KPIs and health" />,
});
