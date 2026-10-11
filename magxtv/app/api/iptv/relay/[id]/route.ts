import { decodeResource, iptvConfig, noStoreHeaders, publicStreamingEnabled, rewritePlaylist } from "@/lib/iptv-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!publicStreamingEnabled()) return new Response("Public streaming is disabled until distribution rights are confirmed.", { status: 403, headers: noStoreHeaders() });
  const { id } = await context.params;
  if (!/^\d{1,12}$/.test(id)) return new Response("Invalid channel.", { status: 400, headers: noStoreHeaders() });
  const config = iptvConfig();
  const resource = decodeResource(new URL(request.url).searchParams.get("resource"));
  if (!config || !resource) return new Response("Invalid stream resource.", { status: 400, headers: noStoreHeaders() });

  try {
    const allowedPrefix = `/live/${encodeURIComponent(config.username)}/${encodeURIComponent(config.password)}/`;
    if (resource.startsWith("/") || resource.includes("\\")) return new Response("Invalid stream resource.", { status: 400, headers: noStoreHeaders() });
    const target = new URL(resource, `${config.origin}${allowedPrefix}`);
    if (target.origin !== config.origin || !target.pathname.startsWith(allowedPrefix) || target.pathname.slice(allowedPrefix.length).split("/").some((part) => part === "." || part === "..")) return new Response("Invalid stream resource.", { status: 400, headers: noStoreHeaders() });
    const response = await fetch(target, { signal: AbortSignal.timeout(15000), redirect: "error", headers: { Accept: "application/vnd.apple.mpegurl,video/mp2t,*/*" }, cache: "no-store" });
    if (!response.ok || !response.body) return new Response("Stream segment unavailable.", { status: 502, headers: noStoreHeaders() });
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("mpegurl") || contentType.includes("text/plain") || target.pathname.toLowerCase().endsWith(".m3u8")) {
      const manifest = await response.text();
      if (!manifest.startsWith("#EXTM3U")) return new Response("The provider returned an invalid playlist.", { status: 502, headers: noStoreHeaders() });
      return new Response(rewritePlaylist(manifest, target.toString(), request.url, id, config), { headers: noStoreHeaders({ "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8" }) });
    }
    return new Response(response.body, { status: response.status, headers: noStoreHeaders({ "Content-Type": contentType || "video/mp2t" }) });
  } catch {
    return new Response("Stream segment could not be reached.", { status: 502, headers: noStoreHeaders() });
  }
}
