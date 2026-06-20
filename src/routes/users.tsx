import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Users Analytics" }] }),
  component: () => <StubPage title="Users Analytics" subtitle="Student growth, retention, cohorts" />,
});
