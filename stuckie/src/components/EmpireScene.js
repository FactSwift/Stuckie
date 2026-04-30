'use client';
import { useEffect, useState, useRef } from 'react';
import { useGameStore, REAL_ASSETS } from '@/store/gameStore';
import { PixelArt, BUILDING_SPRITES, ENV_SPRITES, ASSET_ENV, ASSET_GROUND } from '../sprites/PixelSprites';
import PrestigePlot from './PrestigePlot';

const SCALE = 3;
const TILE_COLS = 6;
const TILE_H = 160;

// ─── Time of day system ───────────────────────────────────────────────────────
const TIME_MODES = [
  {
    id: 'pagi',
    label: '🌅 Pagi',
    // Sky: warm orange-pink sunrise
    sky: 'linear-gradient(to bottom, #1a0a2e 0%, #6b2d6b 20%, #e8734a 50%, #f5a623 75%, #ffd89b 100%)',
    // Ground tint
    groundLight: 'rgba(255,180,80,0.08)',
  },
  {
    id: 'siang',
    label: '☀️ Siang',
    sky: 'linear-gradient(to bottom, #0a4a8a 0%, #1a6fc4 25%, #3a9fd8 55%, #7ec8e3 80%, #b8e4f0 100%)',
    groundLight: 'rgba(255,255,200,0.06)',
  },
  {
    id: 'sore',
    label: '🌇 Sore',
    sky: 'linear-gradient(to bottom, #0d1b4b 0%, #2d3a8c 20%, #c0392b 45%, #e67e22 65%, #f39c12 80%, #f9ca24 100%)',
    groundLight: 'rgba(255,120,40,0.1)',
  },
  {
    id: 'malam',
    label: '🌙 Malam',
    sky: 'linear-gradient(to bottom, #000005 0%, #05051a 25%, #0a0a2e 55%, #0d0d3a 80%, #1a0d00 100%)',
    groundLight: 'rgba(30,30,80,0.15)',
  },
];

// Auto-cycle every 3 minutes — uses local state, not gameTime
function useTimeOfDay() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % TIME_MODES.length);
    }, 3 * 60 * 1000); // 3 minutes
    return () => clearInterval(iv);
  }, []);
  return TIME_MODES[idx];
}

const ASSET_NPCS = {
  warung:    ['cook', 'person', 'shopper'],
  cafe:      ['cook', 'shopper'],
  startup:   ['exec', 'exec', 'worker'],
  kos:       ['person', 'person'],
  ruko:      ['exec', 'shopper'],
  apartemen: ['person', 'exec', 'person'],
  mall:      ['shopper', 'shopper', 'exec', 'person'],
  gedung:    ['exec', 'exec', 'worker'],
  pabrik:    ['worker', 'worker', 'person'],
  bank:      ['exec', 'shopper', 'person'],
};

// Building sprites that use PNG files instead of pixel art
const BUILDING_PNG = {
  kos:       '/sprites/kos-kosan.png',
  ruko:      '/sprites/ruko.png',
  apartemen: '/sprites/apartemen.png',
  mall:      '/sprites/mall.png',
  gedung:    '/sprites/gedung perkantoran.png',
  warung:    '/sprites/warung makan.png',
  cafe:      '/sprites/kafe .png',
  startup:   '/sprites/tech startup.png',
  pabrik:    '/sprites/industri manufaktur.png',
  bank:      '/sprites/bank.png',
};

// height = tinggi render (px), bottom = jarak dari ground strip
const BUILDING_PNG_CONFIG = {
  kos:       { height: 75,  bottom: 22 },
  ruko:      { height: 80,  bottom: 22 },
  apartemen: { height: 95,  bottom: 22 },
  mall:      { height: 88,  bottom: 22 },
  gedung:    { height: 110, bottom: 22 },
  warung:    { height: 68,  bottom: 22 },
  cafe:      { height: 75,  bottom: 22 },
  startup:   { height: 88,  bottom: 22 },
  pabrik:    { height: 95,  bottom: 22 },
  bank:      { height: 95,  bottom: 22 },
};
const NPC_FRAMES = [
  '/sprites/npc/sprite_0.png',
  '/sprites/npc/sprite_1.png',
  '/sprites/npc/sprite_2.png',
  '/sprites/npc/sprite_3.png',
];

