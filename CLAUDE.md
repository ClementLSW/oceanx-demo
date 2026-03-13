# SeaGrass Guide — OceanX Hackathon Demo

## What This Is
A mobile-first PWA that guides travellers to seagrass meadows using real GPS, educates them with an XR video tour overlaid with geo-triggered educational plaques, and converts them into citizen scientists. Built for the OceanX Hackathon Track 2: "Traveller Activation from Curiosity to Conservation."

## Demo Context
- Presenting from the OceanXplorer ship berthed at Marina at Keppel Bay, Singapore (~1.2515°N, 103.8430°E)
- Nearest seagrass: Sentosa Fort Siloso shore (~800m south), Labrador Nature Reserve (~1.2km NE)
- GPS detection is REAL. Distance calculations are REAL. Tide data is REAL.
- The XR tour is a SIMULATED walkthrough video with geo-triggered plaques.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Leaflet + OpenStreetMap (zero API key) OR Mapbox GL JS (free tier, 50k loads/mo)
- Browser Geolocation API (real GPS)
- getUserMedia (real rear camera for Act screen photo capture)
- Framer Motion for plaque animations
- Deploy to Vercel (HTTPS required for camera/GPS)

---

## Free APIs to Integrate

### Tier 1: Zero-key, use immediately

**Open-Meteo Weather** (no key, no signup)
Current weather for the Discover screen — temperature, rain, UV index.
```
https://api.open-meteo.com/v1/forecast?latitude=1.2515&longitude=103.843&current=temperature_2m,relative_humidity_2m,rain,weather_code,uv_index&timezone=Asia%2FSingapore
```

**Open-Meteo Marine** (no key, no signup)
Wave height, sea surface temperature, swell — show coastal conditions.
```
https://marine-api.open-meteo.com/v1/marine?latitude=1.2515&longitude=103.843&current=wave_height,sea_surface_temperature&timezone=Asia%2FSingapore
```

**NParks Tide Data (Static)**
NParks publishes the official 2026 Tanjong Changi hourly tide table. Extract March 2026 data into a static JSON file. This is the same data used for Chek Jawa visit planning. Source: https://pulau-ubin.nparks.gov.sg/files/Tanjong%20Changi%20tide%20table%202026/
For March 12, 2026 Singapore: High tide 3:43am, low tide 10:57am, high tide 6:02pm, low tide 9:54pm.

**Leaflet + OpenStreetMap** (no key)
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

**Singapore Data.gov.sg Weather** (no key)
Hyper-local 2-hour weather forecast by area in Singapore.
```
https://api.data.gov.sg/v1/environment/2-hour-weather-forecast
```

**iNaturalist Observations** (no key)
Real citizen science seagrass sightings near each POI. Show "X observations logged near this site" on map cards.
```
https://api.inaturalist.org/v1/observations?taxon_name=Seagrass&lat=1.4092&lng=103.9928&radius=5&per_page=10
```

**GBIF Species Occurrences** (no key)
Species occurrence records for Singapore seagrass species. Enriches species ID cards.
```
https://api.gbif.org/v1/occurrence/search?scientificName=Enhalus%20acoroides&country=SG&limit=10
```

### Tier 2: Free tier, requires quick signup

**Stormglass.io Tide API** (free signup, 10 req/day)
Real-time tide levels and high/low extremes. Auto-selects nearest Singapore tide station.
```
GET https://api.stormglass.io/v2/tide/extremes/point?lat=1.2515&lng=103.843&start=2026-03-12&end=2026-03-13
Header: Authorization: YOUR_API_KEY
```

**WorldTides.info** (free signup, 100 credits)
7-day tide prediction for 1 credit. Returns JSON with high/low times and optional embeddable chart.
```
https://www.worldtides.info/api/v3?extremes&lat=1.2515&lon=103.843&key=YOUR_KEY
```

### API Usage Strategy
- Use Open-Meteo (weather + marine) on every page load — it's free and instant
- Use NParks static tide data as primary tide source (reliable, no API dependency)
- Use Stormglass OR WorldTides as enrichment if you have time to sign up
- Use iNaturalist to show observation counts on map POI cards
- Use Singapore Data.gov.sg for the local weather forecast text
- Cache all API responses in React state — no need for repeated calls during the demo

