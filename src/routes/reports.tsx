import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Reports" }] }),
  component: () => <StubPage title="Reports" subtitle="Exports, scheduled reports, audit logs" />,
});
