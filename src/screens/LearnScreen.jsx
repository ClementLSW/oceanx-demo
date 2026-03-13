import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, MapPin, Play, Pause } from 'lucide-react';
import useVideoSync from '../hooks/useVideoSync';
import ROUTE_ZONES, { ROUTE_POLYLINE } from '../data/zones';
import { interpolateAlongRoute } from '../utils/geo';
import Plaque from '../components/XR/Plaque';

export default function LearnScreen({ site, onComplete, onBack }) {
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackTime, setFallbackTime] = useState(0);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef(null);
  const fakeVideoRef = useRef({ currentTime: 0 }); // stable ref for fallback

  // Proactively check if video exists — don't rely on onError
  useEffect(() => {
    fetch('/video/boardwalk-tour.mp4', { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) setFallbackMode(true);
      })
      .catch(() => setFallbackMode(true));

    // Also timeout — if video hasn't loaded in 3s, go fallback
    const timeout = setTimeout(() => {
      if (!videoRef.current?.readyState) setFallbackMode(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Keep fakeVideoRef.currentTime in sync with fallbackTime
  useEffect(() => {
    fakeVideoRef.current.currentTime = fallbackTime;
  }, [fallbackTime]);

  const { currentZone, zoneIndex, progress, totalZones } = useVideoSync(
    fallbackMode ? fakeVideoRef : videoRef
  );

  // Fallback timer — uses refs to survive re-renders
  useEffect(() => {
    if (!fallbackMode || !playing) {
      lastTickRef.current = null;
      return;
    }
    const totalDuration = ROUTE_ZONES[ROUTE_ZONES.length - 1].timeEnd;
    let raf;
    const tick = (ts) => {
      if (lastTickRef.current === null) lastTickRef.current = ts;
      const delta = (ts - lastTickRef.current) / 1000;
      lastTickRef.current = ts;
      elapsedRef.current = Math.min(elapsedRef.current + delta, totalDuration);
      setFallbackTime(elapsedRef.current);
      if (elapsedRef.current < totalDuration) {
        raf = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTickRef.current = null;
    };
  }, [fallbackMode, playing, onComplete]);

  const handleVideoError = () => setFallbackMode(true);

  // Narration audio — plays on zone change, respects mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentZone?.audio) return;

    audio.pause();
    audio.src = currentZone.audio;
    audio.currentTime = 0;

    if (!muted && playing) {
      audio.play().catch(() => {}); // catch autoplay rejection silently
    }

    return () => audio.pause();
  }, [currentZone?.id]); // only trigger on zone change

  // Sync mute state to narration audio
  useEffect(() => {
    const audio = audioRef.current;
    if (muted) {
      audio.pause();
    } else if (playing && currentZone?.audio) {
      audio.play().catch(() => {});
    }
  }, [muted]);

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (fallbackMode) {
      setPlaying((p) => {
        if (p) audioRef.current.pause();
        else if (!muted) audioRef.current.play().catch(() => {});
        return !p;
      });
      return;
    }
    if (videoRef.current?.paused) {
      videoRef.current.play();
      if (!muted) audioRef.current.play().catch(() => {});
      setPlaying(true);
    } else {
      videoRef.current?.pause();
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const startTour = () => {
    if (fallbackMode) {
      setPlaying(true);
      if (!muted && currentZone?.audio) {
        audioRef.current.src = currentZone.audio;
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    videoRef.current?.play();
    setPlaying(true);
  };

  // Mini-map dot position
  const dotPos = interpolateAlongRoute(progress, ROUTE_POLYLINE);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full w-full relative bg-navy overflow-hidden"
    >
      {/* Video background */}
      {!fallbackMode ? (
        <video
          ref={videoRef}
          src="/video/boardwalk-tour.mp4"
          muted={muted}
          playsInline
          onCanPlay={() => setVideoReady(true)}
          onError={handleVideoError}
          onEnded={onComplete}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Fallback — crossfading zone images */
        <div className="absolute inset-0 bg-navy">
          {/* Pre-render all zone images, crossfade via opacity */}
          {ROUTE_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentZone?.id === zone.id ? 1 : 0 }}
            >
              {zone.bgImage && (
                <img
                  src={zone.bgImage}
                  alt={zone.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          ))}

          {/* Gradient overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-navy/80" />
          <div className="absolute inset-0 bg-navy/20" />

          {/* Pre-start prompt */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-8">
                <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-teal" />
                </div>
                <p className="text-white/40 text-sm">Sentosa Coastal Trail</p>
                <p className="text-white/20 text-xs mt-1">Simulated walkthrough</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scanline overlay for tech feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 safe-top">
        <div className="flex items-center justify-between px-4 pt-3">
          <button onClick={onBack} className="glass-dark p-2 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Mini-map */}
          <div className="glass-dark p-2.5 rounded-xl">
            <svg viewBox="0 0 60 60" className="w-20 h-20">
              {/* Route polyline */}
              <polyline
                points={ROUTE_POLYLINE.map(([lat, lng]) => {
                  const x = ((lng - 103.8055) / 0.004) * 50 + 5;
                  const y = ((1.2595 - lat) / 0.004) * 50 + 5;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(14,165,160,0.4)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Active segment highlight */}
              {currentZone && (
                <circle
                  cx={((dotPos.lng - 103.8055) / 0.004) * 50 + 5}
                  cy={((1.2595 - dotPos.lat) / 0.004) * 50 + 5}
                  r="4"
                  fill="#0EA5A0"
                />
              )}
            </svg>
          </div>

          {/* Progress dots + mute */}
          <div className="flex items-center gap-2">
            <div className="glass-dark px-2.5 py-2 rounded-xl flex items-center gap-1">
              {ROUTE_ZONES.map((z, i) => (
                <div
                  key={z.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= zoneIndex ? 'bg-teal w-4' : 'bg-white/15 w-1.5'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setMuted((m) => !m)}
              className="glass-dark p-2 rounded-xl"
            >
              {muted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-teal" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Plaque */}
      <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center">
        <AnimatePresence mode="wait">
          {currentZone && (
            <Plaque
              key={currentZone.id}
              data={currentZone.plaque}
              onAction={onComplete}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 safe-bottom px-4 pb-4">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-teal rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Play/pause + zone name */}
        {!playing ? (
          <button
            onClick={startTour}
            className="w-full bg-teal hover:bg-teal-dark text-navy font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" /> Start Tour
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button onClick={togglePlay} className="glass-dark p-2.5 rounded-xl">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <MapPin className="w-3 h-3 text-teal" />
              {currentZone?.name || 'Starting...'}
            </div>
            <button
              onClick={onComplete}
              className="glass-dark px-3 py-2 rounded-xl text-xs font-medium text-teal"
            >
              Skip →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
