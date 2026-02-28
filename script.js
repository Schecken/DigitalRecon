mapboxgl.accessToken = 'xxxxxxxxxxxxxxxxxxxxxxx'; // Change to your own mapbox API key
if (typeof mapboxgl.setTelemetryEnabled === 'function') {
    mapboxgl.setTelemetryEnabled(false);
}

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    projection: 'globe',
    center: [133.7751, -25.2744], // Centered on Australia
    zoom: 3,
    performanceMetricsCollection: false
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// GeoJSON source (local file)
const geojsonUrl = 'countries.geo.json';

// Country code conversion function
var countryNameToAlpha2Mapping  = {"Afghanistan": "AF", "Åland Islands": "AX", "Albania": "AL", "Algeria": "DZ", "American Samoa": "AS", "Andorra": "AD", "Angola": "AO", "Anguilla": "AI", "Antarctica": "AQ", "Antigua and Barbuda": "AG", "Argentina": "AR", "Armenia": "AM", "Aruba": "AW", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bermuda": "BM", "Bhutan": "BT", "Bolivia": "BO", "Bonaire, Sint Eustatius and Saba": "BQ", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Bouvet Island": "BV", "Brazil": "BR", "British Virgin Islands": "VG", "British Indian Ocean Territory": "IO", "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cape Verde": "CV", "Cayman Islands": "KY", "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN", "Hong Kong": "HK", "Macau": "MO", "Christmas Island": "CX", "Cocos (Keeling) Islands": "CC", "Colombia": "CO", "Comoros": "KM", "Congo": "CG", "Democratic Republic of the Congo": "CD", "Cook Islands": "CK", "Costa Rica": "CR", "Ivory Coast": "CI", "Croatia": "HR", "Cuba": "CU", "Curaçao": "CW", "Cyprus": "CY", "Czech Republic": "CZ", "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE", "Ethiopia": "ET", "Falkland Islands": "FK", "Faroe Islands": "FO", "Fiji": "FJ", "Finland": "FI", "France": "FR", "French Guiana": "GF", "French Polynesia": "PF", "French Southern and Antarctic Lands": "TF", "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Gibraltar": "GI", "Greece": "GR", "Greenland": "GL", "Grenada": "GD", "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT", "Guernsey": "GG", "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Heard Island and McDonald Islands": "HM", "Holy See": "VA", "Honduras": "HN", "Hungary": "HU", "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE", "Isle of Man": "IM", "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jersey": "JE", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "North Korea": "KP", "South Korea": "KR", "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "North Macedonia": "MK", "Madagascar": "MG", "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Marshall Islands": "MH", "Martinique": "MQ", "Mauritania": "MR", "Mauritius": "MU", "Mayotte": "YT", "Mexico": "MX", "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Montserrat": "MS", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR", "Nepal": "NP", "Netherlands": "NL", "Netherlands Antilles": "AN", "New Caledonia": "NC", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "Niue": "NU", "Norfolk Island": "NF", "Northern Mariana Islands": "MP", "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palau": "PW", "Palestinian Territories": "PS", "Panama": "PA", "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Pitcairn Islands": "PN", "Poland": "PL", "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "Réunion": "RE", "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saint Barthélemy": "BL", "Saint Helena": "SH", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC", "Saint Martin": "MF", "Saint Pierre and Miquelon": "PM", "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM", "São Tomé and Príncipe": "ST", "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", "Sint Maarten": "SX", "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA", "South Georgia and the South Sandwich Islands": "GS", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Suriname": "SR", "Svalbard and Jan Mayen": "SJ", "Swaziland": "SZ", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW", "Tajikistan": "TJ", "United Republic of Tanzania": "TZ", "Thailand": "TH", "Timor-Leste": "TL", "Togo": "TG", "Tokelau": "TK", "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM", "Turks and Caicos Islands": "TC", "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Vatican City": "VA", "Venezuela": "VE", "Vietnam": "VN", "Wallis and Futuna": "WF", "Western Sahara": "EH", "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW"};

let currentDateRange = '12w'; // Default date range

const API_BASE = 'https://your-worker-name.workers.dev/client/v4/radar'; // Change this to your own
const WORKER_BASE = API_BASE.replace('/client/v4/radar', '');

const insightConfigs = [
    { key: 'messaging_apps', label: 'Most common messaging apps' },
    { key: 'email_apps', label: 'Most common email apps' },
    { key: 'phones', label: 'Most common phones' },
    { key: 'laptops', label: 'Most common laptops' },
    { key: 'browsers', label: 'Most common browsers' },
    { key: 'os', label: 'Most common OS' },
    { key: 'first_hop', label: 'Most common first hop' }
];

const sourceIconMap = {
    cloudflare: { name: 'Cloudflare Radar', icon: 'https://www.google.com/s2/favicons?domain=radar.cloudflare.com&sz=64', url: 'https://radar.cloudflare.com/' },
    statcounter: { name: 'Statcounter', icon: 'https://www.google.com/s2/favicons?domain=statcounter.com&sz=64', url: 'https://gs.statcounter.com/' },
    ripe: { name: 'RIPEstat', icon: 'https://www.google.com/s2/favicons?domain=stat.ripe.net&sz=64', url: 'https://stat.ripe.net/' },
    bgpview: { name: 'BGPView', icon: 'https://www.google.com/s2/favicons?domain=bgpview.io&sz=64', url: 'https://bgpview.io/' },
    apptopia: { name: 'Apptopia', icon: 'https://www.google.com/s2/favicons?domain=apptopia.com&sz=64', url: 'https://apptopia.com/' },
    appbrain: { name: 'AppBrain', icon: 'https://www.google.com/s2/favicons?domain=appbrain.com&sz=64', url: 'https://www.appbrain.com/' }
};

const storeIconMap = {
    ios: { name: 'iOS', icon: 'https://www.google.com/s2/favicons?domain=apps.apple.com&sz=64' },
    android: { name: 'Google Play', icon: 'https://www.google.com/s2/favicons?domain=play.google.com&sz=64' }
};

let selectedCountryCode = null;
let selectedCountryName = null;
const topDomainsCache = new Map();
const asnDetailsCache = new Map();
const apptopiaChartsCache = new Map();
const USE_WORKER_PROXY_FOR_APPTOPIA = true;
let workerProxyUnavailable = !USE_WORKER_PROXY_FOR_APPTOPIA;
let currentMapView = 'globe';

showRuntimeWarningIfNeeded();

map.on('load', () => {
    updateMapViewToggleLabel();

    // Add GeoJSON source
    map.addSource('countries', {
        type: 'geojson',
        data: geojsonUrl
    });

    // Add country layer
    map.addLayer({
        id: 'country-layer',
        type: 'fill',
        source: 'countries',
        paint: {
            'fill-color': '#627BC1',
            'fill-opacity': 0.5
        }
    });

    // Add country borders
    map.addLayer({
        id: 'country-borders',
        type: 'line',
        source: 'countries',
        paint: {
            'line-color': '#000',
            'line-width': 1
        }
    });

    // Click event for countries
    map.on('click', 'country-layer', (e) => {
        const countryName = e.features[0].properties.name;
        const countryCode = countryNameToAlpha2Mapping[countryName];

        const countryNameElement = document.getElementById('country-name');
        const countryInfoElement = document.getElementById('country-info');
        
        countryNameElement.textContent = countryName;
        countryInfoElement.textContent = `Results for ${countryName} (${countryCode})`;
        selectedCountryCode = countryCode;
        selectedCountryName = countryName;

        updateRadarEmbeds(countryCode);
        fetchAndRenderTechStats(countryCode, countryName);
        fetchTopDomains(countryCode, countryName);

        if (!document.getElementById('sidebar').classList.contains('active')) {
            openSidebar();
        }
    });

    map.on('mouseenter', 'country-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'country-layer', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['country-layer'] });
        if (!features.length) {
            closeSidebar();
        }
    });
});

// Sidebar and overlay logic
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.transform = 'translateX(0)';
    sidebar.classList.add('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.transform = 'translateX(100%)';
    sidebar.classList.remove('active');
}

function showRuntimeWarningIfNeeded() {
    if (window.location.protocol !== 'file:') {
        return;
    }

    const warningElement = document.getElementById('runtime-warning');
    warningElement.hidden = false;
    warningElement.textContent = 'You are running this page with file:// which blocks GeoJSON fetch. Start a local server (for example: python3 -m http.server 8000) and open http://localhost:8000/.';
}

document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const clickedMapControls = !!e.target.closest('#map-controls');
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !document.getElementById('map').contains(e.target) && !clickedMapControls) {
        closeSidebar();
    }
});

document.getElementById('map-view-toggle').addEventListener('click', () => {
    currentMapView = currentMapView === 'globe' ? 'flat' : 'globe';
    const projection = currentMapView === 'globe' ? 'globe' : 'mercator';
    map.setProjection(projection);
    updateMapViewToggleLabel();
});

function updateMapViewToggleLabel() {
    const toggleButton = document.getElementById('map-view-toggle');
    if (!toggleButton) {
        return;
    }
    toggleButton.textContent = currentMapView === 'globe' ? 'Switch to Flat Map' : 'Switch to Globe';
}

function updateRadarEmbeds(countryCode) {
    const location = countryCode.toLowerCase();
    const mobileDesktopIframe = document.getElementById('mobile-desktop-iframe');
    const osIframe = document.getElementById('os-iframe');
    const browserIframe = document.getElementById('browser-iframe');

    mobileDesktopIframe.src = `https://radar.cloudflare.com/embed/MobileDesktopXY?dateRange=${currentDateRange}&location=${location}&ref=%2Ftraffic%2F${location}`;
    osIframe.src = `https://radar.cloudflare.com/embed/DataExplorerVisualizer?dataset=http&path=http%2Ftimeseries_groups%2Fos&dateRange=${currentDateRange}&mainLocation=${location}&timeCompare=true&locale=en-US&ref=%2Fexplorer%3FdataSet%3Dhttp%26timeCompare%3D1%26loc%3D${location}%26dt%3D${currentDateRange}%26groupBy%3Dos`;
    browserIframe.src = `https://radar.cloudflare.com/embed/DataExplorerVisualizer?dataset=http&path=http%2Ftimeseries_groups%2Fbrowser&dateRange=${currentDateRange}&mainLocation=${location}&timeCompare=true&param_limitPerGroup=20&locale=en-US&ref=%2Fexplorer%3FdataSet%3Dhttp%26timeCompare%3D1%26loc%3D${location}%26dt%3D${currentDateRange}%26groupBy%3Dbrowser`;
}

function fetchAndRenderTechStats(countryCode, countryName) {
    const tasks = [
        () => fetchMessagingApps(countryCode),
        () => fetchEmailApps(countryCode),
        () => fetchMostCommonPhones(countryName),
        () => fetchMostCommonLaptops(countryName),
        () => fetchMostCommonBrowsers(countryName),
        () => fetchMostCommonOS(countryName),
        () => fetchMostCommonFirstHop(countryCode)
    ];
    renderTechStatsLoading(insightConfigs);
    setTechStatsProgress(0, tasks.length);

    let completed = 0;
    const wrapped = tasks.map((task) => task().finally(() => {
        completed += 1;
        setTechStatsProgress(completed, tasks.length);
    }));

    Promise.allSettled(wrapped).then((results) => {
        renderTechStats(results, insightConfigs);
        setTechStatsProgress(tasks.length, tasks.length, 'Technical Planning Data updated.');
    }).catch((error) => {
        console.error('Error loading technical stats:', error);
        setTechStatsProgress(completed, tasks.length, 'Some stats failed to load.');
    });
}

async function fetchMostCommonBrowsers(countryName) {
    return fetchStatcounterMetric({
        countryName,
        sourceLabel: 'Statcounter browser market share',
        countryPaths: (slug) => [
            `browser-market-share/all/${slug}`,
            `browser-market-share/desktop-mobile/${slug}`
        ],
        globalPath: 'browser-market-share/all/worldwide'
    });
}

async function fetchMostCommonOS(countryName) {
    return fetchStatcounterMetric({
        countryName,
        sourceLabel: 'Statcounter OS market share',
        countryPaths: (slug) => [
            `os-market-share/all/${slug}`,
            `os-market-share/desktop-mobile/${slug}`
        ],
        globalPath: 'os-market-share/all/worldwide'
    });
}

async function fetchMostCommonPhones(countryName) {
    return fetchStatcounterMetric({
        countryName,
        sourceLabel: 'Statcounter mobile vendor market share',
        countryPaths: (slug) => [
            `vendor-market-share/mobile/${slug}`,
            `mobile-vendor-market-share/mobile/${slug}`
        ],
        globalPath: 'vendor-market-share/mobile/worldwide'
    });
}

