'use client';
import { useGameStore } from '@/store/gameStore';

export default function Portfolio() {
  const { balance, assets, portfolio, getNetWorth, totalTrades } = useGameStore();
  const netWorth = getNetWorth();
  const profit = netWorth - 10000000;
  const profitPct = (profit / 10000000) * 100;

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="text-amber-400 text-xs tracking-widest">▶ FINANCIAL HQ STATUS</div>

      {/* Net Worth */}
      <div className="border border-amber-400/50 rounded p-3 bg-zinc-900">
        <div className="text-zinc-400 text-xs mb-1">NET WORTH</div>
        <div className="text-2xl text-amber-400 font-bold">
          Rp{netWorth.toLocaleString('id')}
        </div>
        <div className={`text-sm mt-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {profit >= 0 ? '▲' : '▼'} Rp{Math.abs(profit).toLocaleString('id')} ({profitPct.toFixed(2)}%)
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
          <div className="text-zinc-500 text-xs">CASH</div>
          <div className="text-green-400 text-sm">Rp{balance.toLocaleString('id')}</div>
        </div>
        <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
          <div className="text-zinc-500 text-xs">TOTAL TRADES</div>
          <div className="text-cyan-400 text-sm">{totalTrades}x</div>
        </div>
      </div>

      {/* Holdings */}
      <div className="text-amber-400 text-xs tracking-widest mt-1">▶ HOLDINGS</div>
      {portfolio.length === 0 ? (
        <div className="text-zinc-600 text-xs text-center py-4 border border-zinc-800 rounded">
          Belum ada aset. Mulai beli dari Terminal!
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {portfolio.map(p => {
            const asset = assets.find(a => a.id === p.assetId);
            if (!asset) return null;
            const currentVal = asset.price * p.qty;
            const costVal = p.avgPrice * p.qty;
            const pnl = currentVal - costVal;
            const pnlPct = (pnl / costVal) * 100;

            return (
              <div key={p.assetId} className="border border-zinc-700 rounded p-2 bg-zinc-900">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-amber-300 text-sm font-bold">{asset.id}</span>
                    <span className="text-zinc-500 text-xs ml-2">{p.qty} lot</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">Rp{currentVal.toLocaleString('id')}</div>
                    <div className={`text-xs ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}Rp{pnl.toLocaleString('id')} ({pnlPct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                <div className="text-zinc-600 text-xs mt-1">
                  Avg: Rp{p.avgPrice.toLocaleString('id')} | Now: Rp{asset.price.toLocaleString('id')}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HQ Level */}
      <div className="border border-zinc-700 rounded p-2 bg-zinc-900 mt-auto">
        <div className="text-zinc-500 text-xs mb-1">HQ LEVEL</div>
        <div className="flex items-center gap-2">
          {['🏚️', '🏠', '🏢', '🏦', '🏰'].map((icon, i) => {
            const threshold = [0, 12000000, 20000000, 50000000, 100000000][i];
            const active = netWorth >= threshold;
            return (
              <span key={i} className={`text-lg ${active ? 'opacity-100' : 'opacity-20'}`}>{icon}</span>
            );
          })}
        </div>
        <div className="text-amber-400 text-xs mt-1">
          {netWorth < 12000000 && 'Rookie Trader — Kumpulkan Rp12jt untuk upgrade!'}
          {netWorth >= 12000000 && netWorth < 20000000 && 'Junior Investor — Menuju Rp20jt!'}
          {netWorth >= 20000000 && netWorth < 50000000 && 'Market Player — Target Rp50jt!'}
          {netWorth >= 50000000 && netWorth < 100000000 && 'Senior Trader — Hampir jadi Tycoon!'}
          {netWorth >= 100000000 && '🏆 FINANCIAL TYCOON — MAX LEVEL!'}
        </div>
      </div>
    </div>
  );
}
