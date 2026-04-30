"use client";

import { useGameStore } from "../store/gameStore";

export default function AssetDetailModal() {
  const { selectedAsset, closeDetail, buyAsset } = useGameStore();

  if (!selectedAsset) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black border border-amber-400 p-6 w-full max-w-md text-amber-400">
        <h2 className="text-xl">{selectedAsset.name}</h2>
        <p className="mt-2">Rp {selectedAsset.price}</p>

        <p className="mt-3 text-sm opacity-70">
          {selectedAsset.description}
        </p>

        <div className="mt-4 text-sm">
          <p>📊 Trend: {selectedAsset.trend}</p>
          <p>⚠️ Risk: {selectedAsset.risk}</p>
          <p>💬 {selectedAsset.sentiment}</p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            className="flex-1 border border-amber-400 py-2"
            onClick={closeDetail}
          >
            BACK
          </button>

          <button
            className="flex-1 border border-green-400 text-green-400 py-2"
            onClick={() => {
              buyAsset(selectedAsset);   // 🔥 MASUKIN KE STORE
              closeDetail();             // lanjut ke next card
            }}
          >
            BUY
          </button>
        </div>
      </div>
    </div>
  );
}