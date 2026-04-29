'use client';
import { useState, useRef } from 'react';
import { useGameStore, REAL_ASSETS } from '@/store/gameStore';

const CATEGORIES = ['Semua', 'Tanah', 'Properti', 'Bisnis', 'Gaya Hidup'];

const COLOR_MAP = {
  amber:  { border: 'border-amber-500/60',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  btn: 'border-amber-400 text-amber-400 hover:bg-amber-400/20' },
  cyan:   { border: 'border-cyan-500/60',   bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   btn: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/20' },
  green:  { border: 'border-green-500/60',  bg: 'bg-green-500/10',  text: 'text-green-400',  btn: 'border-green-400 text-green-400 hover:bg-green-400/20' },
  purple: { border: 'border-purple-500/60', bg: 'bg-purple-500/10', text: 'text-purple-400', btn: 'border-purple-400 text-purple-400 hover:bg-purple-400/20' },
};

const QTY_PRESETS = [1, 5, 10, 25];

function formatRp(n) {
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `Rp${(n / 1e9).toFixed(1)}M`;
  if (n >= 1e6)  return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString('id')}`;
}

export default function TycoonWorld() {
  const { balance, realAssets, plots, buyRealAsset, upgradeRealAsset, addFloatingText, getLandStats, luxuryItems } = useGameStore();
  const [cat, setCat] = useState('Semua');
  const [buyQty, setBuyQty] = useState(1);
  const [toast, setToast] = useState(null);
  const containerRef = useRef(null);

  const { totalCapacity, usedCapacity, freeCapacity } = getLandStats();
  const landPct = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  // Helper: get owned info for land-based assets from plots
  const getPlotOwned = (assetId) => {
    const allSlots = plots.flatMap(p => p.slots).filter(s => s.assetId === assetId);
    if (allSlots.length === 0) return null;
    const qty = allSlots.reduce((s, sl) => s + (sl.qty ?? 1), 0);
    const level = allSlots[0]?.level ?? 1;
    return { qty, level };
  };

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuy = (assetId, qty, e) => {
    const res = buyRealAsset(assetId, qty);
    showToast(res.msg, res.success);
    if (res.success && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      addFloatingText(res.msg, rect.left + rect.width / 2, rect.top);
    }
  };

  const handleUpgrade = (assetId, e) => {
    const res = upgradeRealAsset(assetId);
    showToast(res.msg, res.success);
    if (res.success && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      addFloatingText(res.msg, rect.left + rect.width / 2, rect.top);
    }
  };

  const filtered = cat === 'Semua' ? REAL_ASSETS : REAL_ASSETS.filter(a => a.category === cat);

  return (
    <div className="flex flex-col gap-3 h-full font-mono">
      <div className="flex items-center justify-between">
        <div className="text-amber-400 text-xs tracking-widest">▶ BELI ASET</div>
        <div className="text-xs text-green-400">Cash: {formatRp(balance)}</div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 text-xs px-3 py-1 rounded-full border transition-all
              ${cat === c ? 'border-amber-400 bg-amber-400/20 text-amber-400' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Buy Qty Selector */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 text-xs">BELI:</span>
        {QTY_PRESETS.map(q => (
          <button key={q} onClick={() => setBuyQty(q)}
            className={`text-xs px-2.5 py-1 rounded border transition-all
              ${buyQty === q ? 'border-amber-400 bg-amber-400/20 text-amber-400' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}>
            x{q}
          </button>
        ))}
        <input
          type="number" min={1} value={buyQty}
          onChange={e => setBuyQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-14 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-amber-400 outline-none focus:border-amber-400"
        />
      </div>

      {/* Land Capacity Bar */}
      <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-amber-400">🟫 KAPASITAS TANAH</span>
          <span className={freeCapacity <= 0 && totalCapacity > 0 ? 'text-red-400' : 'text-zinc-400'}>
            {usedCapacity} / {totalCapacity} poin
            {totalCapacity === 0 && <span className="text-red-400 ml-1">— Beli tanah dulu!</span>}
          </span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${landPct >= 100 ? 'bg-red-500' : landPct >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(landPct, 100)}%` }}
          />
        </div>
        <div className="text-xs text-zinc-600 mt-1">
          Sisa: <span className={freeCapacity > 0 ? 'text-green-400' : 'text-red-400'}>{freeCapacity} poin</span>
          {' · '}Tiap kavling = 6 poin kapasitas
        </div>
      </div>

      {/* Asset List */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1" ref={containerRef}>
        {filtered.map(def => {
          // Get owned data from correct source
          const isLuxury = def.isLuxury;
          const luxuryOwned = isLuxury && luxuryItems.includes(def.id);
          const ownedRaw = isLuxury ? null
            : def.landCost > 0 || def.id === 'tanah'
            ? (def.id === 'tanah' ? { qty: plots.length, level: 1 } : getPlotOwned(def.id))
            : realAssets[def.id];
          const qty = luxuryOwned ? 1 : (ownedRaw?.qty ?? 0);
          const level = ownedRaw?.level ?? 1;
          const isOwned = luxuryOwned || qty > 0;
          const isMaxed = isLuxury ? luxuryOwned : (isOwned && level >= def.maxLevel);
          const buyCost = def.baseCost * buyQty;
          const upgradeCost = isOwned
            ? Math.floor(def.baseCost * Math.pow(def.upgradeCostMultiplier, level) * qty)
            : 0;
          const canAffordBuy = balance >= buyCost;
          const canAffordUpgrade = balance >= upgradeCost;
          const currentIncome = isOwned && def.incomePerSec
            ? def.incomePerSec * Math.pow(def.levelMultiplier, level - 1) * qty
            : 0;
          const c = COLOR_MAP[def.color] || COLOR_MAP.amber;

          return (
            <div key={def.id}
              className={`border rounded-lg p-3 transition-all ${c.border} ${isOwned ? c.bg : 'bg-zinc-900'} ${!canAffordBuy && !isOwned ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-3">

                {/* Icon + qty badge */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="relative">
                    <span className="text-3xl" style={{ filter: isOwned ? 'drop-shadow(0 0 8px currentColor)' : 'grayscale(0.5)' }}>
                      {def.icon}
                    </span>
                    {qty > 0 && (
                      <span className={`absolute -top-1 -right-2 text-xs font-bold px-1 rounded-full border ${c.border} ${c.text} bg-black`}
                        style={{ fontSize: 9, minWidth: 16, textAlign: 'center' }}>
                        {qty}
                      </span>
                    )}
                  </div>
                  {/* Level dots */}
                  {isOwned && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: def.maxLevel }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < level ? 'bg-amber-400' : 'bg-zinc-700'}`} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${isOwned ? c.text : 'text-zinc-300'}`}>{def.name}</span>
                    <span className="text-xs text-zinc-600 border border-zinc-700 px-1.5 rounded">{def.category}</span>
                    {isOwned && (
                      <span className={`text-xs border px-1.5 rounded ${c.border} ${c.text}`}>
                        {qty}x · Lv.{level}{isMaxed ? ' MAX' : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5">{def.desc}</div>

                  {def.incomePerSec > 0 && (
                    <div className="text-xs mt-1">
                      {isOwned ? (
                        <span className="text-green-400">
                          +{formatRp(currentIncome)}/s total
                          <span className="text-zinc-600 ml-1">({formatRp(def.incomePerSec * Math.pow(def.levelMultiplier, level - 1))}/s per unit)</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">+{formatRp(def.incomePerSec)}/s per unit</span>
                      )}
                    </div>
                  )}
                  {def.landCost > 0 && (
                    <div className="text-xs mt-1 flex items-center gap-1">
                      <span className="text-zinc-600">🟫</span>
                      <span className={freeCapacity >= def.landCost * buyQty ? 'text-zinc-500' : 'text-red-400'}>
                        {def.landCost} poin/unit · butuh {def.landCost * buyQty} untuk x{buyQty}
                      </span>
                    </div>
                  )}
                  {def.landCapacity > 0 && (
                    <div className="text-xs mt-1 text-amber-400">+{def.landCapacity} kapasitas per kavling</div>
                  )}
                  {def.xpBonus && (
                    <div className="text-xs text-purple-400 mt-1">+{def.xpBonus.toLocaleString()} XP per unit</div>
                  )}                </div>

                {/* Buttons */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  {/* Buy button */}
                  <button
                    onClick={(e) => handleBuy(def.id, buyQty, e)}
                    disabled={!canAffordBuy}
                    className={`border rounded px-2.5 py-1 text-xs font-bold transition-all active:scale-95
                      ${canAffordBuy ? c.btn : 'border-zinc-700 text-zinc-600 cursor-not-allowed'}`}>
                    🛒 x{buyQty}
                  </button>
                  <span className={`text-xs ${canAffordBuy ? c.text : 'text-zinc-600'}`}>
                    {formatRp(buyCost)}
                  </span>

                  {/* Upgrade button (only if owned and not maxed) */}
                  {isOwned && !isMaxed && (
                    <>
                      <button
                        onClick={(e) => handleUpgrade(def.id, e)}
                        disabled={!canAffordUpgrade}
                        className={`border rounded px-2.5 py-1 text-xs font-bold transition-all active:scale-95
                          ${canAffordUpgrade ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/20' : 'border-zinc-700 text-zinc-600 cursor-not-allowed'}`}>
                        ⬆ LV.{level + 1}
                      </button>
                      <span className={`text-xs ${canAffordUpgrade ? 'text-yellow-400' : 'text-zinc-600'}`}>
                        {formatRp(upgradeCost)}
                      </span>
                    </>
                  )}
                  {isMaxed && (
                    <span className="text-amber-400 text-xs border border-amber-400/30 px-2 py-1 rounded">✓ MAX</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border font-mono text-sm font-bold whitespace-nowrap
          ${toast.ok ? 'bg-green-900 border-green-500 text-green-300' : 'bg-red-900 border-red-500 text-red-300'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
