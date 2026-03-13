import { useState, useEffect, useCallback } from 'react';
import ROUTE_ZONES from '../data/zones';

export default function useVideoSync(videoRef) {
  const [currentZone, setCurrentZone] = useState(null);
  const [progress, setProgress] = useState(0);
  const [zoneIndex, setZoneIndex] = useState(0);

  const totalDuration = ROUTE_ZONES[ROUTE_ZONES.length - 1].timeEnd;

  useEffect(() => {
    const interval = setInterval(() => {
      const t = videoRef.current?.currentTime || 0;
      setProgress(Math.min(t / totalDuration, 1));

      const idx = ROUTE_ZONES.findIndex((z) => t >= z.timeStart && t < z.timeEnd);
      if (idx !== -1 && ROUTE_ZONES[idx].id !== currentZone?.id) {
        setCurrentZone(ROUTE_ZONES[idx]);
        setZoneIndex(idx);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [videoRef, currentZone, totalDuration]);

  return { currentZone, zoneIndex, progress, totalZones: ROUTE_ZONES.length, totalDuration };
}
