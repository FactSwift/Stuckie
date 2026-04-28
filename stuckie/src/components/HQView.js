'use client';
import { useRef } from 'react';
import { useGameStore, PRESTIGE_TITLES } from '@/store/gameStore';
import EmpireScene from './EmpireScene';

function formatRp(n) {
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `Rp${(n / 1e9).toFixed(2)}M`;
  if (n >= 1e6)  return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString('id')}`;
}

export default function HQView() {
  const { pendingIncome, collectIncome, getPassiveIncome, getNetWorth, getPrestige, level, xp, addFloatingText } = useGameStore();
  const btnRef = useRef(null);
  const netWorth = getNetWorth();
  const passiveIncome = getPassiveIncome();
  const prestige = getPrestige();
  const xpNeeded = level * 1000;
  const xpPct = Math.min((xp / xpNeeded) * 100, 100);

  const nextPrestige = PRESTIGE_TITLES.find(p => p.min > netWorth);
  const currentPrestige = PRESTIGE_TITLES.filter(p => p.min <= netWorth).at(-1) || PRESTIGE_TITLES[0];
  const progressPct = nextPrestige
    ? Math.min(((netWorth - currentPrestige.min) / (nextPrestige.min - currentPrestige.min)) * 100, 100)
    : 100;

  const handleCollect = () => {
    const amount = collectIncome();
    if (amount > 0 && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      addFloatingText(`+${formatRp(amount)}`, rect.left + rect.width / 2, rect.top);
    }
  };

  return (
    <div className="flex h-full gap-0 font-mono" style={{ alignItems: 'flex-start' }}>

      {/* ── LEFT PANEL 20% — Stats & Collect ── */}
      <div className="flex flex-col gap-3 pr-3 border-r border-zinc-800"
        style={{ width: '20%', minWidth: 160, position: 'sticky', top: 0, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>

        {/* Prestige */}
        <div className="flex flex-col items-center gap-1 pt-2">
          <div className="text-4xl" style={{ filter: 'drop-shadow(0 0 12px #f59e0b88)' }}>
            {prestige.icon}
          </div>
          <div className="text-amber-400 font-bold text-sm tracking-wider text-center">{prestige.title}</div>
          <div className="text-zinc-500 text-xs">Level {level} Trader</div>
        </div>

        {/* Net Worth */}
        <div className="text-center border border-amber-400/30 rounded-lg py-2 px-1 bg-amber-400/5">
          <div className="text-zinc-500 text-xs tracking-widest mb-1">NET WORTH</div>
          <div className="text-xl font-bold text-amber-400" style={{ textShadow: '0 0 10px #f59e0b66' }}>
            {formatRp(netWorth)}
          </div>
          <div className="text-green-400 text-xs mt-1">+{formatRp(passiveIncome)}/s</div>
        </div>

        {/* Prestige Progress */}
        {nextPrestige && (
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span className="truncate">MENUJU: {nextPrestige.icon}</span>
              <span>{progressPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-xs text-zinc-700 mt-0.5 text-right truncate">
              {formatRp(nextPrestige.min)}
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

        {/* Collect Button */}
        <button ref={btnRef} onClick={handleCollect} disabled={pendingIncome < 1}
          className={`relative w-full py-3 rounded-lg border-2 font-bold text-xs tracking-widest transition-all
            ${pendingIncome >= 1
              ? 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/25 active:scale-95 cursor-pointer'
              : 'border-zinc-700 bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          style={pendingIncome >= 1 ? { boxShadow: '0 0 15px #4ade8044' } : {}}>
          {pendingIncome >= 1 ? (
            <div className="flex flex-col items-center gap-0.5">
              <span>💰 COLLECT</span>
              <span className="text-green-300">{formatRp(Math.floor(pendingIncome))}</span>
            </div>
          ) : (
            <span className="text-xs">Menunggu...</span>
          )}
          {pendingIncome >= 1 && (
            <span className="absolute inset-0 rounded-lg border-2 border-green-400 animate-ping opacity-20" />
          )}
        </button>

        {/* Prestige ladder */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-zinc-800 justify-center">
          {PRESTIGE_TITLES.map(p => (
            <span key={p.min} className={`text-base ${netWorth >= p.min ? 'opacity-100' : 'opacity-15'}`}>
              {p.icon}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL 80% — Empire Scene ── */}
      <div className="flex-1 overflow-y-auto pl-3" style={{ width: '80%' }}>
        <EmpireScene />
      </div>
    </div>
  );
}
