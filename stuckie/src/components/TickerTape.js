'use client';
import { useGameStore } from '@/store/gameStore';

export default function TickerTape() {
  const { marketAssets: assets } = useGameStore();

  const items = [...assets, ...assets]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-y border-amber-400/20 bg-zinc-950 py-1">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: 'ticker 20s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((asset, i) => (
          <span key={i} className="text-xs font-mono inline-flex items-center gap-1.5">
            <span className="text-zinc-400">{asset.id}</span>
            <span className="text-white">Rp{asset.price.toLocaleString('id')}</span>
            <span className={asset.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {asset.change >= 0 ? '▲' : '▼'}{Math.abs(asset.change * 100).toFixed(2)}%
            </span>
            <span className="text-zinc-700">|</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
