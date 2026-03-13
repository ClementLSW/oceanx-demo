import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function Plaque({ data, onAction }) {
  const [imgError, setImgError] = useState(false);

  if (!data) return null;

  const Icon = Icons[data.icon] || Icons.Info;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="glass p-4 mx-4 mb-4 max-w-sm overflow-hidden"
    >
      {/* Inline image */}
      {data.image && !imgError && (
        <div className="relative -mx-4 -mt-4 mb-3 h-32 overflow-hidden">
          <img
            src={`${data.image}.jpg`}
            alt={data.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.target.src.endsWith('.jpg')) {
                e.target.src = `${data.image}.webp`;
              } else {
                setImgError(true);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-teal/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-teal" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base leading-snug">{data.title}</h3>
          <p className="text-teal text-xs font-medium">{data.subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-white/70 text-sm leading-relaxed">{data.body}</p>

      {/* Stat badge */}
      {data.stat && (
        <div className="mt-3 inline-flex items-center gap-1.5 bg-teal/10 text-teal text-xs font-semibold px-3 py-1.5 rounded-full">
          {data.animatedCounter ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.stat}
            </motion.span>
          ) : (
            data.stat
          )}
        </div>
      )}

      {/* CTA button */}
      {data.cta && (
        <button
          onClick={onAction}
          className="mt-3 w-full bg-coral hover:bg-coral/80 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          Take Action →
        </button>
      )}
    </motion.div>
  );
}
