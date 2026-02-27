![favicon](https://github.com/user-attachments/assets/ddfb422b-f0d4-4aa3-8939-9ee3e638003a)

# Digital Recon
A little weekend project using mapping and Cloudflare/APIs.

Cloudflare has some really cool data available and I thought it would be a fun project to throw together an interactive map/dashboard to see what is going on by country.

Radar (https://radar.cloudflare.com) is an awesome resource and the Data Explorer makes embedding charts pretty easy (https://radar.cloudflare.com/explorer).

**Fair warning:** this started as a weekend hack, so parts of the code are still rough around the edges.

Shoutout to https://github.com/johan/world.geo.json for the country outlines used.

# What it does
For each clicked country, it shows:
- Cloudflare Radar embeds (mobile vs desktop, OS, browsers)
- Top domains
- Technical Planning Data panels:
  - Most common messaging apps (Google Play + iOS, Apptopia primary)
  - Most common email apps
  - Most common phones and laptops
  - Most common browsers
  - Most common OS
  - Most common first hop ASN

# What you need
- A Mapbox account (https://account.mapbox.com)
- A Cloudflare account (https://dash.cloudflare.com)

# How to set it up

## Step 1
Create a Mapbox token and put it in `script.js`:
- `mapboxgl.accessToken = 'YOUR_MAPBOX_PUBLIC_TOKEN'`

## Step 2
Create a Cloudflare API token:
- Permission needed: `Radar: Read`

## Step 3 (important)
Use a Cloudflare Worker as a proxy for CORS + API forwarding.

The Worker now does **two** jobs:
- Proxies Cloudflare Radar API (`/client/v4/radar/...`)
- Proxies allowed external URLs (`/proxy?url=...`) for chart scraping

### Security change (new)
Your Cloudflare API token is **no longer in frontend code**.
Do **not** hardcode it in `script.js` or Worker source.
Store it as a Worker secret named `CF_API_TOKEN`.

From Dashboard
```
Cloudflare Dashboard -> Workers & Pages -> <your worker> -> Settings -> Variables and Secrets -> Add -> Secret
Name: CF_API_TOKEN
Value: your token string (Xxx1-...)
```

Or set the secret via `wrangler`:
```bash
wrangler secret put CF_API_TOKEN
```

### Worker code
```js
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const url = new URL(request.url);

    // Generic proxy route for external pages (Apptopia, r.jina, etc.)
    if (url.pathname === "/proxy") {
      const target = url.searchParams.get("url");
      if (!target) {
        return json({ error: "Missing ?url=" }, 400);
      }

      let targetUrl;
      try {
        targetUrl = new URL(target);
      } catch {
        return json({ error: "Invalid url" }, 400);
      }

      // Optional allowlist for safety
      const allowedHosts = new Set([
        "apptopia.com",
        "www.apptopia.com",
        "r.jina.ai",
        "www.appbrain.com",
        "appbrain.com"
      ]);
      if (!allowedHosts.has(targetUrl.hostname)) {
        return json({ error: "Host not allowed" }, 403);
      }

      const upstream = await fetch(targetUrl.toString(), {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "*/*" }
      });

      const headers = new Headers(upstream.headers);
      applyCors(headers);
      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers
      });
    }

    // Existing Cloudflare API passthrough (radar endpoints)
    const apiUrl = `https://api.cloudflare.com${url.pathname}${url.search}`;
    const upstream = await fetch(apiUrl, {
      method: request.method,
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body
    });

    const headers = new Headers(upstream.headers);
    applyCors(headers);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers
    });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
function applyCors(headers) {
  Object.entries(corsHeaders()).forEach(([k, v]) => headers.set(k, v));
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}
```

Deploy the Worker and copy its URL (for example: `https://your-worker-name.workers.dev`).

## Step 4
In `script.js`, set your Worker base in:
- `const API_BASE = 'https://your-worker-name.workers.dev/client/v4/radar';`

That’s it for Cloudflare auth on the frontend. No bearer token in JS anymore.

## Step 5
Run this project with the built-in Node server (serves frontend + Playwright `/api/free` extraction endpoint):
```bash
npm install
npx playwright install chromium
npm start
```

Open:
`http://localhost`
