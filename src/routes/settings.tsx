import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Settings" }] }),
  component: () => <StubPage title="Settings" subtitle="Roles, permissions, integrations" />,
});
