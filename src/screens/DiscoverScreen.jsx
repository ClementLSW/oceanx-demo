import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Waves, Clock, ChevronRight, Thermometer } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import useGeolocation from '../hooks/useGeolocation';
import useWeather from '../hooks/useWeather';
import useTide from '../hooks/useTide';
import SITES from '../data/sites';
import { haversine, formatDistance, findNearest } from '../utils/geo';

// Custom marker icons
const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(59,130,246,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const seagrassIcon = (isNearest) =>
  L.divIcon({
    className: isNearest ? 'pulse-marker' : '',
    html: `<div style="width:${isNearest ? 14 : 10}px;height:${isNearest ? 14 : 10}px;background:#0EA5A0;border:2px solid white;border-radius:50%;position:relative;"></div>`,
    iconSize: [isNearest ? 14 : 10, isNearest ? 14 : 10],
    iconAnchor: [isNearest ? 7 : 5, isNearest ? 7 : 5],
  });

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => { if (lat && lng) map.setView([lat, lng], 12); }, [lat, lng, map]);
  return null;
}

export default function DiscoverScreen({ onStartTour }) {
  const { position } = useGeolocation();
  const weather = useWeather(position?.lat, position?.lng);
  const tide = useTide();
  const [selectedSite, setSelectedSite] = useState(null);

  const nearest = useMemo(() => {
    if (!position) return null;
    return findNearest(position.lat, position.lng, SITES);
  }, [position]);

  const sitesWithDistance = useMemo(() => {
    if (!position) return SITES;
    return SITES.map((s) => ({
      ...s,
      distance: haversine(position.lat, position.lng, s.lat, s.lng),
    })).sort((a, b) => a.distance - b.distance);
  }, [position]);

  const activeSite = selectedSite || nearest?.site;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full w-full relative"
    >
      {/* Voyager Banner */}
      <div className="absolute top-0 left-0 right-0 z-[1000] safe-top">
        <div className="mx-3 mt-3 glass-dark px-4 py-2.5 flex items-center gap-3">
          <Waves className="w-4 h-4 text-teal shrink-0" />
          <p className="text-xs text-white/80 flex-1">
            {nearest
              ? `Seagrass meadow ${formatDistance(nearest.distance)} away`
              : 'Detecting your location...'}
          </p>
          {weather && (
            <span className="text-xs text-white/50 flex items-center gap-1">
              <Thermometer className="w-3 h-3" /> {weather.temp}°C
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      {position && (
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={12}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <RecenterMap lat={position.lat} lng={position.lng} />

          {/* User position */}
          <Marker position={[position.lat, position.lng]} icon={userIcon} />
          <Circle
            center={[position.lat, position.lng]}
            radius={1000}
            pathOptions={{ color: '#0EA5A0', fillColor: '#0EA5A0', fillOpacity: 0.05, weight: 1 }}
          />

          {/* Seagrass POIs */}
          {sitesWithDistance.map((site) => (
            <Marker
              key={site.id}
              position={[site.lat, site.lng]}
              icon={seagrassIcon(site.id === nearest?.site?.id)}
              eventHandlers={{ click: () => setSelectedSite(site) }}
            >
              <Popup className="glass">
                <strong className="text-navy">{site.name}</strong><br />
                <span className="text-navy/70 text-xs">{site.speciesCount} species • {formatDistance(site.distance)}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* Loading state */}
      {!position && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Waves className="w-8 h-8 text-teal mx-auto mb-3 animate-pulse" />
            <p className="text-white/60 text-sm">Detecting your location...</p>
          </div>
        </div>
      )}

      {/* Bottom Sheet — Proximity Card */}
      {activeSite && (
        <motion.div
          initial={{ y: 200 }} animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 z-[1000] p-3 safe-bottom"
        >
          <div className="glass p-4 space-y-3">
            {/* Site header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg leading-tight">{activeSite.name}</h2>
                <p className="text-white/60 text-xs mt-0.5">{activeSite.subtitle}</p>
              </div>
              <span className="bg-teal/20 text-teal text-xs font-semibold px-2 py-1 rounded-full">
                {activeSite.speciesCount} species
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-white/70">
                <Navigation className="w-3.5 h-3.5 text-teal" />
                {activeSite.distance
                  ? formatDistance(activeSite.distance)
                  : formatDistance(nearest?.distance || 0)}
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Clock className="w-3.5 h-3.5 text-teal" />
                {activeSite.tideDependent && tide
                  ? tide.statusStr
                  : activeSite.tideDependent
                    ? 'Low-tide access only'
                    : 'All-tide access'}
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <MapPin className="w-3.5 h-3.5 text-teal" />
                {activeSite.access}
              </div>
            </div>

            {/* Highlight */}
            {activeSite.highlight && (
              <p className="text-white/50 text-xs italic">{activeSite.highlight}</p>
            )}

            {/* Tide viewing window */}
            {activeSite.tideDependent && tide?.bestWindow && (
              <div className={`px-3 py-2 rounded-xl text-xs ${
                tide.status === 'optimal'
                  ? 'bg-teal/15 border border-teal/30'
                  : tide.status === 'visible'
                    ? 'bg-teal/10 border border-teal/20'
                    : 'bg-white/5 border border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={tide.status === 'optimal' ? 'text-teal font-semibold' : 'text-white/70'}>
                    {tide.status === 'optimal'
                      ? '● Seagrass visible now'
                      : tide.status === 'visible'
                        ? '◐ Partially visible'
                        : `Best window: ${tide.bestWindow.label}`}
                  </span>
                  <span className="text-white/40">
                    {tide.bestWindow.windowStart}–{tide.bestWindow.windowEnd}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-white/40">
                  <span>Low: {tide.bestWindow.lowHeight}m CD • {tide.bestWindow.windowDuration} min window</span>
                  <span className="text-white/30">{tide.direction === 'falling' ? '↓' : '↑'} {tide.currentHeightStr}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => onStartTour(activeSite)}
              className="w-full bg-teal hover:bg-teal-dark text-navy font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Start XR Tour <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
