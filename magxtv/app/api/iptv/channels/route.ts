import catalog from "@/lib/sports-channel-catalog.json";
import { noStoreHeaders, publicStreamingEnabled } from "@/lib/iptv-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    { channels: catalog, count: catalog.length, playbackEnabled: publicStreamingEnabled() },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600", "X-Content-Type-Options": "nosniff" } }
  );
}
