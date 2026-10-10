import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <ComingSoon
      title="Favorites"
      description="Saved teams, leagues and matches for signed-in users."
      nextSteps={[
        "Requires authentication to be built first",
        "Add favorite/follow buttons across team, league and match pages",
        "Build this page to list a signed-in user's saved items"
      ]}
    />
  );
}
