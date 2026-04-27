'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MiniChart from './MiniChart';

const TYPE_COLOR = {
  'Saham': 'text-amber-400 border-amber-400',
  'SBN': 'text-green-400 border-green-400',
  'Reksa Dana': 'text-cyan-400 border-cyan-400',
};

const TYPE_BG = {
  'Saham': 'bg-amber-400/5',
  'SBN': 'bg-green-400/5',
  'Reksa Dana': 'bg-cyan-400/5',
};

export default function Terminal() {
  const { marketAssets: assets, portfolio, priceHistory, buyMarketAsset: buyAsset, sellMarketAsset: sellAsset, balance, getPassiveIncome } = useGameStore();
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  const selected = selectedId ? assets.find(a => a.id === selectedId) ?? null : null;

  const showToast = (msg, ok) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuy = () => {
    if (!selected) return;
    const res = buyAsset(selected.id, qty);
    showToast(res.msg, res.success);
    if (res.success) setSelectedId(null);
  };

  const handleSell = () => {
    if (!selected) return;
    const res = sellAsset(selected.id, qty);
    showToast(res.msg, res.success);
    if (res.success) setSelectedId(null);
  };

  const getHolding = (id) => portfolio.find(p => p.assetId === id);
  const passiveIncome = getPassiveIncome();

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div className="text-amber-400 font-mono text-xs tracking-widest">
          ▶ MARKET TERMINAL
        </div>
        <div className="text-xs text-zinc-500">
          Cash: <span className="text-green-400">Rp{balance.toLocaleString('id')}</span>
        </div>
      </div>

      {passiveIncome > 0 && (
        <div className="text-xs text-center text-green-400/70 border border-green-400/20 rounded py-1 bg-green-400/5">
          ⚡ Portfolio menghasilkan <span className="text-green-400 font-bold">+Rp{Math.floor(passiveIncome).toLocaleString('id')}/detik</span> — klik COLLECT di HQ!
        </div>
      )}

      {/* Asset List */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
        {assets.map(asset => {
          const holding = getHolding(asset.id);
          const history = priceHistory[asset.id] || [];
          const isUp = asset.change >= 0;
          const colorClass = TYPE_COLOR[asset.type] || 'text-amber-400 border-amber-400';
          const bgClass = TYPE_BG[asset.type] || '';

          return (
            <button
              key={asset.id}
              onClick={() => { setSelectedId(asset.id); setQty(1); }}
              className={`w-full text-left border rounded p-2.5 transition-all font-mono
                ${selectedId === asset.id
                  ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                  : `border-zinc-700 ${bgClass} hover:border-zinc-500 hover:scale-[1.005]`
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs border px-1.5 py-0.5 rounded font-bold ${colorClass}`}>{asset.type}</span>
                  <span className="text-white text-sm font-bold">{asset.id}</span>
                  {holding && (
                    <span className="text-xs bg-amber-400/20 text-amber-300 px-1.5 rounded-full border border-amber-400/30">
                      {holding.qty} lot
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <MiniChart history={history} color={isUp ? '#4ade80' : '#f87171'} />
                  <div className="text-right min-w-[90px]">
                    <div className="text-white text-sm font-bold">Rp{asset.price.toLocaleString('id')}</div>
                    <div className={`text-xs font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {isUp ? '▲' : '▼'} {Math.abs(asset.change * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-zinc-500 text-xs truncate">{asset.description}</span>
                <span className="text-xs text-green-400/60 shrink-0 ml-2">+{asset.baseIncome} Rp/lot/s</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trade Panel */}
      {selected && (
        <div className="border border-amber-400 rounded p-3 bg-zinc-900 font-mono"
          style={{ boxShadow: '0 0 15px #f59e0b22' }}>
          <div className="text-amber-400 text-xs mb-2 font-bold">
            ⚡ TRADE: {selected.name}
            <span className="text-zinc-400 font-normal ml-2">@ Rp{selected.price.toLocaleString('id')}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zinc-400 text-xs">LOT:</span>
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="text-amber-400 border border-amber-400/50 w-7 h-7 rounded text-sm hover:bg-amber-400/20 active:scale-90 transition-all">−</button>
            <span className="text-white text-sm w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              className="text-amber-400 border border-amber-400/50 w-7 h-7 rounded text-sm hover:bg-amber-400/20 active:scale-90 transition-all">+</button>
            <button onClick={() => {
              const maxLot = Math.floor(balance / selected.price);
              setQty(Math.max(1, maxLot));
            }} className="text-xs border border-zinc-600 text-zinc-400 px-2 py-1 rounded hover:border-amber-400 hover:text-amber-400 transition-colors">
              MAX
            </button>
            <span className="text-zinc-400 text-xs ml-auto">
              = <span className="text-white font-bold">Rp{(selected.price * qty).toLocaleString('id')}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBuy}
              className="flex-1 bg-green-500/20 border-2 border-green-500 text-green-400 text-sm py-2 rounded font-bold hover:bg-green-500/40 active:scale-95 transition-all">
              ▲ BELI
            </button>
            <button onClick={handleSell}
              className="flex-1 bg-red-500/20 border-2 border-red-500 text-red-400 text-sm py-2 rounded font-bold hover:bg-red-500/40 active:scale-95 transition-all">
              ▼ JUAL
            </button>
            <button onClick={() => setSelectedId(null)}
              className="px-3 border border-zinc-600 text-zinc-400 text-sm py-2 rounded hover:bg-zinc-700 transition-colors">
              ✕
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border font-mono text-sm font-bold
          ${toast.ok ? 'bg-green-900 border-green-500 text-green-300' : 'bg-red-900 border-red-500 text-red-300'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