---

## Three Screens

### Screen 1: DISCOVER (Map + Proximity)
- Full-screen map centered on user's real GPS position
- Custom seagrass POI markers (green, pulsing for nearest)
- Real weather data from Open-Meteo displayed on map (temp, conditions)
- Bottom sheet with proximity card: site name, real distance (haversine), species count, REAL tide window from NParks data, access info
- iNaturalist observation count badge on each POI ("42 sightings logged here")
- Voyager-styled notification banner at top
- Tap POI → detail card. Tap "Start XR Tour" → Screen 2.

### Screen 2: LEARN (Video Walkthrough + Geo-Triggered Plaques)

THIS IS THE CORE EXPERIENCE.

**Concept:** A pre-recorded first-person video plays showing someone walking along the Chek Jawa boardwalk (1.1km, Coastal Loop + Mangrove Loop) beside the seagrass lagoon. A mini-map in the corner shows a dot moving along the prescribed route in sync with the video. As the dot enters each geo-zone, a new educational plaque animates in as an overlay on the video. The user watches the tour unfold like a guided experience — plaques appear and disappear automatically, timed to the video. This simulates what would happen in real life with actual GPS geo-fences.

**Layout:**
```
┌─────────────────────────────────┐
│  [Mini-map]          [Zone 3/7] │  ← Top bar: mini route map + progress
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   VIDEO BACKGROUND      │    │
│  │   (boardwalk walkthrough)│    │
│  │                         │    │
│  │  ┌───────────────────┐  │    │
│  │  │ FLOATING PLAQUE   │  │    │  ← Frosted glass card, auto-triggered
│  │  │ "Tape Seagrass"   │  │    │
│  │  │ Enhalus acoroides │  │    │
│  │  │ Leaves up to 1.5m │  │    │
│  │  └───────────────────┘  │    │
│  └─────────────────────────┘    │
│  ━━━━━━━━━●━━━━━━━━━━━━━━━━━━━  │  ← Scrubber / progress bar
│  [Pause]              [Skip →]  │
└─────────────────────────────────┘
```

**Route Zones (time-synced to video):**

```js
const ROUTE_ZONES = [
  {
    id: "welcome",
    name: "House No. 1 — Visitor Centre",
    timeStart: 0,
    timeEnd: 15,
    lat: 1.4092, lng: 103.9928,
    plaque: {
      title: "Welcome to Chek Jawa",
      subtitle: "Singapore's Seagrass Jewel",
      body: "You're entering one of Singapore's richest ecosystems. Six habitats meet here — and 8 species of seagrass thrive in the lagoon ahead.",
      icon: "compass"
    }
  },
  {
    id: "mangrove-transition",
    name: "Mangrove Boardwalk",
    timeStart: 15, timeEnd: 30,
    lat: 1.4088, lng: 103.9932,
    plaque: {
      title: "The Connected Ecosystem",
      subtitle: "Mangroves → Seagrass → Coral",
      body: "Mangroves, seagrass, and coral reefs work as a connected system. Seagrass traps sediment, keeping water clear for coral. Mangroves shelter juvenile fish that later migrate to seagrass meadows.",
      icon: "network"
    }
  },
  {
    id: "seagrass-lagoon",
    name: "Seagrass Lagoon Viewpoint",
    timeStart: 30, timeEnd: 50,
    lat: 1.4085, lng: 103.9935,
    plaque: {
      title: "Tape Seagrass",
      subtitle: "Enhalus acoroides",
      body: "The longest seagrass in Singapore — leaves can reach 1.5 meters. Its large white female flowers are pollinated on the water surface by tiny floating male flowers that look like styrofoam.",
      icon: "leaf",
      stat: "8 species found at this site",
      image: "enhalus-acoroides"
    }
  },
  {
    id: "blue-carbon",
    name: "Intertidal Meadow",
    timeStart: 50, timeEnd: 70,
    lat: 1.4082, lng: 103.9938,
    plaque: {
      title: "Blue Carbon Powerhouse",
      subtitle: "The invisible superpower beneath your feet",
      body: "Seagrass captures carbon 35× faster than tropical rainforests. This meadow quietly stores CO₂ in its roots and sediment — carbon that stays locked away for thousands of years.",
      icon: "zap",
      stat: "220g carbon / m² / year",
      animatedCounter: true
    }
  },
  {
    id: "biodiversity",
    name: "Coral Rubble & Sandy Shore",
    timeStart: 70, timeEnd: 90,
    lat: 1.4078, lng: 103.9940,
    plaque: {
      title: "An Underwater City",
      subtitle: "What hides beneath the surface",
      body: "A single hectare of seagrass supports 80,000 fish and 100 million invertebrates. Dugong feeding trails have been spotted here — these gentle giants graze on seagrass like underwater lawn mowers.",
      icon: "fish",
      stat: "80,000 fish per hectare"
    }
  },
  {
    id: "threats",
    name: "Coastal Viewpoint",
    timeStart: 90, timeEnd: 110,
    lat: 1.4075, lng: 103.9942,
    plaque: {
      title: "Under Threat",
      subtitle: "29% of global seagrass lost since the 1800s",
      body: "Coastal development, marine litter, and land runoff are the biggest threats here. Singapore has lost vast seagrass areas to reclamation — Chek Jawa itself was nearly reclaimed in 1992 before public outcry saved it.",
      icon: "alert-triangle",
      stat: "Only 24% of seagrass is protected globally"
    }
  },
  {
    id: "action",
    name: "Return to House No. 1",
    timeStart: 110, timeEnd: 130,
    lat: 1.4092, lng: 103.9928,
    plaque: {
      title: "Your Turn",
      subtitle: "From curiosity to conservation",
      body: "You've just walked through one of Earth's most vital ecosystems. Now you can make a difference.",
      icon: "heart-handshake",
      cta: true
    }
  }
];
```

