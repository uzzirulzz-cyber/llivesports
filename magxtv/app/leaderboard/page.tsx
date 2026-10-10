import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import NewsAndLeaderboard from "@/components/NewsAndLeaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return (
    <>
      <NewsAndLeaderboard />
      <ComingSoon
        title="Full leaderboard"
        description="A dedicated, paginated leaderboard with filters by timeframe and sport."
        nextSteps={[
          "Paginate the leaderboard once real prediction data exists",
          "Add weekly / monthly / all-time filters",
          "Link each entry to a public profile view"
        ]}
      />
    </>
  );
}
