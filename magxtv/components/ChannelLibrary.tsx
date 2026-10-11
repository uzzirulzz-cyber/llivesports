"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Hls from "hls.js";

type Channel = { id: string; name: string; category: string; logo: string | null };

export default function ChannelLibrary() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [playbackEnabled, setPlaybackEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All channels");
  const [selected, setSelected] = useState<Channel | null>(null);
  const categories = useMemo(() => ["All channels", ...new Set(channels.map((channel) => channel.category))], [channels]);
  const filtered = useMemo(() => channels.filter((channel) => (category === "All channels" || channel.category === category) && channel.name.toLowerCase().includes(search.toLowerCase())), [channels, category, search]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/iptv/channels", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { channels?: Channel[]; error?: string; playbackEnabled?: boolean };
        if (!response.ok) throw new Error(result.error || "The channel provider is not ready.");
        setChannels(Array.isArray(result.channels) ? result.channels : []);
        setPlaybackEnabled(result.playbackEnabled === true);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Channels could not be loaded.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">MagxTV · Live television</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Live channels</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Browse channels available through your configured provider. Stream playback stays off until public distribution is authorized and enabled.</p>
      </div>
      {message && <div role="status" className="glass-panel rounded-xl p-5 text-sm text-slate-200"><strong className="block text-white">Channel source unavailable</strong><span className="mt-1 block">{message}</span><span className="mt-2 block text-xs text-slate-400">Configure provider secrets on the server. Provider logins are never sent to your browser.</span></div>}
      {loading && <p role="status" className="text-sm text-slate-400">Loading channels…</p>}
      {channels.length > 0 && <>
        {!playbackEnabled && <div role="status" className="glass-panel mb-5 rounded-xl border border-amber-300/20 p-4 text-sm text-amber-100">Channel listings are loaded from the supplied sports backup. Playback is off until the provider confirms public redistribution rights.</div>}
        <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
          <input aria-label="Search channels" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search channels" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent-cyan/60" />
          <select aria-label="Filter channel category" value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-white">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <p className="mb-4 text-xs text-slate-400">{filtered.length.toLocaleString()} channels · This provider plan allows one active connection.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((channel) => <button key={channel.id} type="button" disabled={!playbackEnabled} onClick={() => setSelected(channel)} className="glass-panel flex min-h-20 items-center gap-3 rounded-xl p-3 text-left transition enabled:hover:border-accent-cyan/40 disabled:cursor-not-allowed disabled:opacity-70">
            {channel.logo ? <Image src={channel.logo} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-lg bg-black/20 object-contain" /> : <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/5 text-lg text-accent-cyan">▶</span>}
            <span className="min-w-0"><strong className="block truncate text-sm text-white">{channel.name}</strong><span className="mt-1 block truncate text-xs text-slate-400">{channel.category}{playbackEnabled ? " · Select to watch" : " · Playback off"}</span></span>
          </button>)}
        </div>
        {!filtered.length && <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">No channels match these filters.</p>}
      </>}
      {selected && <ChannelPlayer channel={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ChannelPlayer({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const [error, setError] = useState("");
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>("#magxtv-channel-video");
    if (!video) return;
    const source = `/api/iptv/watch/${encodeURIComponent(channel.id)}`;
    let hls: Hls | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError("This stream is not available right now. Check provider status and try again.");
      });
    } else {
      setError("This browser cannot play HLS video.");
    }
    return () => { hls?.destroy(); video.pause(); video.removeAttribute("src"); video.load(); };
  }, [channel.id]);

  return <div className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={channel.name}>
    <section className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4"><div><h2 className="font-display text-lg font-semibold">{channel.name}</h2><p className="text-xs text-slate-400">{channel.category}</p></div><button onClick={onClose} className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10">Close</button></div>
      <video id="magxtv-channel-video" controls autoPlay playsInline className="aspect-video w-full bg-black" />
      {error && <p role="alert" className="p-4 text-sm text-rose-300">{error}</p>}
      <p className="border-t border-white/10 px-4 py-3 text-xs text-slate-400">Playback is provided by the configured streaming service.</p>
    </section>
  </div>;
}
