import type { Metadata } from "next";
import ChannelLibrary from "@/components/ChannelLibrary";

export const metadata: Metadata = { title: "Live channels" };

export default function ChannelsPage() {
  return <ChannelLibrary />;
}
