export interface ProviderEnv {
  IPTV_HOST: string;
  IPTV_USERNAME: string;
  IPTV_PASSWORD: string;
}

const ALLOWED_HOSTS = new Set(["stream.playbeat.live", "87.120.127.18", "81.31.194.197"]);

export function providerBase(env: ProviderEnv): URL {
  const base = new URL(env.IPTV_HOST);
  if (base.protocol !== "http:" || base.hostname !== "stream.playbeat.live") {
    throw new Error("Provider host is not configured as expected.");
  }
  return base;
}

export function assertAllowedUrl(url: URL): void {
  if (url.protocol !== "http:" || !ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error("Provider redirect destination is not allowed.");
  }
}

export async function fetchProvider(url: URL): Promise<{ response: Response; finalUrl: URL }> {
  let current = url;
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    assertAllowedUrl(current);
    const response = await fetch(current, { redirect: "manual", headers: { "User-Agent": "MAGXTV/1.0" } });
    if (![301, 302, 303, 307, 308].includes(response.status)) return { response, finalUrl: current };
    const location = response.headers.get("Location");
    if (!location) return { response, finalUrl: current };
    current = new URL(location, current);
  }
  throw new Error("Provider returned too many redirects.");
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

