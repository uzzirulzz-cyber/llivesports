import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return (
    <ComingSoon
      title="News"
      description="Sports news and editorial content, manageable from the admin dashboard."
      nextSteps={[
        "Build the news list with category filters and pagination",
        "Add a dynamic /news/[slug] article route",
        "Connect to the admin content-management module for publish/archive"
      ]}
    />
  );
}
