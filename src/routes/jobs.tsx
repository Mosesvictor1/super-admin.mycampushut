import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Jobs Analytics" }] }),
  component: () => <StubPage title="Jobs Analytics" subtitle="Applications, conversion, hiring funnel" />,
});