async function fetchMostCommonLaptops(countryName) {
    const desktopOs = await fetchStatcounterMetric({
        countryName,
        sourceLabel: 'Statcounter desktop OS share (laptop proxy)',
        countryPaths: (slug) => [
            `os-market-share/desktop/${slug}`
        ],
        globalPath: 'os-market-share/desktop/worldwide'
    });
    return {
        ...desktopOs,
        methodology: `${desktopOs.methodology} This is a laptop proxy derived from desktop OS/browser traffic, not model-level hardware telemetry.`,
        confidence: desktopOs.confidence === 'high' ? 'medium' : desktopOs.confidence,
        items: desktopOs.items.map((item) => ({
            rank: item.rank,
            label: `${item.label}${desktopOsHint(item.label)}`,
            value: item.value
        }))
    };
}

function desktopOsHint(osLabel) {
    const value = osLabel.toLowerCase();
    if (value.includes('os x') || value.includes('mac')) return ' - likely MacBook-heavy segment';
    if (value.includes('chrome os')) return ' - likely Chromebook-heavy segment';
    if (value.includes('windows')) return ' - likely Lenovo/HP/Dell/ASUS/Acer segment';
    if (value.includes('linux')) return ' - likely Linux laptop segment';
    return '';
}

async function fetchStatcounterMetric({ countryName, sourceLabel, countryPaths, globalPath }) {
    const slug = toStatcounterSlug(countryName);
    const attempted = [];
    const candidates = [
        ...countryPaths(slug).map((path) => ({ path, scope: 'country' })),
        { path: globalPath, scope: 'global' }
    ];

    for (const candidate of candidates) {
        const rawUrl = `https://gs.statcounter.com/${candidate.path}`;
        const proxyUrl = `https://r.jina.ai/http://gs.statcounter.com/${candidate.path}`;
        attempted.push(rawUrl);

        try {
            const response = await fetch(proxyUrl, { method: 'GET' });
            if (!response.ok) {
                continue;
            }

            const pageText = await response.text();
            const items = parseStatcounterRows(pageText, 10);
            if (items.length === 0) {
                continue;
            }

            return {
                source: sourceLabel,
                providers: ['statcounter'],
                providerLinks: { statcounter: rawUrl },
                endpoint: rawUrl,
                methodology: 'Estimated from Statcounter web traffic share samples.',
                confidence: candidate.scope === 'country' ? 'high' : 'low',
                note: candidate.scope === 'global'
                    ? `Country-specific data unavailable for ${countryName}; using worldwide fallback.`
                    : `Country-specific sample for ${countryName}.`,
                items
            };
        } catch (error) {
            // Try the next candidate URL.
        }
    }

    throw new Error(`${sourceLabel} returned no usable rows. Tried: ${attempted.join(', ')}`);
}

function parseStatcounterRows(text, limit) {
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
    const byLabel = new Map();

    const pushRow = (label, valueRaw) => {
        const cleanLabel = String(label || '').replace(/\*/g, '').trim();
        if (!cleanLabel) return;
        const lower = cleanLabel.toLowerCase();
        if (lower === 'unknown' || lower.includes('market share') || lower === 'total') return;

        const numeric = Number(String(valueRaw).replace(',', '.'));
        if (!Number.isFinite(numeric)) return;
        const value = `${numeric.toFixed(2)}%`;

        if (!byLabel.has(cleanLabel) || numeric > byLabel.get(cleanLabel).numeric) {
            byLabel.set(cleanLabel, { label: cleanLabel, value, numeric });
        }
    };

    for (const line of lines) {
        const tableMatch = line.match(/^\|\s*([^|]+)\s*\|\s*([\d.,]+)\s*%?\s*\|/);
        if (tableMatch) {
            pushRow(tableMatch[1], tableMatch[2]);
            continue;
        }

        const lineMatch = line.match(/^([A-Za-z0-9 ._+\-/'()]+?)\s*(?:\||:|-)\s*([\d.,]+)\s*%$/);
        if (lineMatch) {
            pushRow(lineMatch[1], lineMatch[2]);
            continue;
        }

        const plainMatch = line.match(/^([A-Za-z0-9 ._+\-/'()]+?)\s+([\d.,]+)\s*%$/);
        if (plainMatch) {
            pushRow(plainMatch[1], plainMatch[2]);
        }
    }

    const jsonPattern = /"name"\s*:\s*"([^"]+)"\s*,\s*"y"\s*:\s*([\d.]+)/g;
    let jsonMatch = jsonPattern.exec(text);
    while (jsonMatch) {
        pushRow(jsonMatch[1], jsonMatch[2]);
        jsonMatch = jsonPattern.exec(text);
    }

    return [...byLabel.values()]
        .sort((a, b) => b.numeric - a.numeric)
        .slice(0, limit)
        .map((row, index) => ({
            rank: index + 1,
            label: row.label,
            value: row.value
        }));
}

function toStatcounterSlug(countryName) {
    const specialMap = {
        'United States': 'united-states-of-america',
        'United Kingdom': 'united-kingdom',
        'United Republic of Tanzania': 'tanzania',
        'Ivory Coast': 'cote-divoire',
        'Réunion': 'reunion',
        'Czech Republic': 'czech-republic',
        'South Korea': 'south-korea',
        'North Korea': 'north-korea'
    };

    if (specialMap[countryName]) {
        return specialMap[countryName];
    }

    return countryName
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function fetchMostCommonFirstHop(countryCode) {
    const endpointUrl = `https://stat.ripe.net/data/country-asns/data.json?resource=${countryCode}&lod=1`;
    const response = await fetch(endpointUrl, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`RIPEstat country-asns failed (${response.status})`);
    }

    const payload = await response.json();
    const asns = collectAsnCandidates(payload && payload.data ? payload.data : {});
    if (asns.length === 0) {
        throw new Error('RIPEstat returned no ASN candidates');
    }

    const enriched = await Promise.all(asns.slice(0, 10).map((asn) => enrichAsnDetails(asn)));

    return {
        source: 'RIPEstat country-asns',
        providers: buildAsnProviderList(enriched),
        providerLinks: buildAsnProviderLinks(enriched),
        endpoint: endpointUrl,
        methodology: 'Country ASN set from RIPEstat, enriched with ASN holder + country hints.',
        confidence: 'medium',
        items: enriched.map((entry, index) => ({
            rank: index + 1,
            label: `AS${entry.asn}${entry.location ? `, ${entry.location}` : ''}`,
            value: null
        }))
    };
}

function buildAsnProviderList(entries) {
    const providerSet = new Set(['ripe']);
    entries.forEach((entry) => {
        if (entry.source === 'bgpview') {
            providerSet.add('bgpview');
        }
    });
    return [...providerSet];
}

function buildAsnProviderLinks(entries) {
    const links = {
        ripe: 'https://stat.ripe.net/'
    };
    const bgpEntry = entries.find((entry) => entry.source === 'bgpview');
    if (bgpEntry) {
        links.bgpview = `https://bgpview.io/asn/${bgpEntry.asn}`;
    }
    const ripeEntry = entries.find((entry) => entry.source === 'ripe');
    if (ripeEntry) {
        links.ripe = `https://stat.ripe.net/AS${ripeEntry.asn}`;
    }
    return links;
}

async function enrichAsnDetails(asn) {
    if (asnDetailsCache.has(asn)) {
        return asnDetailsCache.get(asn);
    }

    const task = (async () => {
        const ripe = await fetchAsnFromRipe(asn).catch(() => null);
        if (ripe) return ripe;

        const bgpView = await fetchAsnFromBgpView(asn).catch(() => null);
        if (bgpView) return bgpView;

        return { asn: String(asn), org: null, location: null, source: 'unknown' };
    })();

    asnDetailsCache.set(asn, task);
    return task;
}

async function fetchAsnFromRipe(asn) {
    const endpoint = `https://stat.ripe.net/data/as-overview/data.json?resource=AS${asn}`;
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`RIPE as-overview failed (${response.status})`);
    }

    const payload = await response.json();
    const data = payload && payload.data ? payload.data : {};
    const org = data.holder || data.description || null;
    const countryCode = findCountryCodeInObject(data) || await fetchAsnCountryFromRipeWhois(asn);
    const location = countryCode ? countryLabel(countryCode) : null;

    return { asn: String(asn), org, location, source: 'ripe' };
}

async function fetchAsnCountryFromRipeWhois(asn) {
    try {
        const endpoint = `https://stat.ripe.net/data/whois/data.json?resource=AS${asn}`;
        const response = await fetch(endpoint, { method: 'GET' });
        if (!response.ok) return null;
        const payload = await response.json();
        const records = payload && payload.data && Array.isArray(payload.data.records) ? payload.data.records : [];
        for (const record of records) {
            if (!Array.isArray(record)) continue;
            for (const field of record) {
                const key = String(field && field.key ? field.key : '').toLowerCase();
                const value = String(field && field.value ? field.value : '').toUpperCase().trim();
                if (key === 'country' && /^[A-Z]{2}$/.test(value)) return value;
            }
        }
    } catch (error) {
        // ignore whois fallback errors
    }
    return null;
}

async function fetchAsnFromBgpView(asn) {
    const endpoint = `https://api.bgpview.io/asn/${asn}`;
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) {
        throw new Error(`BGPView ASN failed (${response.status})`);
    }

    const payload = await response.json();
    const data = payload && payload.data ? payload.data : {};
    const org = data.description_short || data.name || null;
    const code = data.country_code || null;
    const location = code ? countryLabel(code) : null;

    return { asn: String(asn), org, location, source: 'bgpview' };
}

function findCountryCodeInObject(input) {
    if (!input || typeof input !== 'object') {
        return null;
    }

    const queue = [input];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current || typeof current !== 'object') continue;

        for (const [key, value] of Object.entries(current)) {
            if (typeof value === 'string') {
                const normalizedKey = key.toLowerCase();
                if (normalizedKey.includes('country') && /^[A-Z]{2}$/.test(value)) {
                    return value;
                }
            } else if (value && typeof value === 'object') {
                queue.push(value);
            }
        }
    }

    return null;
}

function countryLabel(code) {
    try {
        const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
        const name = displayNames.of(code.toUpperCase());
        return name || code.toUpperCase();
    } catch (error) {
        return code.toUpperCase();
    }
}

function collectAsnCandidates(data) {
    const asnSet = new Set();
    const queue = [data];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        if (Array.isArray(current)) {
            for (const value of current) queue.push(value);
            continue;
        }

        if (typeof current === 'number' && current > 0) {
            asnSet.add(String(current));
            continue;
        }

        if (typeof current === 'string') {
            const match = current.match(/^AS?(\d+)$/i);
            if (match) asnSet.add(match[1]);
            continue;
        }

        if (typeof current === 'object') {
            for (const [key, value] of Object.entries(current)) {
                if (key.toLowerCase() === 'asn' && (typeof value === 'number' || typeof value === 'string')) {
                    const asnMatch = String(value).match(/^AS?(\d+)$/i);
                    if (asnMatch) asnSet.add(asnMatch[1]);
                } else {
                    queue.push(value);
                }
            }
        }
    }

    return [...asnSet];
}

async function fetchMessagingApps(countryCode) {
    const countryName = selectedCountryName || countryCode;
    try {
        return await fetchMessagingAppsFromApptopia(countryName);
    } catch (error) {
        try {
            return await fetchMessagingAppsFromAppBrain(countryName, error);
        } catch (fallbackError) {
            return {
                source: 'Heuristic fallback',
                providers: ['apptopia', 'appbrain'],
                providerLinks: {},
                confidence: 'low',
                items: [{ rank: 1, label: 'Per-store top charts' }],
                osLists: {
                    android: ['WhatsApp Messenger', 'Telegram', 'Messenger', 'Signal', 'LINE', 'Discord', 'Snapchat', 'WeChat', 'Viber', 'Skype']
                        .map((label, i) => ({ rank: i + 1, label, iconUrl: resolveAppIconByName(label, 'android') })),
                    ios: []
                },
                osLinks: { android: null, ios: null }
            };
        }
    }
}

async function fetchEmailApps(countryCode) {
    const countryName = selectedCountryName || countryCode;
    try {
        return await fetchEmailAppsFromApptopia(countryName);
    } catch (error) {
        try {
            return await fetchEmailAppsFromAppBrain(countryName, error);
        } catch (fallbackError) {
            return {
                source: 'Heuristic fallback',
                providers: ['apptopia', 'appbrain'],
                providerLinks: {},
                confidence: 'low',
                items: [{ rank: 1, label: 'Per-store top charts' }],
                osLists: {
                    android: ['Gmail', 'Microsoft Outlook', 'Yahoo Mail', 'Proton Mail', 'Spark Mail', 'AOL', 'BlueMail', 'K-9 Mail', 'myMail', 'Thunderbird']
                        .map((label, i) => ({ rank: i + 1, label, iconUrl: resolveAppIconByName(label, 'android') })),
                    ios: []
                },
                osLinks: { android: null, ios: null }
            };
        }
    }
}

