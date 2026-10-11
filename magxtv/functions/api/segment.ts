import { assertAllowedUrl, fetchProvider, json, type ProviderEnv } from "../_lib/provider";

export const onRequestGet: PagesFunction<ProviderEnv> = async ({ request }) => {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw || raw.length > 4096) return json({ error: "Invalid media request." }, 400);
  try {
    const target = new URL(raw);
    assertAllowedUrl(target);
    if (!target.pathname.startsWith("/auth/")) return json({ error: "Invalid media path." }, 400);
    const { response } = await fetchProvider(target);
    if (!response.ok || !response.body) return json({ error: "Media segment is unavailable." }, 502);
    const contentType = response.headers.get("Content-Type") || "video/mp2t";
    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return json({ error: "Could not retrieve this media segment." }, 502);
  }
};

