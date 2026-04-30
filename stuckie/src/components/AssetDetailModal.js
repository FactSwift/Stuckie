"use client";

import { useState } from 'react';
import { useGameStore } from "../store/gameStore";

export default function AssetDetailModal({ asset: selectedAsset, onClose }) {
  const { buyMarketAsset } = useGameStore();
  const [qty, setQty] = useState(1);

  if (!selectedAsset) return null;

  const total = selectedAsset.price * qty;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-mono" onClick={onClose}>
      <div className="bg-black border border-amber-400 p-5 w-full max-w-sm text-amber-400 rounded-lg"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">{selectedAsset.id}</h2>
          <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">{selectedAsset.type}</span>
        </div>
        <p className="text-zinc-400 text-xs mb-3">{selectedAsset.name}</p>
        <div className="text-2xl font-bold text-green-400 mb-3">
          Rp{selectedAsset.price.toLocaleString('id')}
        </div>

        <p className="text-sm text-zinc-300 mb-3">{selectedAsset.description}</p>

        <div className="text-xs space-y-1 mb-4 border border-zinc-800 rounded p-3 bg-zinc-900">
          {selectedAsset.trend && <p>📊 Trend: <span className="text-cyan-400">{selectedAsset.trend}</span></p>}
          {selectedAsset.risk && <p>⚠️ Risk: <span className="text-red-400">{selectedAsset.risk}/5</span></p>}
          {selectedAsset.sentiment && <p>💬 Sentiment: <span className={selectedAsset.sentiment === 'bullish' ? 'text-green-400' : selectedAsset.sentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'}>{selectedAsset.sentiment.toUpperCase()}</span></p>}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-zinc-500 text-xs">LOT:</span>
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            className="border border-amber-400/50 text-amber-400 w-7 h-7 rounded hover:bg-amber-400/20 transition-all">−</button>
          <span className="text-white font-bold w-8 text-center">{qty}</span>
          <button onClick={() => setQty(q => q + 1)}
            className="border border-amber-400/50 text-amber-400 w-7 h-7 rounded hover:bg-amber-400/20 transition-all">+</button>
          <span className="text-zinc-400 text-xs ml-auto">= <span className="text-white font-bold">Rp{total.toLocaleString('id')}</span></span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 border border-zinc-600 text-zinc-400 py-2 text-xs rounded hover:bg-zinc-800 transition-colors" onClick={onClose}>
            BACK
          </button>
          <button
            className="flex-1 border border-green-400 text-green-400 py-2 text-xs rounded hover:bg-green-400/20 transition-colors"
            onClick={() => { buyMarketAsset(selectedAsset.id, qty); onClose(); }}
          >
            BUY {qty}x
          </button>
        </div>
      </div>
    </div>
  );
}