async function fetchMessagingAppsFromApptopia(countryName) {
    const rendered = await fetchMessagingAppsFromApptopiaRenderer(countryName).catch(() => null);
    if (rendered && (rendered.osLists.android.length > 0 || rendered.osLists.ios.length > 0)) {
        return rendered;
    }

    const chartData = await getApptopiaTopChartApps(countryName, 'messaging');
    const links = buildApptopiaOsLinks(countryName, 'messaging');
    const perStore = {
        android: chartData.apps
            .filter((item) => item.store === 'android')
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 10)
            .map((item) => ({ rank: item.rank, label: item.name, iconUrl: item.iconUrl || '' })),
        ios: chartData.apps
            .filter((item) => item.store === 'ios')
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 10)
            .map((item) => ({ rank: item.rank, label: item.name, iconUrl: item.iconUrl || '' }))
    };
    if (perStore.ios.length === 0 && perStore.android.length === 0) {
        throw new Error('No Free-column rows parsed from Apptopia messaging charts');
    }

    return {
        source: 'Apptopia top charts',
        providers: ['apptopia'],
        providerLinks: { apptopia: links.android || chartData.referenceUrl },
        confidence: chartData.confidence,
        items: [{ rank: 1, label: 'Per-store top charts' }],
        osLists: perStore,
        osLinks: {
            ...(chartData.osLinks || {}),
            android: (chartData.osLinks && chartData.osLinks.android) || links.android || null,
            ios: (chartData.osLinks && chartData.osLinks.ios) || links.ios || null
        }
    };
}

async function fetchMessagingAppsFromApptopiaRenderer(countryName) {
    const countrySlug = toApptopiaCountrySlug(countryName);
    const date = getApptopiaDate();
    const urls = {
        android: `https://apptopia.com/store-insights/top-charts/google-play/communication/${countrySlug}?date=${date}`,
        ios: `https://apptopia.com/store-insights/top-charts/itunes-connect/social-networking/${countrySlug}?date=${date}`
    };
    const [iosPayload, androidPayload] = await Promise.all([
        fetch(`/api/free?type=ios&url=${encodeURIComponent(urls.ios)}`).then((r) => r.json()),
        fetch(`/api/free?type=gp&url=${encodeURIComponent(urls.android)}`).then((r) => r.json())
    ]);
    if (!iosPayload || !iosPayload.ok || !androidPayload || !androidPayload.ok) {
        throw new Error('Apptopia renderer endpoint did not return ok=true');
    }

    const normalize = (items, store) => (Array.isArray(items) ? items : [])
        .map((it, idx) => ({
            rank: Number.isFinite(Number(it.rank)) ? Number(it.rank) : (idx + 1),
            label: cleanAppName(it.name || ''),
            iconUrl: String(it.icon || '').trim(),
            store
        }))
        .filter((it) => it.label && isMessagingRelevantApp({ name: it.label, appId: it.label, categoryIds: [12] }))
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 10);

    return {
        source: 'Apptopia top charts',
        providers: ['apptopia'],
        providerLinks: { apptopia: urls.android },
        confidence: 'high',
        items: [{ rank: 1, label: 'Per-store top charts' }],
        osLists: {
            android: normalize(androidPayload.items, 'android'),
            ios: normalize(iosPayload.items, 'ios')
        },
        osLinks: {
            android: urls.android,
            ios: urls.ios
        }
    };
}

async function fetchEmailAppsFromApptopia(countryName) {
    const apptopiaLinks = buildApptopiaOsLinks(countryName, 'email');
    const emailKeywords = [
        'gmail', 'outlook', 'yahoo mail', 'proton mail', 'aol', 'mail',
        'spark', 'bluemail', 'k-9 mail', 'thunderbird', 'mymail'
    ];
    const chartData = await getApptopiaTopChartApps(countryName, 'email');
    const filtered = chartData.apps.filter((app) => {
        const n = app.name.toLowerCase();
        return emailKeywords.some((k) => n.includes(k));
    });
    const perStore = buildPerStoreTopLists(filtered, 10);
    if (perStore.ios.length === 0 && perStore.android.length === 0) {
        throw new Error('No email apps matched Apptopia chart titles');
    }

    return {
        source: 'Apptopia top charts',
        providers: ['apptopia'],
        providerLinks: { apptopia: chartData.referenceUrl },
        confidence: chartData.confidence,
        items: [{ rank: 1, label: 'Per-store top charts' }],
        osLists: perStore,
        osLinks: {
            ...(chartData.osLinks || {}),
            android: (chartData.osLinks && chartData.osLinks.android) || apptopiaLinks.android || null,
            ios: (chartData.osLinks && chartData.osLinks.ios) || apptopiaLinks.ios || null
        }
    };
}

async function fetchMessagingAppsFromAppBrain(countryName, apptopiaError) {
    const countryCode = (countryNameToAlpha2Mapping[countryName] || countryName || '').toUpperCase();
    const urls = [
        `https://www.appbrain.com/stats/google-play-rankings/top_free/communication/${countryCode.toLowerCase()}`,
        `https://www.appbrain.com/stats/google-play-rankings/top_free/communication/${countryCode}`,
        `https://www.appbrain.com/stats/appstore-rankings/top_free/social_networking/${countryCode.toLowerCase()}`
    ];
    const items = await fetchAppBrainTopApps(urls, 40);
    const filtered = items.filter((item) => isMessagingRelevantApp({ name: item.name, appId: item.name, categoryIds: [12] }));
    const perStore = {
        android: filtered
            .filter((item) => item.store !== 'ios')
            .slice(0, 10)
            .map((item, idx) => ({ rank: idx + 1, label: item.name, iconUrl: item.iconUrl || resolveAppIconByName(item.name, 'android') })),
        ios: []
    };
    if (perStore.android.length === 0) {
        throw apptopiaError || new Error('AppBrain fallback returned no messaging rows');
    }
    return {
        source: 'AppBrain top charts (fallback)',
        providers: ['appbrain'],
        providerLinks: { appbrain: urls[0] },
        confidence: 'low',
        note: `Apptopia failed: ${String((apptopiaError && apptopiaError.message) || 'unknown error')}`,
        items: [{ rank: 1, label: 'Per-store top charts' }],
        osLists: perStore,
        osLinks: { android: urls[0], ios: null }
    };
}

async function fetchEmailAppsFromAppBrain(countryName, apptopiaError) {
    const countryCode = (countryNameToAlpha2Mapping[countryName] || countryName || '').toUpperCase();
    const urls = [
        `https://www.appbrain.com/stats/google-play-rankings/top_free/communication/${countryCode.toLowerCase()}`,
        `https://www.appbrain.com/stats/google-play-rankings/top_free/communication/${countryCode}`,
        `https://www.appbrain.com/stats/appstore-rankings/top_free/productivity/${countryCode.toLowerCase()}`
    ];
    const emailKeywords = ['gmail', 'outlook', 'yahoo', 'mail', 'proton', 'spark', 'aol', 'thunderbird', 'bluemail', 'k-9', 'mymail'];
    const items = await fetchAppBrainTopApps(urls, 50);
    const filtered = items.filter((item) => emailKeywords.some((k) => item.name.toLowerCase().includes(k)));
    const perStore = {
        android: filtered
            .filter((item) => item.store !== 'ios')
            .slice(0, 10)
            .map((item, idx) => ({ rank: idx + 1, label: item.name, iconUrl: item.iconUrl || resolveAppIconByName(item.name, 'android') })),
        ios: []
    };
    if (perStore.android.length === 0) {
        throw apptopiaError || new Error('AppBrain fallback returned no email rows');
    }
    return {
        source: 'AppBrain top charts (fallback)',
        providers: ['appbrain'],
        providerLinks: { appbrain: urls[0] },
        confidence: 'low',
        note: `Apptopia failed: ${String((apptopiaError && apptopiaError.message) || 'unknown error')}`,
        items: [{ rank: 1, label: 'Per-store top charts' }],
        osLists: perStore,
        osLinks: { android: urls[0], ios: null }
    };
}

