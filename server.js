const express = require('express');
const path = require('path');
const { chromium } = require('playwright');

const app = express();
const PORT = Number(process.env.PORT || 80);
const ROOT = __dirname;

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function cacheGet(key) {
    const hit = cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.ts > CACHE_TTL_MS) return null;
    return hit.data;
}

function cacheSet(key, data) {
    cache.set(key, { ts: Date.now(), data });
}

function isAllowedApptopiaUrl(raw) {
    try {
        const u = new URL(raw);
        if (!/^https?:$/.test(u.protocol)) return false;
        if (!/(^|\.)apptopia\.com$/i.test(u.hostname)) return false;
        return /^\/store-insights\/top-charts\//i.test(u.pathname);
    } catch (error) {
        return false;
    }
}

function isMessagingApp(item) {
    const text = `${item?.name || ''} ${item?.developer || ''}`.toLowerCase().trim();
    if (!text) return false;

    const excluded = [
        /\bbrowser\b/,
        /\bvpn\b/,
        /\bdating\b/,
        /\bdate\b/,
        /\bmeet\b/,
        /\bmeeting\b/,
        /\bvideo\s*call\b/,
        /\bconference\b/
    ];
    if (excluded.some((re) => re.test(text))) return false;

    const included = [
        /\bchat\b/,
        /\bchats\b/,
        /\bmessage\b/,
        /\bmessages\b/,
        /\bmessaging\b/,
        /\bmessenger\b/,
        /\bsms\b/,
        /\bmms\b/,
        /\btexting\b/,
        /\bwhatsapp\b/,
        /\btelegram\b/,
        /\bsignal\b/,
        /\bwechat\b/,
        /\bline\b/,
        /\bviber\b/,
        /\bkakaotalk\b/,
        /\bdiscord\b/,
        /\bsnapchat\b/,
        /\bimo\b/,
        /\bzalo\b/,
        /\bthreema\b/,
        /\bsession\b/,
        /\belement\b/,
        /\bwire\b/,
        /\bkik\b/,
        /\bskype\b/,
        /\bmattermost\b/,
        /\brocket\.?chat\b/
    ];
    return included.some((re) => re.test(text));
}

async function scrapeApptopiaFreeChart(url) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        locale: 'en-US',
        viewport: { width: 1400, height: 900 }
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(1500);
        await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

        const items = await page.evaluate(() => {
            const textNorm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
            const findByText = (keyword) => {
                const kw = keyword.toLowerCase();
                const all = Array.from(document.querySelectorAll('h1,h2,h3,h4,div,section,th,span'));
                return all.find((el) => textNorm(el.innerText).toLowerCase().includes(kw)) || null;
            };

            const freeAnchor = findByText('free');
            const scope = freeAnchor ? (freeAnchor.closest('section,div,table') || document.body) : document.body;

            const rows = Array.from(scope.querySelectorAll('tr'));
            const parsed = [];

            for (const tr of rows) {
                const cells = Array.from(tr.querySelectorAll('td,th')).map((c) => textNorm(c.innerText));
                if (cells.length < 2) continue;

                const rankCellIdx = cells.findIndex((c) => /^\d{1,3}$/.test(c));
                if (rankCellIdx === -1) continue;
                const rank = parseInt(cells[rankCellIdx], 10);
                if (!Number.isFinite(rank)) continue;

                const name = cells
                    .slice(rankCellIdx + 1)
                    .find((c) => c && !/^(free|paid|grossing|top free)$/i.test(c) && !/^[-—]+$/.test(c));
                if (!name) continue;

                const a = tr.querySelector('a[href]');
                const href = a ? (a.getAttribute('href') || '') : '';
                const icon = tr.querySelector('img')?.getAttribute('src') || '';

                let developer = '';
                for (const c of cells) {
                    if (c && c !== name && c.length > 2 && c.length < 80 && !/^\d+$/.test(c)) {
                        developer = c;
                        break;
                    }
                }

                parsed.push({
                    rank,
                    name,
                    developer: developer === name ? '' : developer,
                    url: href && href.startsWith('http') ? href : href ? new URL(href, location.origin).toString() : '',
                    icon
                });
            }

            const dedup = new Set();
            return parsed
                .filter((x) => Number.isFinite(x.rank) && x.name)
                .sort((a, b) => a.rank - b.rank)
                .filter((x) => {
                    const k = `${x.rank}|${x.name}`;
                    if (dedup.has(k)) return false;
                    dedup.add(k);
                    return true;
                });
        });

        return items;
    } finally {
        await page.close().catch(() => {});
        await context.close().catch(() => {});
        await browser.close().catch(() => {});
    }
}

app.use(express.static(ROOT));

app.get('/api/free', async (req, res) => {
    const type = String(req.query.type || 'ios').toLowerCase();
    const url = String(req.query.url || '');
    const filter = String(req.query.filter || (type === 'gp' ? 'messaging' : 'messaging')).toLowerCase();

    if (!url || !isAllowedApptopiaUrl(url)) {
        return res.status(400).json({ ok: false, error: 'Invalid or disallowed Apptopia URL' });
    }

    const key = `${type}|${filter}|${url}`;
    const cached = cacheGet(key);
    if (cached) return res.json({ ok: true, cached: true, url, items: cached });

    try {
        let items = await scrapeApptopiaFreeChart(url);
        if (filter === 'messaging') {
            items = items.filter(isMessagingApp);
        }
        cacheSet(key, items);
        return res.json({ ok: true, cached: false, url, items });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: String(error && error.message ? error.message : error)
        });
    }
});

app.listen(PORT, () => {
    console.log(`digitalrecon listening on http://localhost:${PORT}`);
});
