'use client';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

export default function UpgradeShop() {
  const { balance, marketUpgrades: upgrades, buyMarketUpgrade: buyUpgrade, getPassiveIncome } = useGameStore();
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuy = (id) => {
    const res = buyUpgrade(id);
    showToast(res.msg, res.success);
  };

  const totalPassive = getPassiveIncome();

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="flex items-center justify-between">
        <div className="text-amber-400 text-xs tracking-widest">▶ UPGRADE SHOP</div>
        <div className="text-xs text-green-400">
          {Math.floor(totalPassive).toLocaleString('id')} Rp/detik
        </div>
      </div>

      <div className="text-xs text-zinc-500 border border-zinc-800 rounded p-2 bg-zinc-900/50">
        Upgrade meningkatkan passive income dari semua aset yang kamu miliki. Semakin banyak dibeli, semakin mahal.
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {upgrades.map(u => {
          const cost = Math.floor(u.cost * Math.pow(1.5, u.owned));
          const canAfford = balance >= cost;
          return (
            <div
              key={u.id}
              className={`border rounded p-3 transition-all
                ${canAfford ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-zinc-950 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-300 text-sm font-bold">{u.name}</span>
                    {u.owned > 0 && (
                      <span className="text-xs bg-amber-400/20 border border-amber-400/50 text-amber-400 px-1.5 rounded-full">
                        x{u.owned}
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-400 text-xs mt-0.5">{u.desc}</div>
                  <div className="text-green-400 text-xs mt-1">
                    +{(u.multiplier * 100).toFixed(0)}% passive income per level
                  </div>
                </div>
                <button
                  onClick={() => handleBuy(u.id)}
                  disabled={!canAfford}
                  className={`shrink-0 px-3 py-2 rounded border text-xs font-bold transition-all
                    ${canAfford
                      ? 'border-amber-400 text-amber-400 hover:bg-amber-400/20 active:scale-95'
                      : 'border-zinc-700 text-zinc-600 cursor-not-allowed'
                    }`}
                >
                  <div>BELI</div>
                  <div className="text-xs font-normal mt-0.5">
                    Rp{cost.toLocaleString('id')}
                  </div>
                </button>
              </div>

              {/* Owned progress dots */}
              {u.owned > 0 && (
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: Math.min(u.owned, 10) }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-amber-400" />
                  ))}
                  {u.owned > 10 && <span className="text-amber-400 text-xs">+{u.owned - 10}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border font-mono text-sm
          ${toast.ok ? 'bg-green-900 border-green-500 text-green-300' : 'bg-red-900 border-red-500 text-red-300'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