// All NPC types use the same sprite sheet (same character)
const NPC_TYPE_MAP = {
  cook:    [0, 1, 2, 3],
  exec:    [0, 1, 2, 3],
  worker:  [0, 1, 2, 3],
  shopper: [0, 1, 2, 3],
  person:  [0, 1, 2, 3],
};

// ─── Walking NPC ──────────────────────────────────────────────────────────────
function WalkingNPC({ type, startX, speed, width, flip }) {
  const [x, setX] = useState(startX);
  const [frame, setFrame] = useState(0);
  const [dir, setDir] = useState(flip ? -1 : 1);
  const xRef = useRef(startX);
  const dirRef = useRef(flip ? -1 : 1);

  useEffect(() => {
    const frames = NPC_TYPE_MAP[type] || NPC_TYPE_MAP.person;
    const move = setInterval(() => {
      xRef.current += dirRef.current * speed;
      if (xRef.current > width + 10) xRef.current = -10;
      else if (xRef.current < -10) xRef.current = width + 10;
      setX(xRef.current);
    }, 50);
    const anim = setInterval(() => setFrame(f => (f + 1) % frames.length), 150);
    return () => { clearInterval(move); clearInterval(anim); };
  }, [type, speed, width]);

  const frames = NPC_TYPE_MAP[type] || NPC_TYPE_MAP.person;
  const frameIdx = frames[frame];

  return (
    <div className="absolute pointer-events-none" style={{
      left: x,
      bottom: 22,
      transform: dir > 0 ? 'scaleX(-1)' : 'scaleX(1)',
      imageRendering: 'pixelated',
      zIndex: 5,
    }}>
      <img
        src={NPC_FRAMES[frameIdx]}
        alt=""
        width={24}
        height={32}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />
    </div>
  );
}

// ─── Income pop ───────────────────────────────────────────────────────────────
function IncomePop({ x, y, text }) {
  return (
    <div className="absolute pointer-events-none font-mono font-bold text-green-400" style={{
      left: x, bottom: y, fontSize: 9, zIndex: 20, whiteSpace: 'nowrap',
      animation: 'incomeFloat 1.4s ease-out forwards',
      textShadow: '0 0 6px #4ade80',
    }}>{text}</div>
  );
}

