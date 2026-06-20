import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Assignments" }] }),
  component: () => <StubPage title="Assignments" subtitle="Submission rate, on-time, reminders" />,
});
