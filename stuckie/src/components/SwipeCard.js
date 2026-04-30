'use client';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function SwipeCard({ asset, onSwipeLeft, onSwipeRight }) {
  const [dragX, setDragX] = useState(0);
  const constraintsRef = useRef(null);

  const isUp = asset.change >= 0;

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 120;
    if (info.offset.x < -swipeThreshold) {
      onSwipeLeft?.();
    } else if (info.offset.x > swipeThreshold) {
      onSwipeRight?.();
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      drag="x"
      dragElastic={0.2}
      dragConstraints={{ left: -300, right: 300 }}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      animate={{ x: 0 }}
      exit={{ x: dragX > 0 ? 500 : -500, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        rotate: dragX * 0.1,
      }}
      className="relative w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing"
    >
      <div className="bg-black border-2 border-amber-400/60 rounded-lg p-8 shadow-lg shadow-amber-400/20 min-h-[500px] flex flex-col justify-between font-mono">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs border border-amber-400 text-amber-400 px-3 py-1 rounded-full font-bold tracking-widest">
            {asset.type}
          </span>
          <span className={`text-xs font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(asset.change * 100).toFixed(2)}%
          </span>
        </div>

        {/* Asset Name & Price */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-2">{asset.id}</h2>
          <p className="text-sm text-zinc-400 mb-4">{asset.name}</p>
          <div className="text-4xl font-bold text-green-400">
            Rp{asset.price.toLocaleString('id')}
          </div>
        </div>

        {/* Asset Details Grid */}
        <div className="space-y-4 mb-8 bg-amber-400/5 border border-amber-400/20 rounded p-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">DESCRIPTION</p>
            <p className="text-sm text-amber-100">{asset.description}</p>
          </div>

          {asset.trend && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">TREND</p>
              <p className="text-sm text-cyan-400">{asset.trend}</p>
            </div>
          )}

          {asset.risk && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">RISK LEVEL</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded ${
                      i < (asset.risk || 0)
                        ? 'bg-red-400'
                        : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {asset.sentiment && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">SENTIMENT</p>
              <p className={`text-sm font-bold ${
                asset.sentiment === 'bullish' ? 'text-green-400' :
                asset.sentiment === 'bearish' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {asset.sentiment.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-amber-400/20 my-4" />

        {/* Action Hints */}
        <div className="flex items-center justify-between text-xs text-zinc-600 font-bold tracking-widest">
          <span className="text-amber-600">← SKIP</span>
          <span className="text-green-600">INVESTIGATE →</span>
        </div>
      </div>

      {/* Drag Indicator */}
      {dragX > 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 text-4xl text-green-400 font-bold"
        >
          ✓
        </motion.div>
      )}
      {dragX < -20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute -left-4 top-1/2 -translate-y-1/2 text-4xl text-red-400 font-bold"
        >
          ✗
        </motion.div>
      )}
    </motion.div>
  );
}