**Video-to-zone sync logic:**
```js
useEffect(() => {
  const interval = setInterval(() => {
    const t = videoRef.current?.currentTime || 0;
    const zone = ROUTE_ZONES.find(z => t >= z.timeStart && t < z.timeEnd);
    if (zone && zone.id !== currentZone?.id) {
      setCurrentZone(zone);
    }
  }, 250);
  return () => clearInterval(interval);
}, [currentZone]);
```

**Mini-map:** Small Leaflet map (150x150px) in top-left corner with a polyline of the Chek Jawa Coastal Loop route. A dot interpolates along the polyline based on video progress (currentTime / totalDuration).

**Video source:** Place at `public/video/boardwalk-tour.mp4`. If no video available, fall back to a gradient background with timer-based plaque sequencing so the demo still works.

**Video autoplay:** Must autoplay muted (browser policy). Show unmute button. Use `playsInline` for iOS.

### Screen 3: ACT (Citizen Science + Conservation)
- Impact summary (what you learned, stats from the tour)
- Log Sighting: camera capture (getUserMedia) + auto-geotag from real GPS → mock SeagrassSpotter submission with animated confirmation ("Sighting #7,042 added!")
- Donate: mock Alipay+ payment screen ("S$5 funds 1m² of restoration")
- Volunteer: TeamSeagrass next session card ("Next monitoring: Chek Jawa, 22 Mar")
- Share: "Seagrass Explorer" badge via Web Share API

---

## Key Utilities

```
src/hooks/
  useGeolocation.js     — watchPosition, enableHighAccuracy, fallback coords
  useCamera.js          — getUserMedia for rear camera (Act screen photo)
  useVideoSync.js       — watches video currentTime, returns active zone + plaque
  useWeather.js         — fetches Open-Meteo current weather for user location
  useTides.js           — looks up NParks static tide data for today, or calls Stormglass

src/utils/
  geo.js                — haversine distance, bearing calculation, interpolateAlongRoute
  tideData.js           — static March 2026 NParks Tanjong Changi tide heights
```

## POI Data (Static JSON)

