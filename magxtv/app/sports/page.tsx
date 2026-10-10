import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import PopularSports from "@/components/PopularSports";

export const metadata: Metadata = { title: "Sports" };

export default function SportsPage() {
  return (
    <>
      <PopularSports />
      <ComingSoon
        title="Sport detail pages"
        description="Each sport should open into its own hub with competitions, fixtures and standings."
        nextSteps={[
          "Build a dynamic /sports/[slug] route per sport",
          "List competitions available for that sport",
          "Surface sport-specific stats (wickets, sets, rounds, etc.)"
        ]}
      />
    </>
  );
}