async function fetchAppBrainTopApps(urls, limit) {
    const urlList = Array.isArray(urls) ? urls : [urls];
    let text = '';
    let sourceUrl = '';

    for (const url of urlList) {
        const rjinaWrapped = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`;
        const candidates = [
            `${WORKER_BASE}/proxy?url=${encodeURIComponent(url)}`,
            `${WORKER_BASE}/proxy?url=${encodeURIComponent(rjinaWrapped)}`,
            rjinaWrapped,
            url
        ];
        for (const candidate of candidates) {
            try {
                const response = await fetch(candidate, { method: 'GET' });
                if (!response.ok) continue;
                const body = await response.text();
                if (body && body.length > 200) {
                    text = body;
                    sourceUrl = url;
                    break;
                }
            } catch (error) {
                // keep trying
            }
        }
        if (text) break;
    }
    if (!text) {
        throw new Error('AppBrain fallback request failed');
    }

    const items = [];
    const inferredStore = sourceUrl.includes('/appstore-rankings/') ? 'ios' : 'android';
    const defaultIcon = inferredStore === 'ios'
        ? (storeIconMap.ios && storeIconMap.ios.icon) || ''
        : (storeIconMap.android && storeIconMap.android.icon) || '';

    [...text.matchAll(/\|\s*(\d{1,3})\s*\|\s*\[([^\]]+)\]\((https?:\/\/www\.appbrain\.com\/app\/[^)]+)\)/gi)].forEach((m) => {
        const rowText = String(m[0] || '');
        const iconMatch = rowText.match(/https?:\/\/[^\s)"']+\.(?:png|jpg|jpeg|webp|svg)/i);
        items.push({
            rank: Number(m[1]),
            name: cleanAppName(m[2]),
            iconUrl: iconMatch ? iconMatch[0] : defaultIcon,
            store: inferredStore
        });
    });
    if (items.length === 0) {
        [...text.matchAll(/(?:^|\n)\s*(\d{1,3})\s+[.)-]?\s+([^\n|]{2,120})/g)].forEach((m) => {
            items.push({ rank: Number(m[1]), name: cleanAppName(m[2]), iconUrl: defaultIcon, store: inferredStore });
        });
    }
    if (items.length === 0) {
        [...text.matchAll(/<a[^>]+href="\/app\/[^"]+"[^>]*>([^<]{2,120})<\/a>/gi)].forEach((m, idx) => {
            const snippet = String(m[0] || '');
            const iconMatch = snippet.match(/https?:\/\/[^\s)"']+\.(?:png|jpg|jpeg|webp|svg)/i);
            items.push({
                rank: idx + 1,
                name: cleanAppName(m[1]),
                iconUrl: iconMatch ? iconMatch[0] : defaultIcon,
                store: inferredStore
            });
        });
    }
    if (items.length === 0) {
        [...text.matchAll(/<tr[\s\S]{0,3000}?<td[^>]*>\s*(\d{1,3})\s*<\/td>[\s\S]{0,3000}?<a[^>]+href="\/app\/[^"]+"[^>]*>([^<]{2,120})<\/a>[\s\S]{0,3000}?<\/tr>/gi)].forEach((m) => {
            const rowHtml = String(m[0] || '');
            const iconMatch = rowHtml.match(/<img[^>]+src="([^"]+)"/i);
            items.push({
                rank: Number(m[1]),
                name: cleanAppName(m[2]),
                iconUrl: iconMatch ? iconMatch[1] : defaultIcon,
                store: inferredStore
            });
        });
    }

    return items
        .filter((x) => Number.isFinite(x.rank) && x.name)
        .map((x) => ({ ...x, iconUrl: x.iconUrl || defaultIcon }))
        .sort((a, b) => a.rank - b.rank)
        .slice(0, limit);
}

function buildApptopiaOsLinks(countryName, profile) {
    const countrySlug = toApptopiaCountrySlug(countryName);
    const date = getApptopiaDate();
    const targets = buildApptopiaTargets(profile, countrySlug, date);
    return targets.reduce((acc, target) => {
        acc[target.store] = target.url;
        return acc;
    }, {});
}

async function getApptopiaTopChartApps(countryName, profile) {
    const countrySlug = toApptopiaCountrySlug(countryName);
    const date = getApptopiaDate();
    const cacheKey = `${profile}:${countrySlug}:${date}`;
    if (apptopiaChartsCache.has(cacheKey)) {
        return apptopiaChartsCache.get(cacheKey);
    }

    const task = (async () => {
        const targets = buildApptopiaTargets(profile, countrySlug, date);
        const pages = await Promise.all(targets.map((target) => fetchApptopiaPageText(target.url, target.store)));
        const parsedPages = pages.map((page) => {
            const strictParsed = parseStrictApptopiaFreeTable(page.text, page.sourceUrl, page.store);
            const parsed = strictParsed.length > 0 ? strictParsed : parseApptopiaApps(page.text, page.sourceUrl, page.store);
            return {
                ...page,
                parsedCount: parsed.length,
                sample: parsed.slice(0, 5).map((item) => item.name),
                hasKind: /"kind"\s*:\s*"\s*free\s*"/i.test(page.text),
                hasRanks: /"ranks"\s*:\s*\[/i.test(page.text),
                scriptCount: extractLikelyApptopiaAssetUrls(page.text, page.sourceUrl).length
            };
        });
        let allApps = parsedPages.flatMap((page) => {
            const strictParsed = parseStrictApptopiaFreeTable(page.text, page.sourceUrl, page.store);
            return strictParsed.length > 0 ? strictParsed : parseApptopiaApps(page.text, page.sourceUrl, page.store);
        });

        // If HTML does not contain chart payloads, try external JS assets referenced by the page.
        const assetDebug = [];
        if (allApps.length === 0) {
            const assetAppsByPage = await Promise.all(parsedPages.map(async (page) => {
                const assetUrls = extractLikelyApptopiaAssetUrls(page.text, page.sourceUrl).slice(0, 6);
                const assetTexts = await Promise.all(assetUrls.map(async (assetUrl) => {
                    const asset = await fetchApptopiaAssetText(assetUrl).catch((error) => {
                        assetDebug.push({
                            store: page.store,
                            assetUrl,
                            parser: 'asset-fetch-failed',
                            error: String(error && error.message ? error.message : error)
                        });
                        return null;
                    });
                    return asset ? { ...asset, assetUrl } : null;
                }));

                const parsedFromAssets = [];
                assetTexts.filter(Boolean).forEach((asset) => {
                    const parsed = parseApptopiaApps(asset.text, asset.assetUrl, page.store);
                    if (parsed.length > 0) {
                        parsedFromAssets.push(...parsed);
                    }
                    const apiCandidates = extractApptopiaApiUrlsFromAssetText(asset.text, page.sourceUrl);
                    if (apiCandidates.length > 0) {
                        assetDebug.push({
                            store: page.store,
                            assetUrl: asset.assetUrl,
                            parser: 'api-candidates',
                            count: apiCandidates.length,
                            sample: apiCandidates.slice(0, 5)
                        });
                    }
                    assetDebug.push({
                        store: page.store,
                        assetUrl: asset.assetUrl,
                        parser: asset.parser,
                        contentType: asset.contentType,
                        textLength: asset.text.length,
                        parsedCount: parsed.length,
                        hasKind: /(?:^|[{"',\s])kind\s*:\s*["']\s*free\s*["']/i.test(asset.text),
                        hasRanks: /(?:^|[{"',\s])ranks\s*:\s*\[/i.test(asset.text),
                        hasAppId: /(?:^|[{"',\s])app_?id\s*:/i.test(asset.text),
                        hasCountryIso: /country_?iso/i.test(asset.text),
                        head: String(asset.text || '').slice(0, 240)
                    });
                });

                // If still empty for this page, probe API URLs referenced inside its JS assets.
                if (parsedFromAssets.length === 0) {
                    const apiUrls = [...new Set(assetTexts
                        .filter(Boolean)
                        .flatMap((asset) => extractApptopiaApiUrlsFromAssetText(asset.text, page.sourceUrl)))]
                        .slice(0, 10);

                    const apiPayloads = await Promise.all(apiUrls.map(async (apiUrl) => {
                        try {
                            const payload = await fetchApptopiaApiText(apiUrl);
                            return { apiUrl, ...payload };
                        } catch (error) {
                            assetDebug.push({
                                store: page.store,
                                parser: 'api-fetch-failed',
                                apiUrl,
                                error: String(error && error.message ? error.message : error)
                            });
                            return null;
                        }
                    }));

                    apiPayloads.filter(Boolean).forEach((payload) => {
                        const parsedApi = parseApptopiaApps(payload.text, payload.apiUrl, page.store);
                        if (parsedApi.length > 0) {
                            parsedFromAssets.push(...parsedApi);
                        }
                        assetDebug.push({
                            store: page.store,
                            parser: payload.parser,
                            apiUrl: payload.apiUrl,
                            textLength: payload.text.length,
                            parsedCount: parsedApi.length,
                            head: String(payload.text || '').slice(0, 240)
                        });
                    });
                }

                return parsedFromAssets;
            }));

            allApps = dedupeStoreApps(assetAppsByPage.flat());
        }

        const debugPayload = {
            profile,
            country: countrySlug,
            date,
            pages: parsedPages.map((p) => ({
                store: p.store,
                parser: p.parser,
                sourceUrl: p.sourceUrl,
                textLength: p.text.length,
                parsedCount: p.parsedCount,
                sample: p.sample,
                hasKind: p.hasKind,
                hasRanks: p.hasRanks,
                scriptCount: p.scriptCount,
                head: p.text.split('\n').slice(0, 20).join('\n')
            })),
            assets: assetDebug
        };
        const debugRoot = (window.__apptopiaDebug && typeof window.__apptopiaDebug === 'object') ? window.__apptopiaDebug : {};
        debugRoot[profile] = debugPayload;
        window.__apptopiaDebug = debugRoot;

        if (allApps.length === 0) {
            const detail = parsedPages
                .map((p) => `${p.store}:${p.parser}:len=${p.text.length}:parsed=${p.parsedCount}`)
                .join(' | ');
            throw new Error(`No chart apps parsed from Apptopia pages for ${countrySlug} (${profile}). Debug: ${detail}`);
        }

        return {
            apps: allApps,
            referenceUrl: targets[0].url,
            osLinks: targets.reduce((acc, target) => {
                acc[target.store] = target.url;
                return acc;
            }, {}),
            confidence: allApps.length >= 20 ? 'high' : 'medium'
        };
    })().catch((error) => {
        apptopiaChartsCache.delete(cacheKey);
        throw error;
    });

    apptopiaChartsCache.set(cacheKey, task);
    return task;
}

function parseStrictApptopiaFreeTable(text, sourceUrl, store) {
    const source = String(text || '');
    if (!source || typeof DOMParser === 'undefined') return [];
    try {
        const doc = new DOMParser().parseFromString(source, 'text/html');
        const textNorm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
        const findByText = (keyword) => {
            const kw = keyword.toLowerCase();
            const all = [...doc.querySelectorAll('h1,h2,h3,h4,div,section,th,span')];
            return all.find((el) => textNorm(el.textContent).toLowerCase().includes(kw)) || null;
        };

        const freeAnchor = findByText('free');
        const scoped = freeAnchor ? (freeAnchor.closest('section,div,table') || doc.body) : (doc.querySelector('.page-top-apps') || doc.body);
        const rows = [...scoped.querySelectorAll('tr')];
        const parsed = [];

        for (const tr of rows) {
            const cells = [...tr.querySelectorAll('td,th')].map((c) => textNorm(c.textContent));
            if (cells.length < 2) continue;

            const rankCellIdx = cells.findIndex((c) => /^\d{1,3}$/.test(c));
            if (rankCellIdx === -1) continue;
            const rank = Number(cells[rankCellIdx]);
            if (!Number.isFinite(rank)) continue;

            // App name is usually the next meaningful cell after rank.
            const name = cells
                .slice(rankCellIdx + 1)
                .find((c) => c && !/^(free|paid|grossing|top free)$/i.test(c) && !/^[-—]+$/.test(c));
            if (!name || !looksLikeAppName(name)) continue;

            const img = tr.querySelector('img');
            const iconUrl = img ? String(img.getAttribute('src') || '').trim() : '';

            parsed.push({
                rank,
                name: cleanAppName(name),
                sourceUrl,
                store,
                iconUrl
            });
        }

        if (parsed.length > 0) {
            const dedup = new Map();
            parsed
                .sort((a, b) => a.rank - b.rank)
                .forEach((item) => {
                    if (!dedup.has(item.rank)) {
                        dedup.set(item.rank, item);
                    }
                });
            return [...dedup.values()];
        }
    } catch (error) {
        return [];
    }
    return [];
}

function extractLikelyApptopiaAssetUrls(html, baseUrl) {
    const text = String(html || '');
    const matches = [
        ...text.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
        ...text.matchAll(/<script[^>]+src=([^\s>]+)/gi)
    ];
    const out = [];

    matches.forEach((m) => {
        const raw = String(m[1] || '').trim().replace(/^["']|["']$/g, '');
        if (!raw) return;
        const lower = raw.toLowerCase();
        if (!(
            lower.includes('top-apps') ||
            lower.includes('top-charts') ||
            lower.includes('chunk.js') ||
            lower.includes('/packs-p/js/')
        )) {
            return;
        }
        try {
            out.push(new URL(raw, baseUrl).toString());
        } catch (error) {
            // ignore malformed script src
        }
    });

    // Fallback: scan any JS URLs in body text.
    [...text.matchAll(/https?:\/\/[^\s"'<>]+\.js(?:\?[^\s"'<>]+)?/gi)].forEach((m) => {
        const raw = String(m[0] || '').trim();
        const lower = raw.toLowerCase();
        if (
            lower.includes('top-apps') ||
            lower.includes('top-charts') ||
            lower.includes('chunk.js') ||
            lower.includes('/packs-p/js/')
        ) {
            out.push(raw);
        }
    });

    return [...new Set(out)];
}

function extractApptopiaApiUrlsFromAssetText(text, baseUrl) {
    const source = String(text || '');
    if (!source) return [];

    const out = [];
    const absolute = [...source.matchAll(/https?:\/\/apptopia\.com\/api\/[a-z0-9_./?=&%-]+/gi)];
    absolute.forEach((m) => out.push(String(m[0] || '').replace(/["'\\]+$/g, '')));

    const relative = [...source.matchAll(/(?:^|["'`])\/api\/[a-z0-9_./?=&%-]+/gi)];
    relative.forEach((m) => {
        const raw = String(m[0] || '').replace(/^["'`]/, '').replace(/["'\\]+$/g, '');
        try {
            out.push(new URL(raw, baseUrl).toString());
        } catch (error) {
            // ignore malformed
        }
    });

    // Keep likely chart-related endpoints only.
    return [...new Set(out)].filter((u) => {
        const lower = u.toLowerCase();
        return (
            lower.includes('top') ||
            lower.includes('chart') ||
            lower.includes('rank') ||
            lower.includes('store-insights') ||
            lower.includes('report')
        );
    });
}

async function fetchApptopiaApiText(url) {
    const candidates = [];
    if (!workerProxyUnavailable) {
        const base = `${WORKER_BASE}/proxy`;
        candidates.push({ url: `${base}?url=${encodeURIComponent(url)}`, parser: `worker-proxy-api:${base}` });
    }
    candidates.push({ url, parser: 'direct-api' });

    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate.url, { method: 'GET' });
            if (!response.ok) continue;
            const text = await response.text();
            if (text && text.length > 20) {
                return { text, parser: candidate.parser, apiUrl: url };
            }
        } catch (error) {
            // try next
        }
    }
    throw new Error(`Unable to fetch Apptopia API URL: ${url}`);
}

async function fetchApptopiaAssetText(url) {
    const candidates = [];
    if (!workerProxyUnavailable) {
        const base = `${WORKER_BASE}/proxy`;
        candidates.push({ url: `${base}?url=${encodeURIComponent(url)}`, parser: `worker-proxy-asset:${base}` });
    }
    candidates.push({ url, parser: 'direct-asset' });

    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate.url, { method: 'GET' });
            if (!response.ok) continue;
            const text = await response.text();
            if (text && text.length > 100) {
                return {
                    text,
                    parser: candidate.parser,
                    sourceUrl: url,
                    contentType: response.headers.get('content-type') || ''
                };
            }
        } catch (error) {
            // try next candidate
        }
    }

    throw new Error(`Unable to fetch Apptopia asset: ${url}`);
}

function buildApptopiaTargets(profile, countrySlug, date) {
    if (profile === 'email') {
        return [
            {
                store: 'android',
                url: `https://apptopia.com/store-insights/top-charts/google-play/communication/${countrySlug}?date=${date}`
            },
            {
                store: 'ios',
                url: `https://apptopia.com/store-insights/top-charts/itunes-connect/productivity/${countrySlug}?date=${date}`
            }
        ];
    }

    return [
        {
            store: 'android',
            url: `https://apptopia.com/store-insights/top-charts/google-play/communication/${countrySlug}?date=${date}`
        },
        {
            store: 'ios',
            url: `https://apptopia.com/store-insights/top-charts/itunes-connect/social-networking/${countrySlug}?date=${date}`
        }
    ];
}

async function fetchApptopiaPageText(url, store) {
    const candidates = [];
    if (!workerProxyUnavailable) {
        const base = `${WORKER_BASE}/proxy`;
        candidates.push({ url: `${base}?url=${encodeURIComponent(url)}`, parser: `worker-proxy:${base}` });
        candidates.push({
            url: `${base}?url=${encodeURIComponent(`https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`)}`,
            parser: `worker-proxy-rjina:${base}`
        });
    }
    candidates.push({ url: `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`, parser: 'rjina-direct' });

    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate.url, { method: 'GET' });
            if (!response.ok) {
                continue;
            }
            const text = await response.text();
            if (text && text.length > 100) {
                return { text, sourceUrl: url, store, parser: candidate.parser };
            }
        } catch (error) {
            // keep trying
        }
    }

    throw new Error(`Unable to fetch Apptopia chart page: ${url}. Worker proxy endpoint is unavailable and direct r.jina fallback also failed.`);
}

