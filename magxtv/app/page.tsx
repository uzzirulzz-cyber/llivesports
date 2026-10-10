import Hero from "@/components/Hero";
import LiveMatchesSection from "@/components/LiveMatchesSection";
import PopularSports from "@/components/PopularSports";
import UpcomingFixtures from "@/components/UpcomingFixtures";
import NewsAndLeaderboard from "@/components/NewsAndLeaderboard";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveMatchesSection />
      <PopularSports />
      <UpcomingFixtures />
      <NewsAndLeaderboard />
    </>
  );
}
