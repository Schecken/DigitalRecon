mapboxgl.accessToken = 'MAPBOX_API_KEY';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [133.7751, -25.2744], // Centered on Australia
    zoom: 3
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// GeoJSON source (local file)
const geojsonUrl = 'countries.geo.json';

// Country code conversion function
var countryNameToAlpha2Mapping  = {"Afghanistan": "AF", "Åland Islands": "AX", "Albania": "AL", "Algeria": "DZ", "American Samoa": "AS", "Andorra": "AD", "Angola": "AO", "Anguilla": "AI", "Antarctica": "AQ", "Antigua and Barbuda": "AG", "Argentina": "AR", "Armenia": "AM", "Aruba": "AW", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bermuda": "BM", "Bhutan": "BT", "Bolivia": "BO", "Bonaire, Sint Eustatius and Saba": "BQ", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Bouvet Island": "BV", "Brazil": "BR", "British Virgin Islands": "VG", "British Indian Ocean Territory": "IO", "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Cape Verde": "CV", "Cayman Islands": "KY", "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN", "Hong Kong": "HK", "Macau": "MO", "Christmas Island": "CX", "Cocos (Keeling) Islands": "CC", "Colombia": "CO", "Comoros": "KM", "Congo": "CG", "Democratic Republic of the Congo": "CD", "Cook Islands": "CK", "Costa Rica": "CR", "Ivory Coast": "CI", "Croatia": "HR", "Cuba": "CU", "Curaçao": "CW", "Cyprus": "CY", "Czech Republic": "CZ", "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE", "Ethiopia": "ET", "Falkland Islands": "FK", "Faroe Islands": "FO", "Fiji": "FJ", "Finland": "FI", "France": "FR", "French Guiana": "GF", "French Polynesia": "PF", "French Southern and Antarctic Lands": "TF", "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Gibraltar": "GI", "Greece": "GR", "Greenland": "GL", "Grenada": "GD", "Guadeloupe": "GP", "Guam": "GU", "Guatemala": "GT", "Guernsey": "GG", "Guinea": "GN", "Guinea-Bissau": "GW", "Guyana": "GY", "Haiti": "HT", "Heard Island and McDonald Islands": "HM", "Holy See": "VA", "Honduras": "HN", "Hungary": "HU", "Iceland": "IS", "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE", "Isle of Man": "IM", "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jersey": "JE", "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "North Korea": "KP", "South Korea": "KR", "Kuwait": "KW", "Kyrgyzstan": "KG", "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR", "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "North Macedonia": "MK", "Madagascar": "MG", "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Marshall Islands": "MH", "Martinique": "MQ", "Mauritania": "MR", "Mauritius": "MU", "Mayotte": "YT", "Mexico": "MX", "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Montserrat": "MS", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR", "Nepal": "NP", "Netherlands": "NL", "Netherlands Antilles": "AN", "New Caledonia": "NC", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "Niue": "NU", "Norfolk Island": "NF", "Northern Mariana Islands": "MP", "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palau": "PW", "Palestinian Territories": "PS", "Panama": "PA", "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Pitcairn Islands": "PN", "Poland": "PL", "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "Réunion": "RE", "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saint Barthélemy": "BL", "Saint Helena": "SH", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC", "Saint Martin": "MF", "Saint Pierre and Miquelon": "PM", "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM", "São Tomé and Príncipe": "ST", "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", "Sint Maarten": "SX", "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA", "South Georgia and the South Sandwich Islands": "GS", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD", "Suriname": "SR", "Svalbard and Jan Mayen": "SJ", "Swaziland": "SZ", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW", "Tajikistan": "TJ", "United Republic of Tanzania": "TZ", "Thailand": "TH", "Timor-Leste": "TL", "Togo": "TG", "Tokelau": "TK", "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM", "Turks and Caicos Islands": "TC", "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB", "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Vatican City": "VA", "Venezuela": "VE", "Vietnam": "VN", "Wallis and Futuna": "WF", "Western Sahara": "EH", "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW"};

let currentDateRange = '12w'; // Default date range

map.on('load', () => {
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

        updateIframes(countryCode);
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

document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !document.getElementById('map').contains(e.target)) {
        closeSidebar();
    }
});

// Function to update iframe sources
function updateIframes(countryCode) {
    const osIframe = document.getElementById('os-iframe');
    const browsersIframe = document.getElementById('browsers-iframe');

    osIframe.src = `https://radar.cloudflare.com/embed/DataExplorerVisualizer?path=http%2Ftimeseries_groups%2Fos&dateRange=${currentDateRange}&mainLocation=${countryCode}&param_limitPerGroup=10&chartState=%7B%22showAnnotations%22%3Atrue%2C%22xy.hiddenSeries%22%3A%5B%5D%2C%22xy.highlightedSeries%22%3Anull%2C%22xy.previousVisible%22%3Atrue%7D`;
    browsersIframe.src = `https://radar.cloudflare.com/embed/DataExplorerVisualizer?path=http%2Ftop%2Fbrowsers&dateRange=${currentDateRange}&mainLocation=${countryCode}&param_limit=10&chartState=%7B%7D`;
}

// Fetch top 150 domains
function fetchTopDomains(countryCode, countryName) {
    const url = `https://wispy-block-xxxa.xxxxx.workers.dev/client/v4/radar/ranking/top?limit=100&location=${countryCode}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer CLOUDFLARE_API_KEY`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Log the full response for debugging
        console.log(data);

        // Check if result contains the expected object or array
        if (data.result && typeof data.result === 'object') {
            // Access the relevant part of the result object
            const topDomains = data.result.top_0;  // or adjust based on structure

            if (Array.isArray(topDomains)) {
                const domains = topDomains.map(item => ({
                    rank: item.rank,
                    domain: item.domain
                }));
                renderTopDomainsTable(domains, countryName);
            } else {
                console.error('Error: top_0 is not an array', topDomains);
            }
        } else {
            console.error('Error: result is not an object or missing', data.result);
        }
    })
    .catch(error => console.error('Error fetching top domains:', error));
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
            const countryCodeElement = document.getElementById('country-info').textContent.match(/\((.*?)\)/);
            const countryCode = countryCodeElement ? countryCodeElement[1] : null;
            if (countryCode) {
                updateIframes(countryCode);
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
