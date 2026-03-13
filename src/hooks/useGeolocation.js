import { useState, useEffect } from 'react';

const FALLBACK = { lat: 1.2515, lng: 103.843 }; // Keppel Bay

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(FALLBACK);
      setError('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        console.warn('GPS error, using fallback:', err.message);
        setPosition(FALLBACK);
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    // Set fallback after timeout in case permission dialog is slow
    const timeout = setTimeout(() => {
      setPosition((prev) => prev || FALLBACK);
    }, 3000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeout);
    };
  }, []);

  return { position, error, isReal: !error };
}
