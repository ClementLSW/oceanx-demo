import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Users, Share2, ArrowLeft, Check, MapPin, Leaf, Fish, Zap } from 'lucide-react';
import useGeolocation from '../hooks/useGeolocation';

function StatBadge({ icon: Icon, label, value }) {
  return (
    <div className="glass p-3 flex flex-col items-center text-center gap-1">
      <Icon className="w-5 h-5 text-teal" />
      <span className="text-lg font-display">{value}</span>
      <span className="text-[10px] text-white/50 leading-tight">{label}</span>
    </div>
  );
}

export default function ActScreen({ site, onBack }) {
  const { position } = useGeolocation();
  const [sightingLogged, setSightingLogged] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
    // Stop camera
    video.srcObject?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const submitSighting = () => {
    // Mock submission
    setSightingLogged(true);
  };

  const shareBadge = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'SeaGrass Explorer',
        text: `I just explored ${site?.name || 'a seagrass meadow'} in Singapore and logged a citizen science sighting! 🌊🌿`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full w-full bg-navy overflow-y-auto"
    >
      {/* Camera overlay */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-6 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="safe-top safe-bottom px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="glass-dark p-2 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl">Your Impact</h1>
            <p className="text-white/50 text-xs">{site?.name || 'Seagrass Explorer'}</p>
          </div>
        </div>

        {/* Impact stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatBadge icon={Leaf} label="Species at site" value={site?.speciesCount || 8} />
          <StatBadge icon={Zap} label="Carbon rate" value="35×" />
          <StatBadge icon={Fish} label="Fish per hectare" value="80K" />
        </div>

        {/* Sighting logged success */}
        <AnimatePresence>
          {sightingLogged && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass p-4 border-teal/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Sighting #7,042 logged!</p>
                  <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {position ? `${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E` : 'Location attached'}
                  </p>
                </div>
              </div>
              {photo && (
                <img src={photo} alt="Sighting" className="w-full h-32 object-cover rounded-xl mt-3" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action cards */}
        {!sightingLogged && (
          <div className="space-y-3">
            {/* Log sighting */}
            <button
              onClick={photo ? submitSighting : openCamera}
              className="w-full glass p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6 text-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{photo ? 'Submit Sighting' : 'Log a Sighting'}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  {photo ? 'Photo captured — tap to submit to SeagrassSpotter' : 'Photo + geotag → global seagrass map'}
                </p>
              </div>
              {photo && <Check className="w-5 h-5 text-teal shrink-0" />}
            </button>

            {/* Photo preview */}
            {photo && (
              <img src={photo} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
            )}
          </div>
        )}

        {/* Donate */}
        <button className="w-full glass p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-coral" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Support Restoration</p>
            <p className="text-white/50 text-xs mt-0.5">S$5 funds 1m² of seagrass restoration via NParks</p>
          </div>
        </button>

        {/* Volunteer */}
        <button className="w-full glass p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-xl bg-sea-300/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-sea-300" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Join TeamSeagrass</p>
            <p className="text-white/50 text-xs mt-0.5">Next monitoring: Chek Jawa, 22 Mar 2026</p>
          </div>
        </button>

        {/* Share badge */}
        <button
          onClick={shareBadge}
          className="w-full bg-teal/10 border border-teal/20 text-teal font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
        >
          <Share2 className="w-4 h-4" /> Share Seagrass Explorer Badge
        </button>

        {/* Attribution */}
        <p className="text-center text-white/20 text-[10px] pb-4">
          Data: OceanX • NParks • SeagrassSpotter • TeamSeagrass
        </p>
      </div>
    </motion.div>
  );
}
