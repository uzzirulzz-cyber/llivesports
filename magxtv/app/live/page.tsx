import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Live scores" };

export default function LivePage() {
  return (
    <ComingSoon
      title="Live scores"
      description="A full live match center with real-time clocks, key events and filters by sport, competition and status."
      nextSteps={[
        "Wire a sports data provider (fetchLiveMatches in lib/demo-data.ts) with websocket or polling updates",
        "Add sport / competition / country / status filters",
        "Build match timelines (goals, cards, wickets, substitutions)",
        "Add loading, empty, and error states for the live feed"
      ]}
    />
  );
}