function parseApptopiaApps(text, sourceUrl, store) {
    const topFreeTableRows = parseTopFreeRowsFromHtmlTable(text, sourceUrl, store);
    if (topFreeTableRows.length > 0) {
        return dedupeStoreApps(topFreeTableRows);
    }

    // For actual Apptopia chart pages, only allow ranked/structured fallback parsers.
    const isTopAppsPage = /<div[^>]+class="[^"]*\bpage-top-apps\b/i.test(String(text || ''));

    const dataAttrRows = parseAppsFromApptopiaDataAttr(text, sourceUrl, store);
    if (dataAttrRows.length > 0) {
        return dedupeStoreApps(dataAttrRows);
    }

    if (isTopAppsPage) {
        // Avoid noisy heuristic parsers on real chart pages; those often break rank ordering.
        return [];
    }

    const normalizedText = normalizeApptopiaSourceText(text);
    const results = [];
    const freeSectionText = extractFreeSection(normalizedText);
    const parseText = freeSectionText || normalizedText || '';
    if (!parseText) {
        return [];
    }
    const push = (rank, rawName) => {
        const name = cleanAppName(rawName);
        if (!name || !looksLikeAppName(name)) return;
        results.push({ rank: Number.isFinite(Number(rank)) ? Number(rank) : results.length + 1, name, sourceUrl, store });
    };

    // Prefer explicit extraction of the "Free" column in markdown-style tables.
    const freeColumnRows = parseFreeColumnRows(parseText);
    freeColumnRows.forEach((row) => push(row.rank, row.name));

    // Apptopia pages often embed chart data as JSON-like blobs with kind="free" + ranks[].
    const freeKindRows = parseFreeKindRanks(parseText);
    freeKindRows.forEach((row) => push(row.rank, row.name));

    // Fallback for minified bundles that contain app_id/rank/country/store but no explicit kind/ranks keys.
    const heuristicRows = parseFreeRowsByCountryStore(parseText, store, sourceUrl);
    heuristicRows.forEach((row) => push(row.rank, row.name));

    const nextDataApps = parseAppsFromNextData(parseText);
    nextDataApps.forEach((item) => {
        push(item.rank, item.name);
    });

    const lines = parseText.split('\n').map((line) => line.trim());
    lines.forEach((line) => {
        const pipe = line.match(/^\|\s*(\d{1,3})\s*\|\s*([^|]{2,120})\s*\|/);
        if (pipe) {
            const stripLinks = pipe[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
            push(pipe[1], stripLinks);
            return;
        }

        const m = line.match(/^(\d{1,3})[.)\-\s]+(.{2,120})$/);
        if (!m) return;
        push(m[1], m[2]);
    });

    // r.jina often returns markdown links for ranked app rows.
    const mdLinks = [...parseText.matchAll(/\[([^\]]{2,120})\]\(([^)]+)\)/g)];
    mdLinks.forEach((match, index) => {
        const label = match[1];
        const link = String(match[2] || '').toLowerCase();
        if (
            link.includes('/apps/') ||
            link.includes('/app/') ||
            link.includes('play.google.com/store/apps') ||
            link.includes('apps.apple.com')
        ) {
            push(index + 1, label);
        }
    });

    // Extract likely app slugs from links and convert to names.
    const slugPatterns = [
        /\/apps\/([a-z0-9-]{2,120})/gi,
        /\/app\/[^\/\s"')]+\/([a-z0-9-]{2,120})/gi,
        /\/store\/apps\/details\?id=([a-z0-9._]+)/gi
    ];
    slugPatterns.forEach((pattern) => {
        const matches = [...parseText.matchAll(pattern)];
        matches.forEach((match, index) => {
            const raw = String(match[1] || '');
            const fromSlug = raw
                .replace(/[._]/g, ' ')
                .replace(/-/g, ' ')
                .trim();
            push(index + 1, fromSlug);
        });
    });

    // Parse common JSON key/value forms when markdown rows are absent.
    const jsonNameMatches = [...parseText.matchAll(/"(?:app_name|appName|title|name|display_name|app_title)"\s*:\s*"([^"]{2,120})"/g)];
    jsonNameMatches.forEach((match, index) => {
        push(index + 1, match[1]);
    });

    // Rank + app name where rank appears first in JSON-like text.
    const rankFirstMatches = [...parseText.matchAll(/"(?:rank|position|chart_position)"\s*:\s*(\d{1,3})[\s\S]{0,220}?"(?:app_name|appName|title|name|display_name|app_title)"\s*:\s*"([^"]{2,120})"/g)];
    rankFirstMatches.forEach((match) => {
        push(match[1], match[2]);
    });

    // Rank + app name where app name appears first in JSON-like text.
    const nameFirstMatches = [...parseText.matchAll(/"(?:app_name|appName|title|name|display_name|app_title)"\s*:\s*"([^"]{2,120})"[\s\S]{0,220}?"(?:rank|position|chart_position)"\s*:\s*(\d{1,3})/g)];
    nameFirstMatches.forEach((match) => {
        push(match[2], match[1]);
    });

    // Markdown/plain rows that include #<rank> <name> anywhere in line.
    const hashRankMatches = [...parseText.matchAll(/(?:^|\n)[^\n#]{0,40}#\s*(\d{1,3})\s+([^\n|]{2,120})/g)];
    hashRankMatches.forEach((match) => {
        push(match[1], match[2]);
    });

    // Generic table-style rows with rank and title but no strict markdown separators.
    const rowMatches = [...parseText.matchAll(/(?:^|\n)\s*(\d{1,3})\s*(?:\||\)|\.|-)\s*([^\n|]{2,120})/g)];
    rowMatches.forEach((match) => {
        push(match[1], match[2]);
    });

    return dedupeStoreApps(results);
}

function parseTopFreeRowsFromHtmlTable(text, sourceUrl, store) {
    const source = String(text || '');
    if (!source || source.indexOf('<table') === -1) return [];

    // Authoritative path: parse DOM and explicitly read the "Free" column from ranked table rows.
    if (typeof DOMParser !== 'undefined') {
        try {
            const doc = new DOMParser().parseFromString(source, 'text/html');
            const tableCandidates = [...doc.querySelectorAll('table')];
            for (const table of tableCandidates) {
                const headerRow = table.querySelector('thead tr')
                    || [...table.querySelectorAll('tr')].find((tr) => tr.querySelector('th'));
                if (!headerRow) continue;

                const headerCells = [...headerRow.querySelectorAll('th,td')].map((th) => cleanAppName(th.textContent).toLowerCase());
                const freeIdx = headerCells.findIndex((h) => h === 'free' || h.includes('top free') || h.includes('free'));
                if (freeIdx < 0) continue;

                const rows = [...table.querySelectorAll('tbody tr, tr')];
                const parsed = [];
                rows.forEach((tr) => {
                    const cells = [...tr.querySelectorAll('td')];
                    if (cells.length === 0 || cells.length <= freeIdx) return;

                    const rank = Number(cleanAppName(cells[0].textContent));
                    if (!Number.isFinite(rank)) return;

                    const freeCell = cells[freeIdx];
                    const appLink = freeCell.querySelector('a.app-name') || freeCell.querySelector('a');
                    if (!appLink) return;

                    const name = cleanAppName(appLink.textContent);
                    if (!name || !looksLikeAppName(name)) return;

                    const img = freeCell.querySelector('img');
                    const iconUrl = img ? String(img.getAttribute('src') || '').trim() : '';

                    parsed.push({ rank, name, sourceUrl, store, iconUrl });
                });

                if (parsed.length > 0) {
                    return parsed
                        .filter((row) => row.rank >= 1 && row.rank <= 200)
                        .sort((a, b) => a.rank - b.rank);
                }
            }
        } catch (error) {
            return [];
        }
    }

    // Raw HTML fallback: parse ranked rows and take first app-name in each row (free column).
    const out = [];
    const rows = [...source.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    rows.forEach((rowMatch) => {
        const rowHtml = String(rowMatch[1] || '');
        if (!/app-name/i.test(rowHtml)) return;

        const rankMatch = rowHtml.match(/<td[^>]*>\s*(?:<[^>]+>\s*)*(\d{1,3})\s*(?:<\/[^>]+>\s*)*<\/td>/i);
        if (!rankMatch) return;
        const rank = Number(rankMatch[1]);
        if (!Number.isFinite(rank)) return;

        const appNameMatches = [...rowHtml.matchAll(/class="[^"]*\bapp-name\b[^"]*"[^>]*>([^<]{2,200})<\/a>/gi)];
        if (appNameMatches.length === 0) return;
        const name = cleanAppName(decodeHtmlEntities(appNameMatches[0][1]));
        if (!name || !looksLikeAppName(name)) return;

        const iconMatches = [...rowHtml.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/gi)];
        const iconUrl = iconMatches.length > 0 ? String(iconMatches[0][1] || '') : '';
        out.push({ rank, name, sourceUrl, store, iconUrl });
    });

    return out
        .filter((row) => row.rank >= 1 && row.rank <= 200)
        .sort((a, b) => a.rank - b.rank);
}

function parseAppsFromApptopiaDataAttr(text, sourceUrl, store) {
    const source = String(text || '');
    if (!source) return [];

    const attrMatch =
        source.match(/data-data="([\s\S]*?)"\sdata-[a-z0-9_-]+=/i) ||
        source.match(/data-data="([\s\S]*?)"\s*>/i);
    if (!attrMatch) {
        return [];
    }

    const encoded = String(attrMatch[1] || '');
    if (!encoded) return [];

    let payload = null;
    try {
        payload = JSON.parse(decodeHtmlEntities(encoded));
    } catch (error) {
        return [];
    }
    if (!payload || typeof payload !== 'object') {
        return [];
    }

    const targetStore = normalizeApptopiaStoreName(store);
    const out = [];
    let inferredRank = 0;

    Object.values(payload).forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;
        const data = (entry.data && typeof entry.data === 'object' ? entry.data : null)
            || (entry.general_data && typeof entry.general_data === 'object' ? entry.general_data : null)
            || entry;

        const kind = String(data.kind || '').toLowerCase().trim();
        if (kind && kind !== 'free') return;

        const rowStore = normalizeApptopiaStoreName(data.store || entry.store || '');
        if (targetStore && rowStore && rowStore !== targetStore) return;

        const rawName = data.name || data.app_name || data.appName || data.display_name || data.title || data.app_id || data.id;
        const name = cleanAppName(rawName);
        if (!name || !looksLikeAppName(name)) return;

        inferredRank += 1;
        const categories = Array.isArray(data.category_ids) ? data.category_ids.map((id) => Number(id)).filter(Number.isFinite) : [];
        out.push({
            rank: inferredRank,
            name,
            sourceUrl,
            store,
            appId: String(data.app_id || data.id || ''),
            appUrl: String(data.url || ''),
            iconUrl: String(data.icon_url || (data.cdn_images && (data.cdn_images['64x64'] || data.cdn_images['128x128'] || data.cdn_images['32x32'])) || ''),
            categoryIds: categories
        });
    });

    return out;
}

function isMessagingRelevantApp(app) {
    const name = String(app && app.name ? app.name : '').toLowerCase();
    const appId = String(app && app.appId ? app.appId : '').toLowerCase();
    const categories = Array.isArray(app && app.categoryIds) ? app.categoryIds : [];

    const messagingNameTokens = [
        'whatsapp', 'telegram', 'messenger', 'signal', 'line', 'wechat', 'viber',
        'discord', 'snapchat', 'kakao', 'skype', 'imo', 'zalo', 'talkatone',
        'messages', 'chat', 'sms', 'textnow', 'textfree', 'wecom'
    ];
    const blockedNameTokens = [
        'browser', 'vpn', 'firefox', 'opera', 'chrome', 'email', 'mail', 'pec',
        'outlook', 'gmail', 'adblock', 'translate', 'scanner'
    ];
    const blockedIdTokens = ['.browser', 'mozilla.firefox', 'opera.', 'chrome.', '.email', '.mail'];

    const hasMessagingToken = messagingNameTokens.some((t) => name.includes(t) || appId.includes(t));
    const hasBlockedToken = blockedNameTokens.some((t) => name.includes(t))
        || blockedIdTokens.some((t) => appId.includes(t));

    // Communication category on Google Play is 12; Social Networking on iOS is 6005.
    const hasMessagingCategory = categories.includes(12) || categories.includes(6005);

    if (hasBlockedToken && !hasMessagingToken) return false;
    if (hasMessagingCategory) return true;
    return hasMessagingToken;
}