// ─── Building cell — 1 sprite scaled to fill colSpan tiles ───────────────────
function BuildingCell({ slot, colSpan, cellW, timeMode }) {
  const def = REAL_ASSETS.find(a => a.id === slot.assetId);
  const sprite = BUILDING_SPRITES[slot.assetId];
  const npcTypes = (ASSET_NPCS[slot.assetId] || ['person']).slice(0, Math.min(colSpan + 1, 4));
  const [pops, setPops] = useState([]);
  const [hovered, setHovered] = useState(false);
  const width = cellW * colSpan;
  const spriteScale = colSpan >= 3 ? 2 : colSpan >= 2 ? 2 : 3;

  const income = def?.incomePerSec
    ? def.incomePerSec * Math.pow(def.levelMultiplier, (slot.level ?? 1) - 1)
    : 0;

  useEffect(() => {
    if (!income) return;
    const iv = setInterval(() => {
      const id = Date.now() + Math.random();
      const display = income >= 1e6
        ? `+${(income / 1e6).toFixed(1)}jt/bln`
        : income >= 1000
        ? `+${(income / 1000).toFixed(1)}k/bln`
        : `+${Math.floor(income)}/bln`;
      setPops(p => [...p, { id, x: 8 + Math.random() * Math.max(width - 20, 10), y: 45 + Math.random() * 25, text: display }]);
      setTimeout(() => setPops(p => p.filter(pop => pop.id !== id)), 1400);
    }, Math.max(800, 2500 / colSpan));
    return () => clearInterval(iv);
  }, [income, colSpan, width]);

  if (!def) return null;

  return (
    <div className="relative" style={{ width, height: TILE_H, flexShrink: 0, overflow: 'visible' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(h => !h)}
    >
      {/* Background — clipped to tile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: timeMode.sky,
          transition: 'background 2s ease',
        }} />
        {/* Ambient light overlay */}
        <div className="absolute inset-0" style={{ background: timeMode.groundLight }} />
      </div>

      {/* Ground — road (top thin) + soil (bottom thick) with gradients */}
      {/* Soil layer — tebal, coklat */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 14,
        background: 'linear-gradient(to bottom, #5c3d1e 0%, #4a2e12 40%, #3a2208 100%)',
        boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.4)',
      }} />
      {/* Road layer — tipis, abu-abu di atas tanah */}
      <div className="absolute left-0 right-0" style={{
        bottom: 14,
        height: 8,
        background: 'linear-gradient(to bottom, #888888 0%, #6b6b6b 50%, #555555 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.3)',
      }} />

      {/* Building sprite — overflows upward if taller than TILE_H */}
      {BUILDING_PNG[slot.assetId] ? (
        <img
          src={BUILDING_PNG[slot.assetId]}
          alt={slot.assetId}
          style={{
            position: 'absolute',
            bottom: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            imageRendering: 'pixelated',
            height: BUILDING_PNG_CONFIG[slot.assetId]?.height ?? 100,
            width: 'auto',
            display: 'block',
          }}
        />
      ) : sprite ? (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2" style={{ imageRendering: 'pixelated' }}>
          <PixelArt pixels={sprite} scale={spriteScale} />
        </div>
      ) : (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2"
          style={{ fontSize: 16 + colSpan * 8 }}>
          {def.icon}
        </div>
      )}

      {/* Environment props — placed at edges to avoid overlapping building */}
      {(ASSET_ENV[slot.assetId] || []).map((env, i) => {
        const isTree = env.sprite === 'tree_small' || env.sprite === 'tree_big';
        const isLamp = env.sprite === 'street_lamp';
        if (isTree || isLamp) {
          const src = isTree ? '/sprites/tree.png' : '/sprites/street lamp.png';
          return (
            <div key={i} className="absolute pointer-events-none" style={{
              left: `${env.x}%`,
              bottom: env.bottom,
              zIndex: 6,
            }}>
              <img src={src} alt={env.sprite}
                style={{ imageRendering: 'pixelated', height: env.scale * 8, width: 'auto', display: 'block' }} />
            </div>
          );
        }
        const envSprite = ENV_SPRITES[env.sprite];
        if (!envSprite) return null;
        return (
          <div key={i} className="absolute pointer-events-none" style={{
            left: `${env.x}%`,
            bottom: env.bottom,
            imageRendering: 'pixelated',
            zIndex: 6,
          }}>
            <PixelArt pixels={envSprite} scale={env.scale} />
          </div>
        );
      })}

      {/* Hover/click popup — positioned just above the building */}
      {hovered && (
        <div className="absolute left-1/2 z-30 pointer-events-none font-mono"
          style={{
            bottom: 80,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}>
          <div className="border border-amber-400/70 rounded px-2 py-1.5 text-xs"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
            <div className="text-amber-400 font-bold">{def.name}</div>
            <div className="text-zinc-400 text-xs">Lv.{slot.level ?? 1}</div>
            {income > 0 && (
              <div className="text-green-400 text-xs">
                +{income >= 1e6 ? `${(income/1e6).toFixed(1)}jt` : income >= 1000 ? `${(income/1000).toFixed(1)}k` : Math.floor(income)}/bln
              </div>
            )}
          </div>
          <div className="w-2 h-2 mx-auto" style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(245,158,11,0.7)',
          }} />
        </div>
      )}

      {/* NPCs */}
      {npcTypes.map((type, i) => (
        <WalkingNPC key={i} type={type}
          startX={Math.floor((i + 0.5) * (width / npcTypes.length))}
          speed={0.5 + i * 0.2}
          width={width}
          flip={i % 2 === 1} />
      ))}

      {/* Income pops */}
      {pops.map(pop => <IncomePop key={pop.id} x={pop.x} y={pop.y} text={pop.text} />)}
    </div>  );
}

