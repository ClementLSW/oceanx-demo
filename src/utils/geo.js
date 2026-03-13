const R = 6371e3; // Earth radius in meters
const toRad = (d) => (d * Math.PI) / 180;

export function haversine(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function bearing(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function findNearest(userLat, userLng, sites) {
  let nearest = null;
  let minDist = Infinity;
  for (const site of sites) {
    const d = haversine(userLat, userLng, site.lat, site.lng);
    if (d < minDist) { minDist = d; nearest = site; }
  }
  return { site: nearest, distance: minDist };
}

export function interpolateAlongRoute(progress, polyline) {
  const totalSegments = polyline.length - 1;
  const idx = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
  const segProgress = (progress * totalSegments) - idx;
  const [lat1, lng1] = polyline[idx];
  const [lat2, lng2] = polyline[idx + 1] || polyline[idx];
  return {
    lat: lat1 + (lat2 - lat1) * segProgress,
    lng: lng1 + (lng2 - lng1) * segProgress,
  };
}
