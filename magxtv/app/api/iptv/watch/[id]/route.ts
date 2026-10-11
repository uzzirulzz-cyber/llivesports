import { iptvConfig, noStoreHeaders, publicStreamingEnabled, rewritePlaylist, upstreamChannelUrl } from "@/lib/iptv-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!publicStreamingEnabled()) return new Response("Public streaming is disabled until distribution rights are confirmed.", { status: 403, headers: noStoreHeaders() });
  const { id } = await context.params;
  if (!/^\d{1,12}$/.test(id)) return new Response("Invalid channel.", { status: 400, headers: noStoreHeaders() });
  const config = iptvConfig();
  if (!config) return new Response("The channel provider is not configured.", { status: 503, headers: noStoreHeaders() });

  try {
    const upstreamUrl = upstreamChannelUrl(config, id);
    const response = await fetch(upstreamUrl, { signal: AbortSignal.timeout(15000), redirect: "error", headers: { Accept: "application/vnd.apple.mpegurl,video/mp2t,*/*" }, cache: "no-store" });
    if (!response.ok || !response.body) return new Response("The stream is unavailable.", { status: response.status === 404 ? 404 : 502, headers: noStoreHeaders() });
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("mpegurl") || contentType.includes("text/plain") || upstreamUrl.toLowerCase().includes(".m3u8")) {
      const manifest = await response.text();
      if (!manifest.startsWith("#EXTM3U")) return new Response("The provider returned an invalid playlist.", { status: 502, headers: noStoreHeaders() });
      const rewritten = rewritePlaylist(manifest, upstreamUrl, request.url, id, config);
      return new Response(rewritten, { headers: noStoreHeaders({ "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8" }) });
    }
    return new Response(response.body, { status: response.status, headers: noStoreHeaders({ "Content-Type": contentType || "video/mp2t" }) });
  } catch {
    return new Response("The stream could not be reached.", { status: 502, headers: noStoreHeaders() });
  }
}
