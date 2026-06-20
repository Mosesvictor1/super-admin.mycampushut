import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/dashboard/StubPage";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "CampusHut Admin — Learning Library" }] }),
  component: () => <StubPage title="Learning Library" subtitle="Views, ratings, time spent" />,
});
