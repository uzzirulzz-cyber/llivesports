import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Leagues" };

export default function LeaguesPage() {
  return (
    <ComingSoon
      title="Leagues"
      description="Competition hubs with standings, fixtures, results and participating teams."
      nextSteps={[
        "Build a dynamic /leagues/[slug] route with standings table and season selector",
        "List participating teams and link to /teams/[slug] pages",
        "Connect fixtures and results per league"
      ]}
    />
  );
}
