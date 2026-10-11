/** Server-only IPTV configuration. Values must stay in deployment secrets. */
export type IptvConfig = {
  origin: string;
  username: string;
  password: string;
};

export function publicStreamingEnabled() {
  return process.env.IPTV_PUBLIC_REDISTRIBUTION === "true";
}

export function iptvConfig(): IptvConfig | null {
  const host = process.env.IPTV_HOST?.trim();
  const username = process.env.IPTV_USERNAME?.trim();
  const password = process.env.IPTV_PASSWORD;
  if (!host || !username || !password) return null;

  try {
    const parsed = new URL(host);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) return null;
    return { origin: parsed.origin, username, password };
  } catch {
    return null;
  }
}

export function noStoreHeaders(extra: HeadersInit = {}) {
  return { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", ...extra };
}

export function upstreamChannelUrl(config: IptvConfig, id: string) {
  return `${config.origin}/live/${encodeURIComponent(config.username)}/${encodeURIComponent(config.password)}/${id}.m3u8`;
}

export function proxyPath(requestUrl: string, channelId: string, resource: string) {
  const proxy = new URL(`/api/iptv/relay/${channelId}`, requestUrl);
  proxy.searchParams.set("resource", btoa(unescape(encodeURIComponent(resource))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""));
  return proxy.toString();
}

export function rewritePlaylist(text: string, playlistUrl: string, requestUrl: string, channelId: string, config: IptvConfig) {
  const base = new URL(playlistUrl);
  const credentialsPath = `/live/${encodeURIComponent(config.username)}/${encodeURIComponent(config.password)}/`;
  const rewrite = (value: string) => {
    try {
      const resource = new URL(value, base);
      if (resource.origin !== base.origin || !resource.pathname.startsWith(credentialsPath)) return "";
      const relativePath = resource.pathname.slice(credentialsPath.length);
      if (!relativePath || relativePath.split("/").some((part) => part === "." || part === "..")) return "";
      return proxyPath(requestUrl, channelId, `${relativePath}${resource.search}`);
    } catch {
      return "";
    }
  };
  return text.split(/\r?\n/).map((line) => {
    const value = line.trim();
    if (!value) return line;
    if (value.startsWith("#")) return line.replace(/URI="([^"]+)"/g, (_match, uri: string) => `URI="${rewrite(uri)}"`);
    return rewrite(value);
  }).join("\n");
}

export function decodeResource(value: string | null) {
  if (!value || value.length > 4096 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}
