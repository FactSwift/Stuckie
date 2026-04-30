'use client';
import { useRef, memo } from 'react';
import { useGameStore, PRESTIGE_TITLES, REAL_ASSETS } from '@/store/gameStore';
import EmpireScene from './EmpireScene';

function formatRp(n) {
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `Rp${(n / 1e9).toFixed(2)}M`;
  if (n >= 1e6)  return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString('id')}`;
}

// ── Collect button — only re-renders when pendingIncome changes ───────────────
const CollectButton = memo(function CollectButton() {
  const btnRef = useRef(null);
  const pendingIncome = useGameStore(s => s.pendingIncome);
  const collectIncome = useGameStore(s => s.collectIncome);
  const addFloatingText = useGameStore(s => s.addFloatingText);

  const handleCollect = () => {
    const amount = collectIncome();
    if (amount > 0 && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      addFloatingText(`+${formatRp(amount)}`, rect.left + rect.width / 2, rect.top);
    }
  };

  return (
    <button ref={btnRef} onClick={handleCollect} disabled={pendingIncome < 1}
      className={`relative w-full py-2 rounded-lg border-2 font-bold text-xs tracking-widest transition-all
        ${pendingIncome >= 1
          ? 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/25 active:scale-95 cursor-pointer'
          : 'border-zinc-700 bg-zinc-900 text-zinc-600 cursor-not-allowed'
        }`}
      style={pendingIncome >= 1 ? { boxShadow: '0 0 15px #4ade8044' } : {}}>
      {pendingIncome >= 1 ? (
        <div className="flex flex-col items-center gap-0.5">
          <span>💰 KUMPULKAN</span>
          <span className="text-green-300">{formatRp(Math.floor(pendingIncome))}</span>
        </div>
      ) : (
        <span className="text-xs">Menunggu...</span>
      )}
      {pendingIncome >= 1 && (
        <span className="absolute inset-0 rounded-lg border-2 border-green-400 animate-ping opacity-20" />
      )}
    </button>
  );
});

// ── Stats panel — only re-renders when balance/xp/level/plots change ─────────
const StatsPanel = memo(function StatsPanel() {
  const balance   = useGameStore(s => s.balance);
  const xp        = useGameStore(s => s.xp);
  const level     = useGameStore(s => s.level);
  const gameYear  = useGameStore(s => s.gameYear);
  const gameMonth = useGameStore(s => s.gameMonth);
  const marketUpgrades = useGameStore(s => s.marketUpgrades);
  const portfolio = useGameStore(s => s.portfolio);
  const marketAssets = useGameStore(s => s.marketAssets);
  const plots     = useGameStore(s => s.plots);
  const realAssets = useGameStore(s => s.realAssets);
  // Compute derived values locally
  const netWorth = balance;

  const passiveIncome = useMemo(() => {
    const upgradeMultiplier = 1 + marketUpgrades.reduce((s, u) => s + u.multiplier * u.owned, 0);
    const stockIncome = portfolio.reduce((total, p) => {
      const a = marketAssets.find(x => x.id === p.assetId);
      return total + (a ? a.baseIncome * p.qty * upgradeMultiplier : 0);
    }, 0);
    const plotIncome = plots.flatMap(p => p.slots).reduce((sum, s) => {
      const def = REAL_ASSETS.find(a => a.id === s.assetId);
      if (!def?.incomePerSec) return sum;
      return sum + def.incomePerSec * Math.pow(def.levelMultiplier, (s.level ?? 1) - 1);
    }, 0);
    const realIncome = Object.entries(realAssets).reduce((sum, [id, data]) => {
      const def = REAL_ASSETS.find(a => a.id === id);
      if (!def?.incomePerSec) return sum;
      return sum + def.incomePerSec * Math.pow(def.levelMultiplier, data.level - 1) * (data.qty ?? 1);
    }, 0);
    return stockIncome + plotIncome + realIncome;
  }, [portfolio, plots, realAssets, marketAssets, marketUpgrades]);

  const prestige = useMemo(() => {
    let current = PRESTIGE_TITLES[0];
    for (const p of PRESTIGE_TITLES) { if (level >= p.minLevel) current = p; }
    return current;
  }, [level]);

  const nextPrestige = PRESTIGE_TITLES.find(p => p.minLevel > level);
  const currentPrestige = PRESTIGE_TITLES.filter(p => p.minLevel <= level).at(-1) || PRESTIGE_TITLES[0];
  const progressPct = nextPrestige
    ? Math.min(((level - currentPrestige.minLevel) / (nextPrestige.minLevel - currentPrestige.minLevel)) * 100, 100)
    : 100;
  const xpNeeded = level * 1000;
  const xpPct = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <>
      {/* Prestige */}
      <div className="flex flex-col items-center gap-1 pt-2">
        <img src={prestige.icon} alt={prestige.title}
          style={{ width: 48, height: 48, imageRendering: 'pixelated', filter: 'drop-shadow(0 0 12px #f59e0b88)' }} />
        <div className="text-amber-400 font-bold text-sm tracking-wider text-center">{prestige.title}</div>
        <div className="text-zinc-500 text-xs">Level {level} Trader</div>
        <div className="text-zinc-600 text-xs">Tahun ke-{gameYear}, Bulan {gameMonth}</div>
      </div>

      {/* Net Worth */}
      <div className="text-center border border-amber-400/30 rounded-lg py-2 px-1 bg-amber-400/5">
        <div className="text-zinc-500 text-xs tracking-widest mb-1">KEKAYAAN BERSIH</div>
        <div className="text-xl font-bold text-amber-400" style={{ textShadow: '0 0 10px #f59e0b66' }}>
          {formatRp(netWorth)}
        </div>
        <div className="text-green-400 text-xs mt-1">+{formatRp(passiveIncome)}/bln</div>
      </div>

      {/* Prestige Progress */}
      {nextPrestige && (
        <div>
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span className="truncate flex items-center gap-1">
              MENUJU:
              <img src={nextPrestige.icon} alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
            </span>
            <span>{progressPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* XP Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-cyan-400 font-bold">LVL {level}</span>
          <span className="text-zinc-500 text-xs">{xp}/{xpNeeded}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Prestige ladder */}
      <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-zinc-800 justify-center">
        {PRESTIGE_TITLES.map(p => (
          <img key={p.minLevel} src={p.icon} alt={p.title}
            style={{ width: 20, height: 20, imageRendering: 'pixelated', opacity: level >= p.minLevel ? 1 : 0.15 }} />
        ))}
      </div>
    </>
  );
});

// ── Main HQView ───────────────────────────────────────────────────────────────
export default function HQView() {
  return (
    <div className="flex h-full gap-0 font-mono overflow-hidden">

      {/* LEFT PANEL 20% — fixed, no scroll */}
      <div className="flex flex-col gap-2 pr-3 border-r border-zinc-800 shrink-0 overflow-hidden"
        style={{ width: '20%', minWidth: 160 }}>
        <StatsPanel />
        <CollectButton />
      </div>

      {/* RIGHT PANEL 80% — scrollable */}
      <div className="flex-1 overflow-y-auto pl-3">
        <EmpireScene />
      </div>
    </div>
  );
}
