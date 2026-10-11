import { fetchProvider, json, providerBase, type ProviderEnv } from "../../_lib/provider";

export const onRequestGet: PagesFunction<ProviderEnv> = async ({ env, params }) => {
  const id = String(params.id || "");
  if (!/^\d{1,12}$/.test(id)) return json({ error: "Invalid channel." }, 400);
  if (!env.IPTV_USERNAME || !env.IPTV_PASSWORD) return json({ error: "Stream service is not configured." }, 503);

  try {
    const url = new URL(`/live/${encodeURIComponent(env.IPTV_USERNAME)}/${encodeURIComponent(env.IPTV_PASSWORD)}/${id}.m3u8`, providerBase(env));
    const { response, finalUrl } = await fetchProvider(url);
    if (!response.ok) return json({ error: "This channel is currently unavailable." }, 502);
    const body = await response.text();
    if (!body.startsWith("#EXTM3U")) return json({ error: "Provider did not return an HLS playlist." }, 502);
    const rewritten = body.split(/\r?\n/).map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return line.replace(/URI="([^"]+)"/g, (_match, target: string) => {
          const absolute = new URL(target, finalUrl);
          return `URI="${proxyUrl(absolute)}"`;
        });
      }
      const absolute = new URL(trimmed, finalUrl);
      return proxyUrl(absolute);
    }).join("\n");
    return new Response(rewritten, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return json({ error: "Could not start this channel." }, 502);
  }
};

function proxyUrl(target: URL): string {
  if (target.protocol !== "http:" || !["87.120.127.18", "81.31.194.197", "stream.playbeat.live"].includes(target.hostname) || !target.pathname.startsWith("/auth/")) {
    throw new Error("Invalid media URL from provider.");
  }
  return `/api/segment?url=${encodeURIComponent(target.toString())}`;
}

