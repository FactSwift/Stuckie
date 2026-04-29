'use client';
import { useGameStore, REAL_ASSETS } from '@/store/gameStore';

const LUXURY_ASSETS = REAL_ASSETS.filter(a => a.isLuxury);

function formatRp(n) {
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `Rp${(n / 1e9).toFixed(1)}M`;
  if (n >= 1e6)  return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString('id')}`;
}

// Mapping luxury id ke file sprite
const LUXURY_SPRITES = {
  jam:      '/sprites/jam tangan mewah.png',
  supercar: '/sprites/supercar.png',
  yacht:    '/sprites/yacht pribadi.png',
  pulau:    '/sprites/pulau pribadi.png',
};

// Single display case (etalase)
function DisplayCase({ item, owned }) {
  const spriteSrc = LUXURY_SPRITES[item.id];

  return (
    <div className={`relative flex flex-col items-center border-2 rounded-lg p-4 transition-all font-mono
      ${owned
        ? 'border-amber-400/60 bg-gradient-to-b from-zinc-900 to-zinc-800'
        : 'border-zinc-700 bg-zinc-950 opacity-50'
      }`}
      style={owned ? { boxShadow: '0 0 20px rgba(245,158,11,0.15), inset 0 0 30px rgba(245,158,11,0.05)' } : {}}>

      {/* Glass case top */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ background: owned ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' : 'transparent' }} />

      {/* Item image or emoji */}
      <div className="mb-3 flex items-center justify-center" style={{ height: 80 }}>
        {spriteSrc ? (
          <img src={spriteSrc} alt={item.name}
            style={{
              imageRendering: 'pixelated',
              maxHeight: 80, maxWidth: '100%', width: 'auto',
              filter: owned ? 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' : 'grayscale(1)',
            }} />
        ) : (
          <span style={{
            fontSize: 56,
            filter: owned ? 'drop-shadow(0 0 12px rgba(245,158,11,0.6))' : 'grayscale(1)',
          }}>
            {item.icon}
          </span>
        )}
      </div>

      {/* Item name */}
      <div className={`text-sm font-bold text-center mb-1 ${owned ? 'text-amber-400' : 'text-zinc-600'}`}>
        {item.displayName || item.name}
      </div>

      {/* Description */}
      <div className="text-zinc-500 text-xs text-center mb-2 leading-relaxed">
        {item.displayDesc || item.desc}
      </div>

      {/* Price / owned badge */}
      {owned ? (
        <div className="mt-auto px-3 py-1 rounded-full border border-amber-400/50 bg-amber-400/10 text-amber-400 text-xs font-bold">
          ✓ DIMILIKI
        </div>
      ) : (
        <div className="mt-auto text-zinc-600 text-xs">
          {formatRp(item.baseCost)}
        </div>
      )}

      {/* Pedestal */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-1 rounded-b"
        style={{ background: owned ? 'rgba(245,158,11,0.3)' : 'rgba(100,100,100,0.2)' }} />
    </div>
  );
}

export default function LuxuryCollection({ onClose }) {
  const luxuryItems = useGameStore(s => s.luxuryItems);
  const ownedCount = luxuryItems.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 font-mono px-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl border border-amber-400/30 rounded-xl bg-zinc-950 overflow-hidden"
        style={{ boxShadow: '0 0 60px rgba(245,158,11,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900">
          <div>
            <div className="text-amber-400 font-bold tracking-widest text-sm">🏛️ RUANG KOLEKSI MEWAH</div>
            <div className="text-zinc-500 text-xs mt-0.5">{ownedCount} / {LUXURY_ASSETS.length} koleksi dimiliki</div>
          </div>
          <button onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl transition-colors px-2">✕</button>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-2 bg-zinc-900/50 border-b border-zinc-800">
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${(ownedCount / LUXURY_ASSETS.length) * 100}%` }} />
          </div>
        </div>

        {/* Room description */}
        <div className="px-5 py-3 text-zinc-600 text-xs border-b border-zinc-800 italic">
          "Ruangan eksklusif yang menampilkan koleksi barang mewah Anda. Setiap etalase menyimpan satu karya terbaik dunia."
        </div>

        {/* Display cases grid */}
        <div className="p-5 grid grid-cols-2 gap-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {LUXURY_ASSETS.map(item => (
            <DisplayCase key={item.id} item={item} owned={luxuryItems.includes(item.id)} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/50 text-center">
          <div className="text-zinc-600 text-xs">
            Beli barang mewah di tab <span className="text-amber-400">🛒 Beli Aset</span> → Gaya Hidup
          </div>
        </div>
      </div>
    </div>
  );
}
