# Digital Recon
A little weekend project using mapping and the Cloudflare API

Cloudflare has some really cool data available and I thought it would be a fun weekend project to put together an interactive map to build a dashboard to see what's going on in the world.

Radar (https://radar.cloudflare.com) is an awesome resource that has a bunch of data worth looking at; including country-specific data. The new Data Explorer made it really easy to find and embed graphs using their data (https://radar.cloudflare.com/explorer)

**Fair warning, this was a weekend project and the code is stitched together badly. Some of the country code translations might be wrong, you'll have to fix that yourself**

Shoutout to https://github.com/johan/world.geo.json for the country outlines used

# What does it do?
I create this to make it display the top OS types, top browsers (user-agents), and top domains for each country

# What you need
- A Mapbox account for the mapping (https://account.mapbox.com)
- A Cloudflare dash account for the data (https://dash.cloudflare.com)

# How to do it
I've put my code in the files here so you can just download them, enter the API keys for both Mapbox and Cloudflare and away you go. There are a few tricky bits I had to work through so hopefully this helps you spend less time than I did on it.

## Step 1
Register a free account on Mapbox and grab the public API key (https://account.mapbox.com/access-tokens/). This should look something like a JWT `pk.eyJ1Ij<SNIP>8ifQ.yDJ8G<SNIP>tQw`

## Step 2
Register a Cloudflare account and create an API token (https://dash.cloudflare.com/user_string_here/api-tokens). The only permission you need is `Radar: Read`

## Step 3
This was the annoying part that took me a while. For some reason (and I was too lazy to figure out the reason), the Cloudflare API doesn't like it if you're accessing the API from an unregistered domain. If you do, it'll throw an error like this:
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at ...

Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 400.
```

Seeing as I was doing the dev from my localhost, using a python http.server, and I also didn't intend to host it on the public internet, it was a pain in the ass to figure out how I could get it to respond with the `Access-Control-Allow-Origin` header. Finally I worked out that I could essentially proxy it through a Cloudflare Worker and after some mucking around, I got it to work.

### Cloudflare Worker
Log into your Cloudflare Dash > Workers & Pages > Overview > Create

This was my code which essentially relays any requests to the actual API:
```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Construct the API URL from the request URL
  const apiUrl = `https://api.cloudflare.com${url.pathname}${url.search}`

  // Forward the request to Cloudflare API
  const apiResponse = await fetch(apiUrl, {
    method: request.method,
    headers: {
      ...request.headers,
      'Authorization': 'Bearer CLOUDFLARE_API_KEY', // Replace with your Cloudflare API key
      'Content-Type': 'application/json',
    },
  })

  // If the API response is OK, return it with proper CORS headers
  const responseHeaders = new Headers(apiResponse.headers)

  // Add CORS headers to the response
  responseHeaders.set('Access-Control-Allow-Origin', '*')  // Allow all origins
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')  // Allowed HTTP methods
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')  // Allowed headers

  // If the request is OPTIONS (preflight request), return 204 (No Content)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    })
  }

  // Otherwise, return the Cloudflare API response with CORS headers
  return new Response(apiResponse.body, {
    status: apiResponse.status,
    statusText: apiResponse.statusText,
    headers: responseHeaders,
  })
}
```

After deploying the Worker, I got my URL which looked something like `https://wispy-block-xxxa.xxxxx.workers.dev/`. This is the URL you are going to use in the code.

## Step 4
In `script.js`, enter:
- Your Mapbox key into `mapboxgl.accessToken = 'MAPBOX_API_KEY';` (line 1)
- Your Cloudflare key into `'Authorization': Bearer CLOUDFLARE_API_KEY` (line 123)
- Replace your Cloudflare Worker URL in `const url = https://wispy-block-xxxa.xxxxx.workers.dev/client/v4/radar/ranking/top?limit=100&location=${countryCode};` (line 117)

Run a http server - however you want but I used python (`python3 -m http.server 80`)
- Make sure that if you're running it this way, your CLI is in the same folder as the files
Access the app at `localhost` or `127.0.0.1`
