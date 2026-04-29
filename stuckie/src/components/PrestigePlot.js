'use client';
import { useState, useEffect, useRef } from 'react';import { useGameStore, PRESTIGE_TITLES } from '@/store/gameStore';
import LuxuryCollection from './LuxuryCollection';

// NPC dengan walk cycle 4 frame
function SimpleNPC({ startX, speed, width, flip }) {
  const [x, setX] = useState(startX);
  const [frame, setFrame] = useState(0);
  const [dir, setDir] = useState(flip ? -1 : 1);
  const xRef = useRef(startX);
  const dirRef = useRef(flip ? -1 : 1);

  useEffect(() => {
    const move = setInterval(() => {
      xRef.current += dirRef.current * speed;
      if (xRef.current > width + 10) xRef.current = -10;
      else if (xRef.current < -10) xRef.current = width + 10;
      setX(xRef.current);
    }, 50);
    const anim = setInterval(() => setFrame(f => (f + 1) % 4), 150);
    return () => { clearInterval(move); clearInterval(anim); };
  }, [speed, width]);

  return (
    <div className="absolute pointer-events-none" style={{
      left: x, bottom: 22,
      transform: dir > 0 ? 'scaleX(-1)' : 'scaleX(1)',
      imageRendering: 'pixelated', zIndex: 5,
    }}>
      <img
        src={`/sprites/npc/sprite_${frame}.png`}
        alt="npc"
        style={{ imageRendering: 'pixelated', height: 24, width: 'auto', display: 'block' }}
      />
    </div>
  );
}

const TILE_H = 160;

export default function PrestigePlot({ containerW, timeMode }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const plotW = containerW;

  const netWorth = useGameStore(s => {
    const { balance, marketAssets, portfolio } = s;
    const portfolioVal = portfolio.reduce((sum, p) => {
      const a = marketAssets.find(x => x.id === p.assetId);
      return sum + (a ? a.price * p.qty : 0);
    }, 0);
    return balance + portfolioVal;
  });
  const luxuryItems = useGameStore(s => s.luxuryItems);

  const prestige = PRESTIGE_TITLES.filter(p => p.min <= netWorth).at(-1) || PRESTIGE_TITLES[0];
  const prestigeIdx = PRESTIGE_TITLES.indexOf(prestige);

  return (
    <>
      <div className="flex flex-col" style={{ position: 'relative' }}>
        {/* Label bar */}
        <div className="flex items-center justify-between px-2 py-0.5 bg-zinc-900 border-b border-amber-400/30">
          <span className="font-mono text-amber-400 text-xs tracking-widest flex items-center gap-1">
            <img src={prestige.icon} alt="" style={{ width: 12, height: 12, imageRendering: 'pixelated' }} />
            KAVLING UTAMA — {prestige.houseName}
          </span>
          <span className="font-mono text-amber-400/50 text-xs">✦ SPESIAL</span>
        </div>

        {/* Plot row — hover di sini seperti BuildingCell */}
        <div className="relative border-b border-zinc-700"
          style={{ height: TILE_H, width: '100%', overflow: 'visible' }}
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
          onClick={() => setShowPopup(h => !h)}
        >
          {/* Sky — ikuti timeMode */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0" style={{
              background: timeMode?.sky ?? 'linear-gradient(to bottom, #0a0a1a, #1a0d00)',
              transition: 'background 2s ease',
            }} />
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: 14,
            background: 'linear-gradient(to bottom, #5c3d1e 0%, #4a2e12 40%, #3a2208 100%)',
          }} />
          <div className="absolute left-0 right-0" style={{
            bottom: 14, height: 8,
            background: 'linear-gradient(to bottom, #888888 0%, #6b6b6b 50%, #555555 100%)',
          }} />

          {/* Dekorasi kiri-kanan */}
          <div className="absolute pointer-events-none" style={{ left: '5%', bottom: 22, zIndex: 6 }}>
            <img src="/sprites/tree.png" alt="tree" style={{ imageRendering: 'pixelated', height: 48, width: 'auto' }} />
          </div>
          <div className="absolute pointer-events-none" style={{ right: '5%', bottom: 22, zIndex: 6 }}>
            <img src="/sprites/tree.png" alt="tree" style={{ imageRendering: 'pixelated', height: 48, width: 'auto' }} />
          </div>
          <div className="absolute pointer-events-none" style={{ left: '15%', bottom: 22, zIndex: 6 }}>
            <img src="/sprites/street lamp.png" alt="lamp" style={{ imageRendering: 'pixelated', height: 48, width: 'auto' }} />
          </div>
          <div className="absolute pointer-events-none" style={{ right: '15%', bottom: 22, zIndex: 6 }}>
            <img src="/sprites/street lamp.png" alt="lamp" style={{ imageRendering: 'pixelated', height: 48, width: 'auto' }} />
          </div>

          {/* Rumah + popup */}
          <div
            className="absolute"
            style={{ left: '50%', transform: 'translateX(-50%)', bottom: 22, zIndex: 10 }}
          >
            {/* Popup — pointer-events-none kecuali tombol */}
            {showPopup && (
              <div className="absolute pointer-events-none font-mono" style={{
                bottom: 30, left: '50%', transform: 'translateX(-50%)',
                whiteSpace: 'nowrap', zIndex: 30,
              }}>
                <div className="border border-amber-400/70 rounded-lg px-3 py-2 text-xs"
                  style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', minWidth: 180 }}>
                  <div className="flex flex-col mb-1">
                  <div className="text-amber-400 font-bold">{prestige.houseName}</div>
                  <div className="text-zinc-500 text-xs">{prestige.title}</div>
              </div>
                  <div className="text-zinc-400 text-xs mb-2 leading-relaxed">{prestige.houseDesc}</div>
                  <button
                    onClick={() => setShowCollection(true)}
                    className="w-full py-1.5 border border-amber-400/50 text-amber-400 text-xs rounded hover:bg-amber-400/20 active:scale-95 transition-all font-bold"
                    style={{ pointerEvents: 'auto' }}>
                    🏛️ Lihat Koleksi ({luxuryItems.length})
                  </button>
                </div>
                <div style={{
                  width: 0, height: 0, margin: '0 auto',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid rgba(245,158,11,0.7)',
                }} />
              </div>
            )}

            {/* Rumah icon — PNG sprite sesuai prestige level */}
            <div className="select-none" style={{ lineHeight: 1 }}>
              <img
                src={`/sprites/rumah user tingkat ${prestigeIdx + 1}.png`}
                alt={prestige.houseName}
                style={{
                  imageRendering: 'pixelated',
                  height: 80 + prestigeIdx * 8,
                  width: 'auto',
                  filter: `drop-shadow(0 0 ${8 + prestigeIdx * 4}px rgba(245,158,11,${0.2 + prestigeIdx * 0.08}))`,
                }}
              />
            </div>
          </div>

          {/* NPCs */}
          <SimpleNPC startX={plotW * 0.1} speed={0.5} width={plotW} flip={false} />
          <SimpleNPC startX={plotW * 0.7} speed={0.7} width={plotW} flip={true} />
          <SimpleNPC startX={plotW * 0.4} speed={0.4} width={plotW} flip={false} />
        </div>
      </div>

      {showCollection && <LuxuryCollection onClose={() => setShowCollection(false)} />}
    </>
  );
}
