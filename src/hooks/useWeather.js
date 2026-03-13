import { useState, useEffect } from 'react';

export default function useWeather(lat, lng) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,uv_index&timezone=Asia%2FSingapore`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            uv: data.current.uv_index,
            code: data.current.weather_code,
          });
        }
      })
      .catch(console.error);
  }, [lat, lng]);

  return weather;
}