function normalizeApptopiaStoreName(value) {
    const v = String(value || '').toLowerCase().trim();
    if (!v) return '';
    if (v === 'android' || v.includes('google_play') || v.includes('google-play')) return 'google_play';
    if (v === 'ios' || v.includes('itunes_connect') || v.includes('itunes-connect')) return 'itunes_connect';
    return v;
}

function parseFreeRowsByCountryStore(text, store, sourceUrl) {
    const source = String(text || '')
        .replace(/\\"/g, '"')
        .replace(/\\u0022/g, '"');
    if (!source) return [];

    const country = String(selectedCountryCode || '').toUpperCase();
    const countryFromUrl = extractCountryCodeFromApptopiaUrl(sourceUrl);
    const targetCountry = country || countryFromUrl;
    if (!targetCountry) return [];

    const isAndroid = store === 'android';
    const storeOk = (value) => {
        const s = String(value || '').toLowerCase();
        if (isAndroid) return s.includes('google_play') || s.includes('google-play') || s === 'android';
        return s.includes('itunes_connect') || s.includes('itunes-connect') || s === 'ios';
    };

    const keyAppId = '(?:"?app_id"?|"?appId"?)';
    const keyRank = '(?:"?rank"?)';
    const keyCountry = '(?:"?country_iso"?|"?countryIso"?)';
    const keyStore = '(?:"?store"?)';

    const nameByAppId = new Map();
    const nameKey = '(?:"?name"?|"?display_name"?|"?displayName"?|"?app_name"?|"?appName"?|"?title"?)';
    [...source.matchAll(new RegExp(`${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,10000}?${nameKey}\\s*:\\s*['"]([^'"]+)['"]`, 'g'))]
        .forEach((m) => {
            const appId = String(m[1] || '').trim();
            const name = cleanAppName(m[2]);
            if (appId && name && !nameByAppId.has(appId)) nameByAppId.set(appId, name);
        });

    const rows = [
        ...source.matchAll(new RegExp(`${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,2400}?${keyRank}\\s*:\\s*['"]?(\\d{1,3})['"]?[\\s\\S]{0,2400}?${keyCountry}\\s*:\\s*['"]([A-Z]{2})['"][\\s\\S]{0,2400}?${keyStore}\\s*:\\s*['"]([^'"]+)['"]`, 'gi')),
        ...source.matchAll(new RegExp(`${keyRank}\\s*:\\s*['"]?(\\d{1,3})['"]?[\\s\\S]{0,2400}?${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,2400}?${keyCountry}\\s*:\\s*['"]([A-Z]{2})['"][\\s\\S]{0,2400}?${keyStore}\\s*:\\s*['"]([^'"]+)['"]`, 'gi'))
    ];

    const out = [];
    rows.forEach((m) => {
        const rankFirst = typeof m[1] === 'string' && /^\d{1,3}$/.test(m[1]);
        const appId = String(rankFirst ? m[2] : m[1] || '').trim();
        const rank = Number(rankFirst ? m[1] : m[2]);
        const rowCountry = String(m[3] || '').toUpperCase();
        const rowStore = String(m[4] || '');
        const snippet = String(m[0] || '').toLowerCase();

        if (!appId || !Number.isFinite(rank)) return;
        if (rowCountry !== targetCountry) return;
        if (!storeOk(rowStore)) return;

        // Keep only free rows when kind is explicitly present.
        if (snippet.includes('kind')) {
            if (snippet.includes('paid') || snippet.includes('grossing')) return;
            if (!snippet.includes('free')) return;
        }

        const name = nameByAppId.get(appId) || appId.replace(/[._-]+/g, ' ');
        out.push({ rank, name });
    });

    return out;
}

function extractCountryCodeFromApptopiaUrl(url) {
    const text = String(url || '').toLowerCase();
    const m = text.match(/\/top-charts\/(?:google-play|itunes-connect)\/[^/]+\/([^/?#]+)/);
    if (!m) return '';
    const slug = m[1];
    for (const [name, code] of Object.entries(countryNameToAlpha2Mapping)) {
        if (toApptopiaCountrySlug(name) === slug) return code.toUpperCase();
    }
    return '';
}

function parseFreeColumnRows(text) {
    const lines = String(text || '').split('\n');
    const out = [];

    for (let i = 0; i < lines.length; i++) {
        const headerLine = lines[i].trim();
        if (!headerLine.includes('|')) continue;

        const headerCells = splitMarkdownRow(headerLine).map((c) => c.toLowerCase());
        const freeCol = headerCells.findIndex((c) => c === 'free' || c.includes('top free') || c.includes('free apps'));
        if (freeCol < 0) continue;

        let rowCounter = 0;
        for (let j = i + 1; j < lines.length; j++) {
            const rowLine = lines[j].trim();
            if (!rowLine.includes('|')) break;
            if (/^\|?\s*:?-{2,}/.test(rowLine)) continue;

            const cells = splitMarkdownRow(rowLine);
            if (cells.length <= freeCol) continue;

            const freeValue = cells[freeCol];
            if (!freeValue) continue;

            const rankCell = cells.find((c) => /^\d{1,3}$/.test(c));
            rowCounter += 1;
            out.push({
                rank: rankCell ? Number(rankCell) : rowCounter,
                name: freeValue
            });
        }
    }

    return out;
}

function splitMarkdownRow(line) {
    return line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim());
}

function normalizeApptopiaSourceText(input) {
    let source = String(input || '');
    if (!source) {
        return '';
    }

    // Browser "View Source" wrappers add many tags that hide the underlying content.
    const isViewSourceWrapper = /<body[^>]*id=["']viewsource["']/i.test(source)
        || /class=["']attribute-value["']/i.test(source);

    if (isViewSourceWrapper) {
        source = source
            .replace(/<span id="line\d+"><\/span>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, ' ');
    }

    source = source
        .replace(/&\s*amp\s*;\s*quot\s*;/gi, '&quot;')
        .replace(/&\s*amp\s*;\s*#\s*(\d+)\s*;/gi, '&#$1;')
        .replace(/&\s*amp\s*;/gi, '&');

    source = decodeHtmlEntities(source).replace(/\r/g, '');
    return normalizeJsonLikeKeys(source);
}

function decodeHtmlEntities(input) {
    const source = String(input || '');
    if (!source) {
        return '';
    }

    if (typeof document !== 'undefined') {
        const decoder = document.createElement('textarea');
        decoder.innerHTML = source;
        return decoder.value;
    }

    return source
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function normalizeJsonLikeKeys(text) {
    // View-source wrappers often turn `"key"` into `" key  "` in long JSON blobs.
    return String(text || '').replace(/"\s*([A-Za-z0-9_]+)\s*"\s*:/g, '"$1":');
}

function parseFreeKindRanks(text) {
    const source = String(text || '');
    if (!source) {
        return [];
    }

    // Normalize JSON-like payloads that include escaped quotes inside scripts.
    const normalizedSource = source
        .replace(/\\"/g, '"')
        .replace(/\\u0022/g, '"');

    const nameByAppId = new Map();
    const setName = (appIdRaw, nameRaw) => {
        const appId = String(appIdRaw || '').trim();
        const name = cleanAppName(nameRaw);
        if (!appId || !name || name.toLowerCase() === 'null') return;
        if (!nameByAppId.has(appId)) {
            nameByAppId.set(appId, name);
        }
    };

    const keyAppId = '(?:"?app_id"?|"?appId"?)';
    const keyName = '(?:"?name"?|"?display_name"?|"?displayName"?|"?app_name"?|"?appName"?|"?title"?)';
    const appMetaMatches = [...normalizedSource.matchAll(new RegExp(`${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,8000}?${keyName}\\s*:\\s*['"]([^'"]*)['"]`, 'g'))];
    appMetaMatches.forEach((match) => {
        setName(match[1], match[2]);
    });
    const nameFirstMatches = [...normalizedSource.matchAll(new RegExp(`${keyName}\\s*:\\s*['"]([^'"]*)['"][\\s\\S]{0,8000}?${keyAppId}\\s*:\\s*['"]([^'"]+)['"]`, 'g'))];
    nameFirstMatches.forEach((match) => {
        setName(match[2], match[1]);
    });

    const out = [];
    const keyKind = '(?:"?kind"?)';
    const keyRanks = '(?:"?ranks"?)';
    const keyRank = '(?:"?rank"?)';
    const kindMatches = [...normalizedSource.matchAll(new RegExp(`${keyKind}\\s*:\\s*['"]\\s*free\\s*['"]`, 'gi'))];
    kindMatches.forEach((kindMatch) => {
        const start = typeof kindMatch.index === 'number' ? kindMatch.index : -1;
        if (start < 0) return;

        const tail = normalizedSource.slice(start);
        const ranksMatch = new RegExp(`${keyRanks}\\s*:\\s*\\[`, 'i').exec(tail);
        if (!ranksMatch || typeof ranksMatch.index !== 'number') return;

        const arrayStart = start + ranksMatch.index + ranksMatch[0].lastIndexOf('[');
        const arrayEnd = findMatchingBracketIndex(normalizedSource, arrayStart);
        if (arrayEnd <= arrayStart) return;

        const ranksBlock = normalizedSource.slice(arrayStart + 1, arrayEnd);
        const rows = [
            ...ranksBlock.matchAll(new RegExp(`${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,4000}?${keyRank}\\s*:\\s*['"]?(\\d{1,3})['"]?[\\s\\S]{0,4000}?${keyName}\\s*:\\s*(?:['"]([^'"]*)['"]|null)`, 'g')),
            ...ranksBlock.matchAll(new RegExp(`${keyRank}\\s*:\\s*['"]?(\\d{1,3})['"]?[\\s\\S]{0,4000}?${keyAppId}\\s*:\\s*['"]([^'"]+)['"][\\s\\S]{0,4000}?${keyName}\\s*:\\s*(?:['"]([^'"]*)['"]|null)`, 'g'))
        ];
        rows.forEach((row) => {
            const rankFirst = typeof row[1] === 'string' && /^\d{1,3}$/.test(row[1]);
            const appId = String(rankFirst ? row[2] : row[1] || '').trim();
            const rank = Number(rankFirst ? row[1] : row[2]);
            const nameFromRank = cleanAppName(row[3]);
            const resolved = nameFromRank && nameFromRank.toLowerCase() !== 'null'
                ? nameFromRank
                : nameByAppId.get(appId);
            if (!resolved || !Number.isFinite(rank)) return;
            out.push({ rank, name: resolved });
        });
    });

    return out;
}

function findMatchingBracketIndex(text, openIndex) {
    if (!text || openIndex < 0 || openIndex >= text.length || text[openIndex] !== '[') {
        return -1;
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = openIndex; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === '\\') {
                escaped = true;
                continue;
            }
            if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }

        if (ch === '[') {
            depth += 1;
            continue;
        }

        if (ch === ']') {
            depth -= 1;
            if (depth === 0) {
                return i;
            }
        }
    }

    return -1;
}

function extractFreeSection(text) {
    const source = String(text || '');
    const topFreeMatches = [...source.matchAll(/\btop\s+free\b/gi)];
    const freeStart = topFreeMatches.length > 0
        ? topFreeMatches[topFreeMatches.length - 1].index
        : source.search(/\b(top\s+free|free\s+apps?|free\s+chart)\b/i);
    if (freeStart < 0) {
        return '';
    }
    const tail = source.slice(freeStart);
    const endMatch = tail.match(/\b(top\s+grossing|grossing|paid\s+apps?|top\s+paid|in-app purchases)\b/i);
    if (endMatch && typeof endMatch.index === 'number' && endMatch.index > 0) {
        return tail.slice(0, endMatch.index);
    }
    return tail;
}

function parseAppsFromNextData(text) {
    const scriptMatch = text.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (!scriptMatch) {
        return [];
    }
    try {
        const data = JSON.parse(scriptMatch[1]);
        return extractAppLikeObjects(data);
    } catch (error) {
        return [];
    }
}

function extractAppLikeObjects(root) {
    const output = [];
    const queue = [root];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current || typeof current !== 'object') {
            continue;
        }

        if (Array.isArray(current)) {
            current.forEach((item) => queue.push(item));
            continue;
        }

        const keys = Object.keys(current);
        const nameCandidate = current.name || current.title || current.app_name || current.appName;
        const rankCandidate = current.rank || current.position || current.chart_position;
        if (typeof nameCandidate === 'string' && looksLikeAppName(nameCandidate)) {
            output.push({
                name: cleanAppName(nameCandidate),
                rank: Number.isFinite(Number(rankCandidate)) ? Number(rankCandidate) : output.length + 1
            });
        }

        keys.forEach((key) => {
            const value = current[key];
            if (value && typeof value === 'object') {
                queue.push(value);
            }
        });
    }

    return output;
}

function cleanAppName(value) {
    return String(value || '')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

function looksLikeAppName(value) {
    const v = value.toLowerCase();
    if (v.length < 2 || v.length > 80) return false;
    const blocked = ['apptopia', 'top charts', 'google play', 'itunes connect', 'social networking', 'communication', 'store insights'];
    if (blocked.some((x) => v.includes(x))) return false;
    const exactBlocked = new Set(['google', 'itunes', 'apple', 'android', 'ios', 'free', 'paid', 'grossing', 'chart', 'rank']);
    if (/^(https?:\/\/|www\.)/.test(v)) return false;
    if (/^[a-z0-9._-]+$/.test(v) && !v.includes(' ') && !v.includes('&')) return false;
    return !exactBlocked.has(v);
}

function dedupeStoreApps(items) {
    const best = new Map();
    items.forEach((item, index) => {
        const key = `${item.store}:${item.name.toLowerCase()}`;
        const rank = Number.isFinite(item.rank) ? item.rank : index + 1;
        const existing = best.get(key);
        if (!existing || rank < existing.rank) {
            best.set(key, {
                rank,
                name: item.name,
                sourceUrl: item.sourceUrl,
                store: item.store,
                iconUrl: item.iconUrl || '',
                appUrl: item.appUrl || '',
                appId: item.appId || '',
                categoryIds: Array.isArray(item.categoryIds) ? item.categoryIds : []
            });
        }
    });
    return [...best.values()].sort((a, b) => a.rank - b.rank);
}

function buildPerStoreTopLists(apps, limit) {
    const ios = apps
        .filter((app) => app.store === 'ios')
        .sort((a, b) => a.rank - b.rank)
        .slice(0, limit)
        .map((app) => ({ rank: app.rank, label: app.name, iconUrl: app.iconUrl || '', appUrl: app.appUrl || '' }));

    const android = apps
        .filter((app) => app.store === 'android')
        .sort((a, b) => a.rank - b.rank)
        .slice(0, limit)
        .map((app) => ({ rank: app.rank, label: app.name, iconUrl: app.iconUrl || '', appUrl: app.appUrl || '' }));

    return { ios, android };
}

function toApptopiaCountrySlug(countryName) {
    return toStatcounterSlug(countryName);
}

function getApptopiaDate() {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return d.toISOString().slice(0, 10);
}

function classifyDomains(domains, taxonomy) {
    const bestRanks = new Map();

    domains.forEach((item) => {
        const host = normalizeHost(item.domain);
        taxonomy.forEach((service) => {
            if (!matchesAnyDomain(host, service.domains)) return;
            const existing = bestRanks.get(service.name);
            if (!existing || item.rank < existing.rank) {
                bestRanks.set(service.name, { rank: item.rank, domain: item.domain });
            }
        });
    });

    return [...bestRanks.entries()]
        .sort((a, b) => a[1].rank - b[1].rank)
        .slice(0, 10)
        .map(([name, value], index) => ({
            rank: index + 1,
            label: name,
            value: `domain rank #${value.rank} (${value.domain})`
        }));
}

function normalizeHost(domain) {
    return String(domain || '')
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
}

function matchesAnyDomain(host, domains) {
    return domains.some((candidate) => host === candidate || host.endsWith(`.${candidate}`));
}

async function getTopDomainsForCountry(countryCode) {
    if (topDomainsCache.has(countryCode)) {
        return topDomainsCache.get(countryCode);
    }

    const requestPromise = fetchTopDomainsRaw(countryCode)
        .catch((error) => {
            topDomainsCache.delete(countryCode);
            throw error;
        });

    topDomainsCache.set(countryCode, requestPromise);
    return requestPromise;
}

async function fetchTopDomainsRaw(countryCode) {
    const response = await fetch(`${API_BASE}/ranking/top?limit=100&location=${countryCode}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Cloudflare ranking/top failed (${response.status})`);
    }

    const payload = await response.json();
    const rows = payload && payload.result && Array.isArray(payload.result.top_0) ? payload.result.top_0 : [];
    return rows.map((row, index) => ({
        rank: typeof row.rank === 'number' ? row.rank : index + 1,
        domain: row.domain || row.name || row.id || 'unknown'
    }));
}

function renderTechStats(results, configs) {
    const grid = document.getElementById('tech-stats-grid');
    grid.innerHTML = '';
    const byKey = {};
    configs.forEach((cfg, idx) => {
        byKey[cfg.key] = results[idx];
    });

    const messaging = byKey.messaging_apps;
    grid.appendChild(buildMessagingAppsCard(messaging));

    const email = byKey.email_apps;
    grid.appendChild(buildDefaultStatCard('Most common email apps', 'email', email));

    const phones = byKey.phones;
    const laptops = byKey.laptops;
    grid.appendChild(buildPhonesLaptopsCard(phones, laptops));

    grid.appendChild(buildDefaultStatCard('Most common browsers', 'browsers', byKey.browsers));
    grid.appendChild(buildDefaultStatCard('Most common OS', 'os', byKey.os));
    grid.appendChild(buildDefaultStatCard('Most common first hop', 'first_hop', byKey.first_hop));
}

function buildBaseCard(titleText, extraClass = '') {
    const card = document.createElement('section');
    card.className = `stat-card ${extraClass}`.trim();
    const title = document.createElement('h3');
    title.textContent = titleText;
    card.appendChild(title);
    return card;
}

function appendProvidersAndConfidence(card, value) {
    const providers = Array.isArray(value.providers) ? value.providers : [];
    const providerLinks = value.providerLinks && typeof value.providerLinks === 'object' ? value.providerLinks : {};
    const confidenceRow = document.createElement('div');
    confidenceRow.className = 'confidence-row';
    const confidence = document.createElement('p');
    confidence.className = 'stat-muted';
    confidence.textContent = `Confidence: ${value.confidence || 'unknown'}`;
    confidenceRow.appendChild(confidence);

    if (providers.length > 0) {
        const iconRow = document.createElement('div');
        iconRow.className = 'source-icons';
        providers.forEach((providerId) => {
            const provider = sourceIconMap[providerId];
            if (!provider) return;
            const link = document.createElement('a');
            link.href = providerLinks[providerId] || provider.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'source-icon-link';
            link.title = `${provider.name} data`;
            const icon = document.createElement('img');
            icon.src = provider.icon;
            icon.alt = provider.name;
            icon.className = 'source-icon';
            link.appendChild(icon);
            iconRow.appendChild(link);
        });
        confidenceRow.appendChild(iconRow);
    }
    card.appendChild(confidenceRow);
}

function appendError(card, result) {
    const empty = document.createElement('p');
    empty.className = 'stat-muted';
    const cleanedError = sanitizeInsightError(result && result.status === 'rejected' ? result.reason && result.reason.message : '');
    empty.textContent = result && result.status === 'rejected'
        ? `No data for ${selectedCountryName || 'this country'} in ${currentDateRange}. ${cleanedError || 'Source unavailable.'}`
        : `No data available for ${selectedCountryName || 'this country'} in ${currentDateRange}.`;
    card.appendChild(empty);
}

function buildSingleStoreAppCard(title, result, store, extraClass) {
    const card = buildBaseCard(title, extraClass);
    if (!result || result.status !== 'fulfilled' || !result.value || !result.value.osLists) {
        appendError(card, result);
        return card;
    }
    appendProvidersAndConfidence(card, result.value);
    const items = store === 'ios'
        ? (result.value.osLists.ios || [])
        : (result.value.osLists.android || []);
    card.appendChild(buildStoreListPanel(items, store));
    return card;
}

function buildMessagingAppsCard(result) {
    const card = buildBaseCard('Most common messaging apps', 'stat-span-2');
    if (!result || result.status !== 'fulfilled' || !result.value || !result.value.osLists) {
        appendError(card, result);
        return card;
    }
    appendProvidersAndConfidence(card, result.value);
    card.appendChild(buildOsMatrixTable(result.value.osLists, result.value.osLinks || {}));
    return card;
}

function buildDefaultStatCard(title, key, result) {
    const card = buildBaseCard(title, `stat-${key}`);
    if (!result || result.status !== 'fulfilled' || !result.value || !Array.isArray(result.value.items) || result.value.items.length === 0) {
        appendError(card, result);
        return card;
    }
    appendProvidersAndConfidence(card, result.value);

    if (result.value.osLists) {
        card.appendChild(buildOsStackTable(result.value.osLists, result.value.osLinks || {}));
        return card;
    }

    const list = document.createElement('ol');
    list.className = 'stat-list';
    result.value.items.forEach((item) => {
        const li = document.createElement('li');
        const row = document.createElement('div');
        row.className = 'stat-list-item';
        const iconUrl = resolveMetricIcon(key, item.label);
        if (iconUrl) {
            const icon = document.createElement('img');
            icon.src = iconUrl;
            icon.alt = '';
            icon.className = 'stat-item-icon';
            row.appendChild(icon);
        }
        const label = document.createElement('span');
        label.textContent = item.value ? `${item.label} (${item.value})` : item.label;
        row.appendChild(label);
        li.appendChild(row);
        list.appendChild(li);
    });
    card.appendChild(list);
    return card;
}

function buildPhonesLaptopsCard(phonesResult, laptopsResult) {
    const card = buildBaseCard('Most common phones and laptops', 'stat-phones-laptops');
    const table = document.createElement('table');
    table.className = 'os-stack';
    const phonesHeaderRow = document.createElement('tr');
    phonesHeaderRow.appendChild(buildMetricHeaderCell('Phones', phonesResult));
    table.appendChild(phonesHeaderRow);

    const phonesBodyRow = document.createElement('tr');
    phonesBodyRow.appendChild(buildMetricListCell(phonesResult));
    table.appendChild(phonesBodyRow);

    const laptopsHeaderRow = document.createElement('tr');
    laptopsHeaderRow.appendChild(buildMetricHeaderCell('Laptops', laptopsResult));
    table.appendChild(laptopsHeaderRow);

    const laptopsBodyRow = document.createElement('tr');
    laptopsBodyRow.appendChild(buildMetricListCell(laptopsResult));
    table.appendChild(laptopsBodyRow);
    card.appendChild(table);
    return card;
}

function sanitizeInsightError(message) {
    const text = String(message || '');
    if (!text) return '';
    const withoutDebug = text.replace(/\s*Debug:\s*[\s\S]*$/i, '').trim();
    return withoutDebug;
}

function resolveMetricIcon(metricKey, label) {
    const value = String(label || '').trim();
    if (!value) return '';
    const lower = value.toLowerCase();

    if (metricKey === 'browsers') {
        if (lower.includes('chrome')) return 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
        if (lower.includes('safari')) return 'https://www.google.com/s2/favicons?domain=apple.com&sz=64';
        if (lower.includes('firefox')) return 'https://www.google.com/s2/favicons?domain=mozilla.org&sz=64';
        if (lower.includes('opera')) return 'https://www.google.com/s2/favicons?domain=opera.com&sz=64';
        if (lower.includes('edge')) return 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64';
    }
    if (metricKey === 'os') {
        if (lower.includes('windows')) return 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64';
        if (lower.includes('android')) return 'https://www.google.com/s2/favicons?domain=android.com&sz=64';
        if (lower.includes('ios') || lower.includes('os x') || lower.includes('mac')) return 'https://www.google.com/s2/favicons?domain=apple.com&sz=64';
        if (lower.includes('linux')) return 'https://www.google.com/s2/favicons?domain=ubuntu.com&sz=64';
    }
    if (metricKey === 'phones') {
        if (lower.includes('samsung')) return 'https://www.google.com/s2/favicons?domain=samsung.com&sz=64';
        if (lower.includes('apple')) return 'https://www.google.com/s2/favicons?domain=apple.com&sz=64';
        if (lower.includes('xiaomi')) return 'https://www.google.com/s2/favicons?domain=mi.com&sz=64';
        if (lower.includes('huawei')) return 'https://www.google.com/s2/favicons?domain=huawei.com&sz=64';
        if (lower.includes('oppo')) return 'https://www.google.com/s2/favicons?domain=oppo.com&sz=64';
        if (lower.includes('vivo')) return 'https://www.google.com/s2/favicons?domain=vivo.com&sz=64';
    }
    if (metricKey === 'laptops') {
        if (lower.includes('mac')) return 'https://www.google.com/s2/favicons?domain=apple.com&sz=64';
        if (lower.includes('windows')) return 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=64';
        if (lower.includes('chrome os')) return 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
        if (lower.includes('linux')) return 'https://www.google.com/s2/favicons?domain=ubuntu.com&sz=64';
    }
    return '';
}

function resolveAppIconByName(name, store) {
    const n = String(name || '').toLowerCase();
    const map = [
        { token: 'whatsapp', icon: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64' },
        { token: 'telegram', icon: 'https://www.google.com/s2/favicons?domain=telegram.org&sz=64' },
        { token: 'messenger', icon: 'https://www.google.com/s2/favicons?domain=messenger.com&sz=64' },
        { token: 'signal', icon: 'https://www.google.com/s2/favicons?domain=signal.org&sz=64' },
        { token: 'line', icon: 'https://www.google.com/s2/favicons?domain=line.me&sz=64' },
        { token: 'discord', icon: 'https://www.google.com/s2/favicons?domain=discord.com&sz=64' },
        { token: 'snapchat', icon: 'https://www.google.com/s2/favicons?domain=snapchat.com&sz=64' },
        { token: 'wechat', icon: 'https://www.google.com/s2/favicons?domain=wechat.com&sz=64' },
        { token: 'viber', icon: 'https://www.google.com/s2/favicons?domain=viber.com&sz=64' },
        { token: 'skype', icon: 'https://www.google.com/s2/favicons?domain=skype.com&sz=64' },
        { token: 'gmail', icon: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=64' },
        { token: 'outlook', icon: 'https://www.google.com/s2/favicons?domain=outlook.com&sz=64' },
        { token: 'yahoo', icon: 'https://www.google.com/s2/favicons?domain=mail.yahoo.com&sz=64' },
        { token: 'proton', icon: 'https://www.google.com/s2/favicons?domain=proton.me&sz=64' },
        { token: 'spark', icon: 'https://www.google.com/s2/favicons?domain=readdle.com&sz=64' },
        { token: 'aol', icon: 'https://www.google.com/s2/favicons?domain=aol.com&sz=64' },
        { token: 'thunderbird', icon: 'https://www.google.com/s2/favicons?domain=thunderbird.net&sz=64' }
    ];
    const hit = map.find((m) => n.includes(m.token));
    if (hit) return hit.icon;
    return store === 'ios'
        ? (storeIconMap.ios && storeIconMap.ios.icon) || ''
        : (storeIconMap.android && storeIconMap.android.icon) || '';
}

function buildOsStackTable(osLists, osLinks) {
    const table = document.createElement('table');
    table.className = 'os-stack';

    const androidHeader = document.createElement('tr');
    androidHeader.appendChild(buildStoreHeaderCell('android', osLinks.android));
    table.appendChild(androidHeader);

    const androidBody = document.createElement('tr');
    androidBody.appendChild(buildStoreListCell(osLists.android || [], 'android'));
    table.appendChild(androidBody);

    const iosHeader = document.createElement('tr');
    iosHeader.appendChild(buildStoreHeaderCell('ios', osLinks.ios));
    table.appendChild(iosHeader);

    const iosBody = document.createElement('tr');
    iosBody.appendChild(buildStoreListCell(osLists.ios || [], 'ios'));
    table.appendChild(iosBody);

    return table;
}

function buildOsMatrixTable(osLists, osLinks) {
    const table = document.createElement('table');
    table.className = 'os-matrix';

    const headerRow = document.createElement('tr');
    headerRow.appendChild(buildStoreHeaderCell('android', osLinks.android));
    headerRow.appendChild(buildStoreHeaderCell('ios', osLinks.ios));
    table.appendChild(headerRow);

    const bodyRow = document.createElement('tr');
    bodyRow.appendChild(buildStoreListCell(osLists.android || [], 'android'));
    bodyRow.appendChild(buildStoreListCell(osLists.ios || [], 'ios'));
    table.appendChild(bodyRow);
    return table;
}

function buildMetricHeaderCell(title, result) {
    const cell = document.createElement('th');
    const wrap = document.createElement('div');
    wrap.className = 'os-header';

    const label = document.createElement('span');
    label.textContent = title;
    wrap.appendChild(label);

    const value = result && result.status === 'fulfilled' ? result.value : null;
    const providers = value && Array.isArray(value.providers) ? value.providers : [];
    const providerLinks = value && value.providerLinks && typeof value.providerLinks === 'object' ? value.providerLinks : {};
    providers.forEach((providerId) => {
        const provider = sourceIconMap[providerId];
        if (!provider) return;
        const link = document.createElement('a');
        link.href = providerLinks[providerId] || provider.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'source-icon-link';
        link.title = `${provider.name} source`;
        const providerIcon = document.createElement('img');
        providerIcon.src = provider.icon;
        providerIcon.alt = provider.name;
        providerIcon.className = 'source-icon';
        link.appendChild(providerIcon);
        wrap.appendChild(link);
    });

    cell.appendChild(wrap);
    return cell;
}

function buildMetricListCell(result) {
    const cell = document.createElement('td');
    const value = result && result.status === 'fulfilled' ? result.value : null;
    const items = value && Array.isArray(value.items) ? value.items : [];
    if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'stat-muted';
        empty.textContent = 'No data currently available';
        cell.appendChild(empty);
        return cell;
    }
    const list = document.createElement('ol');
    list.className = 'os-list';
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.value ? `${item.label} (${item.value})` : item.label;
        list.appendChild(li);
    });
    cell.appendChild(list);
    return cell;
}

function buildStoreHeaderCell(store, linkUrl) {
    const cell = document.createElement('th');
    const iconData = storeIconMap[store];

    const wrap = document.createElement('div');
    wrap.className = 'os-header';

    const img = document.createElement('img');
    img.src = iconData.icon;
    img.alt = iconData.name;
    img.className = 'os-header-icon';

    if (linkUrl) {
        const link = document.createElement('a');
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'source-icon-link';
        link.title = `${iconData.name} top chart`;
        link.appendChild(img);
        wrap.appendChild(link);
    } else {
        wrap.appendChild(img);
    }

    const label = document.createElement('span');
    label.textContent = iconData.name;
    wrap.appendChild(label);

    cell.appendChild(wrap);
    return cell;
}

function buildStoreListCell(items, store) {
    const cell = document.createElement('td');
    const list = document.createElement('ol');
    list.className = 'os-list';

    if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'stat-muted';
        empty.textContent = 'No data currently available';
        cell.appendChild(empty);
        return cell;
    }

    items.forEach((item) => {
        const li = document.createElement('li');
        const row = document.createElement('div');
        row.className = 'os-app-row';
        const icon = document.createElement('img');
        const fallbackIcon = store === 'ios'
            ? (storeIconMap.ios && storeIconMap.ios.icon) || ''
            : (storeIconMap.android && storeIconMap.android.icon) || '';
        icon.src = item.iconUrl || fallbackIcon;
        icon.alt = '';
        icon.loading = 'lazy';
        icon.referrerPolicy = 'no-referrer';
        icon.className = 'os-app-icon';
        icon.onerror = () => {
            icon.onerror = null;
            icon.src = fallbackIcon;
        };
        row.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = item.label;
        row.appendChild(text);
        li.appendChild(row);
        list.appendChild(li);
    });

    cell.appendChild(list);
    return cell;
}

function buildStoreListPanel(items, store) {
    const wrap = document.createElement('div');
    const list = document.createElement('ol');
    list.className = 'os-list';
    if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'stat-muted';
        empty.textContent = 'No data currently available';
        wrap.appendChild(empty);
        return wrap;
    }
    items.forEach((item) => {
        const li = document.createElement('li');
        const row = document.createElement('div');
        row.className = 'os-app-row';
        const icon = document.createElement('img');
        const fallbackIcon = store === 'ios'
            ? (storeIconMap.ios && storeIconMap.ios.icon) || ''
            : (storeIconMap.android && storeIconMap.android.icon) || '';
        icon.src = item.iconUrl || fallbackIcon;
        icon.alt = '';
        icon.loading = 'lazy';
        icon.referrerPolicy = 'no-referrer';
        icon.className = 'os-app-icon';
        icon.onerror = () => {
            icon.onerror = null;
            icon.src = fallbackIcon;
        };
        row.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = item.label;
        row.appendChild(text);
        li.appendChild(row);
        list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
}

function renderTechStatsLoading(configs) {
    const grid = document.getElementById('tech-stats-grid');
    grid.innerHTML = '';
    const loadingCards = [
        'Most common messaging apps',
        'Most common email apps',
        'Most common phones and laptops',
        'Most common browsers',
        'Most common OS',
        'Most common first hop'
    ];
    loadingCards.forEach((titleText, idx) => {
        const card = document.createElement('section');
        card.className = idx === 0 ? 'stat-card stat-span-2' : 'stat-card';
        const title = document.createElement('h3');
        title.textContent = titleText;
        const loading = document.createElement('p');
        loading.className = 'loading-row';
        loading.textContent = 'Loading...';
        card.appendChild(title);
        card.appendChild(loading);
        grid.appendChild(card);
    });
}

function setTechStatsProgress(done, total, finalMessage) {
    const el = document.getElementById('tech-stats-status');
    if (!el) return;
    if (finalMessage) {
        el.textContent = finalMessage;
        return;
    }
    el.textContent = `Loading technical planning data (${done}/${total})...`;
}

// Fetch top 150 domains
function fetchTopDomains(countryCode, countryName) {
    getTopDomainsForCountry(countryCode)
        .then((domains) => {
            renderTopDomainsTable(domains, countryName);
        })
        .catch((error) => {
            console.error('Error fetching top domains:', error);
        });
}

// Render the table of top domains with wrapping at 50 rows
function renderTopDomainsTable(domains, countryName) {
    const table = document.getElementById('domains-table');
    table.innerHTML = ''; // Clear previous rows

    // Find and update the existing title if it exists, or create a new one
    let titleElement = document.querySelector('.domains-title');
    if (!titleElement) {
        titleElement = document.createElement('h3');
        titleElement.classList.add('domains-title'); // Add a class for easier reference
        table.insertAdjacentElement('beforebegin', titleElement); // Insert title above the table
    }
    titleElement.textContent = `Top 100 Domains for ${countryName}`;

    // Split the domains into two columns
    const firstColumnDomains = domains.slice(0, 50);
    const secondColumnDomains = domains.slice(50);

    // Add header row
    const headerRow = document.createElement('tr');
    const rankHeader1 = document.createElement('th');
    rankHeader1.textContent = 'Rank';
    const domainHeader1 = document.createElement('th');
    domainHeader1.textContent = 'Domain';
    const rankHeader2 = document.createElement('th');
    rankHeader2.textContent = 'Rank';
    const domainHeader2 = document.createElement('th');
    domainHeader2.textContent = 'Domain';

    headerRow.appendChild(rankHeader1);
    headerRow.appendChild(domainHeader1);
    headerRow.appendChild(rankHeader2);
    headerRow.appendChild(domainHeader2);
    table.appendChild(headerRow);

    // Find the maximum rows (50 in this case)
    const maxRows = Math.max(firstColumnDomains.length, secondColumnDomains.length);

    // Add rows with two columns
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('tr');

        // First column
        const rankCell1 = document.createElement('td');
        const domainCell1 = document.createElement('td');
        if (firstColumnDomains[i]) {
            rankCell1.textContent = firstColumnDomains[i].rank;
            domainCell1.textContent = firstColumnDomains[i].domain;
        }
        row.appendChild(rankCell1);
        row.appendChild(domainCell1);

        // Second column
        const rankCell2 = document.createElement('td');
        const domainCell2 = document.createElement('td');
        if (secondColumnDomains[i]) {
            rankCell2.textContent = secondColumnDomains[i].rank;
            domainCell2.textContent = secondColumnDomains[i].domain;
        }
        row.appendChild(rankCell2);
        row.appendChild(domainCell2);

        table.appendChild(row);
    }
}


// Add timeframe buttons
function addTimeframeButtons() {
    const timeframeButtons = [
        { text: '2 weeks', value: '14d' },
        { text: '4 weeks', value: '28d' },
        { text: '3 months', value: '12w' },
        { text: '6 months', value: '24w' },
        { text: '12 months', value: '52w' }
    ];

    const buttonContainer = document.getElementById('timeframe-buttons');
    buttonContainer.innerHTML = ''; // Clear existing buttons

    timeframeButtons.forEach(button => {
        const btn = document.createElement('button');
        btn.classList.add('timeframe-button');

        // Create and append the span element
        const span = document.createElement('span');
        span.classList.add('text');
        span.textContent = button.text;
        btn.appendChild(span);

        btn.addEventListener('click', () => {
            currentDateRange = button.value;
            updateActiveButton();
            if (selectedCountryCode) {
                updateRadarEmbeds(selectedCountryCode);
                fetchAndRenderTechStats(selectedCountryCode, selectedCountryName || selectedCountryCode);
                fetchTopDomains(selectedCountryCode, selectedCountryName || selectedCountryCode);
            }
        });

        buttonContainer.appendChild(btn);
    });

    updateActiveButton();
}


function updateActiveButton() {
    const buttons = document.querySelectorAll('.timeframe-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent === getLabelForDateRange(currentDateRange)) {
            button.classList.add('active');
        }
    });
}

function getLabelForDateRange(dateRange) {
    const mapping = {
        '14d': '2 weeks',
        '28d': '4 weeks',
        '12w': '3 months',
        '24w': '6 months',
        '52w': '12 months'
    };
    return mapping[dateRange] || '';
}

addTimeframeButtons();
