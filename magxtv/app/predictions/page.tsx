import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Predictions" };

export default function PredictionsPage() {
  return (
    <ComingSoon
      title="Predictions"
      description="Community match predictions with accuracy tracking — entertainment only, never framed as a guarantee of outcome."
      nextSteps={[
        "Add authenticated prediction submission with server-side validation and duplicate prevention",
        "Build accuracy tracking and per-user prediction history",
        "Surface statistical insights and form comparisons per fixture",
        "Keep this clearly separate from any real-money feature"
      ]}
    />
  );
}