// ─── Empty remainder cell ─────────────────────────────────────────────────────
function EmptyCell({ width, timeMode }) {
  return (
    <div className="relative overflow-hidden" style={{ width, height: TILE_H, flexShrink: 0 }}>
      <div className="absolute inset-0" style={{
        background: timeMode.sky,
        transition: 'background 2s ease',
      }} />
      {/* Grass ground */}
      {/* Soil only — no road for empty land */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: 22,
        background: 'linear-gradient(to bottom, #6b4c2a 0%, #5c3d1e 40%, #3a2208 100%)',
        boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

// ─── One plot row ─────────────────────────────────────────────────────────────
function PlotRow({ plot, plotIndex, containerW, timeMode }) {
  const cellW = containerW / TILE_COLS;

  // Calculate how many cols are used by buildings
  const usedCols = plot.slots.reduce((sum, s) => {
    const def = REAL_ASSETS.find(a => a.id === s.assetId);
    return sum + (def?.landCost ?? 1);
  }, 0);  const emptyCols = Math.max(0, TILE_COLS - usedCols);

  const plotIncome = plot.slots.reduce((sum, s) => {
    const def = REAL_ASSETS.find(a => a.id === s.assetId);
    if (!def?.incomePerSec) return sum;
    return sum + def.incomePerSec * Math.pow(def.levelMultiplier, (s.level ?? 1) - 1);
  }, 0);

  const fmt = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}jt` : n >= 1000 ? `${(n/1000).toFixed(1)}k` : Math.floor(n);

  return (
    <div className="flex flex-col">
      {/* Label bar */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-zinc-900 border-b border-zinc-700">
        <span className="font-mono text-amber-400/70" style={{ fontSize: 8 }}>🟫 KAVLING #{plotIndex + 1}</span>
        {plotIncome > 0 && (
          <span className="font-mono text-green-400" style={{ fontSize: 8 }}>+{fmt(plotIncome)}/bln</span>
        )}
      </div>

      {/* Row: buildings fill exact proportional width, empty fills rest */}
      <div className="flex w-full border-b border-zinc-700">
        {plot.slots.map((slot, i) => {
          const def = REAL_ASSETS.find(a => a.id === slot.assetId);
          const span = def?.landCost ?? 1;
          return <BuildingCell key={i} slot={slot} colSpan={span} cellW={cellW} timeMode={timeMode} />;
        })}
        {emptyCols > 0 && <EmptyCell width={cellW * emptyCols} timeMode={timeMode} />}
      </div>    </div>
  );
}

// ─── Non-land assets (kendaraan, gaya hidup) ──────────────────────────────────
function FloatingRow({ entries, containerW }) {
  const cellW = containerW / TILE_COLS;
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center px-2 py-0.5 bg-zinc-900 border-b border-zinc-700">
        <span className="font-mono text-cyan-400/70" style={{ fontSize: 8 }}>🚗 ASET BERGERAK</span>
      </div>
      <div className="flex flex-wrap w-full border-b border-zinc-700">
        {entries.map(([id, data]) => {
          const def = REAL_ASSETS.find(a => a.id === id);
          if (!def) return null;
          const sprite = BUILDING_SPRITES[id];
          const npcTypes = (ASSET_NPCS[id] || ['person']).slice(0, 2);
          return (
            <div key={id} className="relative overflow-hidden" style={{ width: cellW, height: TILE_H, flexShrink: 0 }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0a0a1a 0%, #0a0a1a 35%, #1a0d00 35%)' }} />
              <div className="absolute bottom-0 left-0 right-0" style={{
                height: 14,
                background: 'linear-gradient(to bottom, #5c3d1e 0%, #4a2e12 40%, #3a2208 100%)',
              }} />
              <div className="absolute left-0 right-0" style={{
                bottom: 14, height: 8,
                background: 'linear-gradient(to bottom, #888888 0%, #6b6b6b 50%, #555555 100%)',
              }} />
              {sprite
                ? <div className="absolute bottom-5 left-1/2 -translate-x-1/2" style={{ imageRendering: 'pixelated' }}><PixelArt pixels={sprite} scale={SCALE} /></div>
                : <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-2xl">{def.icon}</div>
              }
              <div className="absolute top-1 left-1 z-10 font-mono text-cyan-400 truncate" style={{ fontSize: 7 }}>{def.name.toUpperCase()}</div>
              {(data.qty ?? 1) > 1 && (
                <div className="absolute top-5 left-1 z-10 border border-cyan-400/50 text-cyan-400 font-mono rounded px-1" style={{ fontSize: 7 }}>x{data.qty}</div>
              )}
              {npcTypes.map((type, i) => (
                <WalkingNPC key={i} type={type} startX={5 + i * 40} speed={0.6 + i * 0.2} width={cellW} flip={i % 2 === 1} />
              ))}
              <div className="absolute top-0 bottom-0 right-0 w-px bg-zinc-600/40" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmpireScene() {
  const plots = useGameStore(s => s.plots);
  const realAssets = useGameStore(s => s.realAssets);
  const getPassiveIncome = useGameStore(s => s.getPassiveIncome);
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(600);
  const totalIncome = getPassiveIncome();
  const timeMode = useTimeOfDay();

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(e => setContainerW(e[0].contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const nonLandEntries = Object.entries(realAssets).filter(([id]) => {
    const def = REAL_ASSETS.find(a => a.id === id);
    return def && def.landCost === 0 && !def.isLuxury && def.category !== 'Kendaraan';
  });

  const fmt = n => n >= 1e6 ? `${(n/1e6).toFixed(1)}jt` : n >= 1000 ? `${(n/1000).toFixed(1)}k` : Math.floor(n);

  if (plots.length === 0 && nonLandEntries.length === 0) {
    // Tetap tampilkan kavling spesial meski belum ada aset
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between font-mono">
          <span className="text-amber-400 text-xs tracking-widest">▶ EMPIRE LIVE</span>
          <span className="text-green-400 text-xs">+0 Rp/bln</span>
        </div>
        <div ref={containerRef} className="rounded-lg border border-zinc-700 overflow-hidden">
          <PrestigePlot containerW={containerW} timeMode={timeMode} />
          <div className="text-zinc-600 text-xs text-center py-3 border-t border-zinc-800">
            Beli kavling tanah di tab 🛒 Beli Aset untuk membangun empire!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-mono">
        <span className="text-amber-400 text-xs tracking-widest">▶ EMPIRE LIVE</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{timeMode.label}</span>
          <span className="text-green-400 text-xs">+{fmt(totalIncome)} Rp/bln</span>
        </div>
      </div>

      <div ref={containerRef} className="rounded-lg border border-zinc-700 overflow-hidden">
        {/* Kavling spesial — selalu di paling atas */}
        <PrestigePlot containerW={containerW} timeMode={timeMode} />
        {plots.map((plot, i) => (
          <PlotRow key={plot.id} plot={plot} plotIndex={i} containerW={containerW} timeMode={timeMode} />
        ))}
        <FloatingRow entries={nonLandEntries} containerW={containerW} />
      </div>

      <style>{`
        @keyframes incomeFloat {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-28px); }
        }
      `}</style>
    </div>
  );
}
