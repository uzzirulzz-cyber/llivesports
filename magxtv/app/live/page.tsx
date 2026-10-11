"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type Hls from "hls.js";

type Channel = {
  id: string;
  name: string;
  category: string;
  logo?: string;
};

export default function LivePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selected, setSelected] = useState<Channel | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/channels")
      .then(async (response) => {
        if (!response.ok) throw new Error("The channel list is temporarily unavailable.");
        return response.json() as Promise<{ channels: Channel[] }>;
      })
      .then((data) => {
        if (active) setChannels(data.channels || []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load channels.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected || !videoRef.current) return;
    let hls: Hls | undefined;
    const video = videoRef.current;
    const src = `/api/stream/${encodeURIComponent(selected.id)}`;
    let cancelled = false;

    void import("hls.js").then(({ default: HlsPlayer }) => {
      if (cancelled) return;
      if (HlsPlayer.isSupported()) {
        hls = new HlsPlayer({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(HlsPlayer.Events.MANIFEST_PARSED, () => { void video.play().catch(() => {}); });
        hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
          if (data.fatal) setError("This channel could not start. Choose another channel and try again.");
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        void video.play().catch(() => {});
      } else {
        setError("This browser does not support HLS playback.");
      }
    }).catch(() => setError("The video player could not be loaded."));

    return () => {
      cancelled = true;
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [selected]);

  const visibleChannels = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? channels.filter((channel) => `${channel.name} ${channel.category}`.toLowerCase().includes(term)) : channels;
  }, [channels, search]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" /> LIVE TV
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Live channels</h1>
          <p className="mt-2 text-sm text-slate-400">Choose an available channel to start its live stream.</p>
        </div>
        <label className="w-full sm:w-80">
          <span className="sr-only">Search channels</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search channels…" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50" />
        </label>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <div className="min-w-0">
          <div className="glass-panel overflow-hidden rounded-2xl">
            <div className="aspect-video bg-black">
              {selected ? (
                <video ref={videoRef} controls playsInline autoPlay className="h-full w-full" aria-label={`Live stream: ${selected.name}`} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">▶</span>
                  <p>Select a channel to begin watching</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold">{selected?.name || "No channel selected"}</h2>
                {selected && <p className="mt-1 text-xs text-slate-400">{selected.category}</p>}
              </div>
              {selected && <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">LIVE</span>}
            </div>
          </div>
          {error && <p role="status" className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{error}</p>}
        </div>

        <aside className="glass-panel rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Channels</h2>
            <span className="text-xs text-slate-400">{loading ? "Loading…" : visibleChannels.length}</span>
          </div>
          <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {loading && <p className="px-3 py-6 text-center text-sm text-slate-400">Loading channel guide…</p>}
            {!loading && visibleChannels.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-400">{error || "No matching channels."}</p>}
            {visibleChannels.map((channel) => (
              <button key={channel.id} type="button" onClick={() => { setError(""); setSelected(channel); }} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${selected?.id === channel.id ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-xs font-bold text-cyan-200">
                  {channel.logo ? <img src={channel.logo} alt="" className="h-full w-full object-contain" loading="lazy" /> : "TV"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{channel.name}</span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{channel.category}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

