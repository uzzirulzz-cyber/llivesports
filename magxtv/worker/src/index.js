// MAGXTV stream proxy — keeps the provider login on the server and serves HTTPS to the site.
// Secrets (never in code): XT_USER, XT_PASS, TOKEN_SECRET.  Vars: XT_URL, ALLOWED_ORIGINS, EXTRA_HOSTS.
const enc = new TextEncoder(), dec = new TextDecoder();
const toB64u = (b) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (s) => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return dec.decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))); };
const b64d = (s) => { try { return fromB64(s); } catch { return s || ''; } };

async function sign(env, data) {
  const k = await crypto.subtle.importKey('raw', enc.encode(env.TOKEN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toB64u(new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(data))));
}
async function makeToken(env) { const exp = Math.floor(Date.now() / 1000) + 6 * 3600; return exp + '.' + (await sign(env, String(exp))); }
async function okToken(env, t) {
  if (!t) return false;
  const [exp, sig] = t.split('.');
  if (!exp || !sig || +exp < Date.now() / 1000) return false;
  const good = await sign(env, exp);
  if (good.length !== sig.length) return false;
  let d = 0; for (let i = 0; i < good.length; i++) d |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  return d === 0;
}

const origins = (env) => (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const originOk = (env, req) => origins(env).includes(req.headers.get('Origin'));
function corsHeaders(env, req, extra = {}) {
  const h = new Headers(extra), o = req.headers.get('Origin');
  if (o && origins(env).includes(o)) {
    h.set('Access-Control-Allow-Origin', o); h.set('Vary', 'Origin');
    h.set('Access-Control-Allow-Headers', 'Range');
    h.set('Access-Control-Expose-Headers', 'Content-Length,Content-Range,Accept-Ranges');
  }
  return h;
}
const json = (env, req, data, status = 200, ttl = 0) =>
  new Response(JSON.stringify(data), { status, headers: corsHeaders(env, req, { 'Content-Type': 'application/json', 'Cache-Control': ttl ? `public, max-age=${ttl}` : 'no-store' }) });

const base = (env) => env.XT_URL.replace(/\/+$/, '');
const hostAllowed = (env, u) => {
  try { const h = new URL(u).hostname; return [new URL(env.XT_URL).hostname, ...(env.EXTRA_HOSTS || '').split(',').map((s) => s.trim())].filter(Boolean).includes(h); } catch { return false; }
};
const apiUrl = (env, params) => {
  const u = new URL(base(env) + '/player_api.php');
  u.search = new URLSearchParams({ username: env.XT_USER, password: env.XT_PASS, ...params }).toString();
  return u.toString();
};
const upstream = (req, target) => {
  const h = { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' };
  const r = req.headers.get('Range'); if (r) h.Range = r;
  return fetch(target, { headers: h, redirect: 'follow' });
};

async function cachedJSON(env, req, ctx, key, ttl, build) {
  const c = globalThis.caches && caches.default, ck = new Request('https://cache.magx/' + key);
  if (c) { const hit = await c.match(ck); if (hit) return json(env, req, await hit.json(), 200, ttl); }
  const data = await build();
  if (c) ctx.waitUntil(c.put(ck, new Response(JSON.stringify(data), { headers: { 'Cache-Control': `public, max-age=${ttl}` } })));
  return json(env, req, data, 200, ttl);
}
const pull = async (env, params) => { const r = await fetch(apiUrl(env, params), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) throw new Error('upstream ' + r.status); return r.json(); };
const cats = (a) => (Array.isArray(a) ? a : []).map((c) => ({ id: String(c.category_id), n: c.category_name }));

async function api(env, req, ctx, p, url) {
  if (p === '/api/token') return json(env, req, { t: await makeToken(env) });
  if (p === '/api/live/categories') return cachedJSON(env, req, ctx, 'lc', 600, async () => cats(await pull(env, { action: 'get_live_categories' })));
  if (p === '/api/live/streams') return cachedJSON(env, req, ctx, 'ls', 600, async () => (await pull(env, { action: 'get_live_streams' })).map((s) => ({ id: s.stream_id, n: s.name, i: s.stream_icon, c: String(s.category_id), e: s.epg_channel_id })));
  if (p === '/api/vod/categories') return cachedJSON(env, req, ctx, 'vc', 900, async () => cats(await pull(env, { action: 'get_vod_categories' })));
  if (p === '/api/vod/streams') return cachedJSON(env, req, ctx, 'vs', 900, async () => (await pull(env, { action: 'get_vod_streams' })).map((s) => ({ id: s.stream_id, n: s.name, i: s.stream_icon, c: String(s.category_id), x: s.container_extension, r: s.rating })));
  const m = p.match(/^\/api\/epg\/(\d+)$/);
  if (m) return cachedJSON(env, req, ctx, 'e' + m[1], 60, async () => {
    const r = await pull(env, { action: 'get_short_epg', stream_id: m[1], limit: '4' });
    return (r.epg_listings || []).map((x) => ({ t: b64d(x.title), s: +x.start_timestamp, e: +x.stop_timestamp }));
  });
  return json(env, req, { error: 'not found' }, 404);
}

const proxied = (abs, origin, t) => `${origin}/seg?u=${toB64u(enc.encode(abs))}&t=${t}`;
function rewrite(text, baseUrl, origin, t) {
  return text.split('\n').map((line) => {
    const l = line.trim();
    if (!l) return line;
    if (l.startsWith('#')) return line.replace(/URI="([^"]+)"/g, (_, u) => `URI="${proxied(new URL(u, baseUrl).href, origin, t)}"`);
    return proxied(new URL(l, baseUrl).href, origin, t);
  }).join('\n');
}
async function relay(env, req, target, t, origin) {
  const res = await upstream(req, target);
  const h = corsHeaders(env, req), ct = res.headers.get('Content-Type') || '';
  if (/mpegurl/i.test(ct) || /\.m3u8$/i.test(new URL(res.url).pathname)) {
    h.set('Content-Type', 'application/vnd.apple.mpegurl'); h.set('Cache-Control', 'no-store');
    return new Response(rewrite(await res.text(), res.url, origin, t), { status: res.status, headers: h });
  }
  for (const k of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges']) { const v = res.headers.get(k); if (v) h.set(k, v); }
  return new Response(res.body, { status: res.status, headers: h });
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(env, req, { 'Access-Control-Allow-Methods': 'GET,OPTIONS' }) });
    if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    // Public relaying stays off until the operator confirms redistribution rights.
    if (env.PUBLIC_PLAYBACK_ENABLED !== 'true' &&
        (p === '/api/token' || /^\/(?:hls|ts|vod|seg)(?:\/|$)/.test(p))) {
      return json(env, req, { error: 'Public playback is disabled' }, 403);
    }
    try {
      if (p.startsWith('/api/')) return originOk(env, req) ? await api(env, req, ctx, p, url) : json(env, req, { error: 'forbidden' }, 403);
      if (!(await okToken(env, url.searchParams.get('t')))) return new Response('Unauthorized', { status: 401 });
      const t = url.searchParams.get('t'), b = base(env), U = encodeURIComponent(env.XT_USER), P = encodeURIComponent(env.XT_PASS);
      let m;
      if ((m = p.match(/^\/ts\/(\d+)\.ts$/))) return relay(env, req, `${b}/live/${U}/${P}/${m[1]}.ts`, t, url.origin);
      if ((m = p.match(/^\/hls\/(\d+)\.m3u8$/))) return relay(env, req, `${b}/live/${U}/${P}/${m[1]}.m3u8`, t, url.origin);
      if ((m = p.match(/^\/vod\/(\d+)\.([a-z0-9]{2,4})$/))) return relay(env, req, `${b}/movie/${U}/${P}/${m[1]}.${m[2]}`, t, url.origin);
      if (p === '/seg') {
        const target = fromB64(url.searchParams.get('u') || '');
        if (!hostAllowed(env, target)) return new Response('Blocked host', { status: 403 });
        return relay(env, req, target, t, url.origin);
      }
      return new Response('Not found', { status: 404 });
    } catch (e) {
      return json(env, req, { error: 'upstream unavailable' }, 502);
    }
  },
};