```json
[
  { "id": "sentosa-siloso", "name": "Sentosa Seagrass Meadow", "subtitle": "Hidden beneath Fort Siloso", "lat": 1.2580, "lng": 103.8097, "speciesCount": 2, "species": ["Enhalus acoroides", "Halophila ovalis"], "access": "Walk from Resorts World (10 min)", "tideDependent": true, "highlight": "5M tourists/year walk past without knowing" },
  { "id": "labrador", "name": "Labrador Nature Reserve", "subtitle": "Last mainland seagrass", "lat": 1.2650, "lng": 103.8025, "speciesCount": 3, "species": ["Thalassia hemprichii", "Halophila ovalis", "Enhalus acoroides"], "access": "Walk from Labrador MRT (15 min)", "tideDependent": true, "highlight": "The only seagrass meadow left on mainland Singapore" },
  { "id": "chek-jawa", "name": "Chek Jawa Wetlands", "subtitle": "Singapore's seagrass jewel", "lat": 1.4092, "lng": 103.9928, "speciesCount": 8, "species": ["Halophila beccarii", "Halophila spinulosa", "Cymodocea rotundata", "Halophila ovalis", "Halophila minor", "Halodule uninervis", "Thalassia hemprichii", "Enhalus acoroides"], "access": "Ferry to Pulau Ubin + boardwalk", "tideDependent": true, "highlight": "8 species — the most biodiverse seagrass site in Singapore" },
  { "id": "sisters-islands", "name": "Sisters' Islands Marine Park", "lat": 1.2128, "lng": 103.8358, "speciesCount": 4, "access": "Ferry + monthly guided tours (30 pax)", "tideDependent": false },
  { "id": "semakau", "name": "Pulau Semakau", "lat": 1.2025, "lng": 103.7467, "speciesCount": 7, "access": "NEA programs only", "tideDependent": true, "highlight": "Largest continuous meadow (2km)" },
  { "id": "cyrene", "name": "Cyrene Reef", "lat": 1.2367, "lng": 103.7567, "speciesCount": 7, "access": "Special access only", "highlight": "Largest meadow (14 ha), 500 ships pass daily" },
  { "id": "kusu", "name": "Kusu Island", "lat": 1.2256, "lng": 103.8583, "speciesCount": 2, "access": "Public ferry" },
  { "id": "st-johns", "name": "St. John's Island", "lat": 1.2175, "lng": 103.8492, "speciesCount": 2, "access": "Public ferry" },
  { "id": "lazarus", "name": "Lazarus Island", "lat": 1.2108, "lng": 103.8525, "speciesCount": 2, "access": "Public ferry (via St. John's)" },
  { "id": "pulau-hantu", "name": "Pulau Hantu", "lat": 1.2267, "lng": 103.7467, "speciesCount": 2, "access": "Dive/boat charter" }
]
```

## Design Direction
- Ocean/conservation theme: deep navy (#0B1D3A), teal (#0EA5A0), coral accent (#FF6B6B), sandy white (#F5F0EB)
- Frosted glass plaque effect: backdrop-filter: blur(16px) + rgba(255,255,255,0.12) bg + 1px white/20% border
- Typography: distinctive display font (not Inter/Arial/Roboto), clean body font
- Mobile-first: portrait orientation
- Video tour should feel cinematic — plaques complement, not clutter
- Plaque transitions: slide up + fade in from bottom (Framer Motion), slide down + fade on exit
- Mini-map: dark-themed, subtle, small (150×150px)

## GPS Fallback
```js
const FALLBACK_POSITION = { lat: 1.2515, lng: 103.8430 }; // Keppel Bay
```

## Critical Notes
- HTTPS mandatory for camera + GPS APIs
- All seagrass data is static JSON (no backend)
- Video autoplay must be muted (browser policy) with unmute button
- Use `playsInline` attribute on video for iOS
- SeagrassSpotter submission is mocked
- Alipay+ payment is mocked
- Must work on both iOS Safari and Android Chrome
- If video fails to load, fall back to timer-based plaque sequence with photo/gradient background

## Deployment

**Target URL:** https://oceanx-demo.clementlsw.com
**Platform:** Netlify
**Build command:** `npm run build`
**Publish directory:** `dist`

A `netlify.toml` is in the project root with SPA redirects configured.

Quick deploy:
```bash
npm run build && netlify deploy --prod --dir=dist
```

DNS: CNAME record `oceanx-demo` → `[netlify-site-name].netlify.app` is configured at the domain registrar for clementlsw.com. Netlify auto-provisions SSL.

HTTPS is mandatory — GPS and camera APIs will not work without it.
