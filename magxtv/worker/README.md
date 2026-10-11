# MagxTV stream proxy

This Worker is a separate MagxTV resource. It does not change the PlayBeat site.

## Free setup

The Worker uses Wrangler and Cloudflare Workers Builds, with no paid package or plan required. Keep the Worker name as magxtv-proxy and the build root at /magxtv/worker.

Private secrets, when needed, belong in the Cloudflare Worker secret store:

- XT_USER
- XT_PASS
- TOKEN_SECRET

Do not put these values in the website, repository, build variables, or public logs. The supplied upstream uses HTTP, so provider credentials cross that upstream connection without transport encryption.

The website API URL is blank by default and playback is disabled by default. The Worker can list provider metadata when configured, but /api/token, /hls, /vod, and /seg return 403 until PUBLIC_PLAYBACK_ENABLED is set to the string true. Enable public playback only when the provider expressly permits public redistribution of the selected channels.

ALLOWED_ORIGINS is restricted to https://magxtv.click. Do not add playbeat.live.

## Local development

Run npm ci, npm test, and npx wrangler dev from this directory.

For a Worker preview, run npx wrangler preview.
