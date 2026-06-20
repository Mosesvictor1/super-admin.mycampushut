import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/ai-courses")({
  head: () => ({ meta: [{ title: "CampusHut Admin — AI Courses" }] }),
  component: () => <StubPage title="AI Courses" subtitle="Enrollments, completion, engagement" />,
});
