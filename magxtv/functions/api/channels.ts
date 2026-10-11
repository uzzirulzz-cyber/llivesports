import { fetchProvider, json, providerBase, type ProviderEnv } from "../_lib/provider";

interface ProviderChannel {
  stream_id?: number | string;
  name?: string;
  category_name?: string;
  category_id?: string;
  stream_icon?: string;
}

export const onRequestGet: PagesFunction<ProviderEnv> = async ({ env }) => {
  try {
    if (!env.IPTV_USERNAME || !env.IPTV_PASSWORD) return json({ error: "Channel service is not configured." }, 503);
    const url = new URL("/player_api.php", providerBase(env));
    url.searchParams.set("username", env.IPTV_USERNAME);
    url.searchParams.set("password", env.IPTV_PASSWORD);
    url.searchParams.set("action", "get_live_streams");
    const { response } = await fetchProvider(url);
    if (!response.ok) return json({ error: "Channel provider is unavailable." }, 502);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return json({ error: "Channel provider returned an invalid catalog." }, 502);
    const channels = (data as ProviderChannel[])
      .filter((item) => item && item.stream_id != null && item.name)
      .map((item) => ({
        id: String(item.stream_id),
        name: String(item.name).slice(0, 160),
        category: String(item.category_name || item.category_id || "Live TV").slice(0, 100),
        ...(typeof item.stream_icon === "string" && item.stream_icon.startsWith("https://") ? { logo: item.stream_icon } : {})
      }));
    return json({ channels });
  } catch {
    return json({ error: "Could not load the channel catalog." }, 502);
  }
};

