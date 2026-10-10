import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Matches" };

export default function MatchesPage() {
  return (
    <ComingSoon
      title="Matches"
      description="Browse fixtures, live matches and results with search, date navigation and pagination."
      nextSteps={[
        "Build the match list with sport/competition/date filters",
        "Add a dynamic /matches/[id] detail route with lineups, stats and head-to-head",
        "Connect standings and recent-form data per team"
      ]}
    />
  );
}
