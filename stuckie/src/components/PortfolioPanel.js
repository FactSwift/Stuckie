'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PortfolioPanel() {
  const [collapsed, setCollapsed] = useState(true);
  const { portfolio, marketAssets, sellMarketAsset } = useGameStore();

  // Build portfolio with current prices
  const portfolioWithPrices = portfolio
    .map(p => {
      console.log('Portfolio Item:', p);
      const asset = marketAssets.find(a => a.id === p.assetId);
      if (!asset) {
        console.warn('Asset not found for:', p.assetId);
        return null;
      }
      const currentPrice = asset.price ?? 0;
      const buyPrice = p.avgPrice ?? 0;
      const qty = p.qty ?? 1;
      const profit = (currentPrice - buyPrice) * qty;

      return {
        assetId: p.assetId,
        name: asset.name ?? 'Unknown',
        type: asset.type ?? 'Unknown',
        qty,
        buyPrice,
        currentPrice,
        profit,
      };
    })
    .filter(Boolean);

  const totalProfit = portfolioWithPrices.reduce((sum, p) => sum + (p.profit ?? 0), 0);

  const handleSell = (assetId) => {
    const holding = portfolio.find(p => p.assetId === assetId);
    if (holding) {
      sellMarketAsset(assetId, holding.qty);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80">
      {/* Collapsed Button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="bg-black border border-amber-400/60 text-amber-400 px-4 py-2 rounded text-xs tracking-widest hover:border-amber-400 hover:bg-amber-400/5 transition-all shadow-lg shadow-amber-400/10"
        >
          💼 Portfolio ({portfolioWithPrices.length})
        </button>
      )}

      {/* Expanded Panel */}
      {!collapsed && (
        <div className="bg-black border border-amber-400/60 rounded w-80 shadow-lg shadow-amber-400/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-amber-400/5 border-b border-amber-400/30 p-4">
            <div className="text-amber-400 text-xs tracking-widest font-bold">
              💼 PORTFOLIO
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-amber-400/60 hover:text-amber-400 text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {portfolioWithPrices.length === 0 ? (
              <div className="text-xs text-zinc-500 text-center py-4">
                No assets yet
              </div>
            ) : (
              <div className="space-y-3">
                {portfolioWithPrices.map(asset => (
                  <div
                    key={asset.assetId}
                    className="border border-zinc-700/50 rounded p-3 hover:border-amber-400/30 transition-colors"
                  >
                    {/* Asset Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-amber-400 text-xs font-bold">
                          {asset.name}
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {asset.type} × {asset.qty}
                        </div>
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          asset.profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {asset.profit >= 0 ? '+' : ''}
                        Rp{Math.floor(asset.profit ?? 0).toLocaleString('id')}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex items-center justify-between text-xs text-zinc-600 mb-3 gap-2">
                      <div>
                        Buy: <span className="text-zinc-400">Rp{(asset.buyPrice ?? 0).toLocaleString('id')}</span>
                      </div>
                      <div>
                        Now: <span className="text-amber-400">{(asset.currentPrice ?? 0).toLocaleString('id')}</span>
                      </div>
                    </div>

                    {/* Sell Button */}
                    <button
                      onClick={() => handleSell(asset.assetId)}
                      className="w-full text-xs py-1 border border-red-400/40 text-red-400/70 hover:text-red-400 hover:border-red-400 rounded transition-all hover:bg-red-400/5"
                    >
                      SELL ALL
                    </button>
                  </div>
                ))}

                {/* Total Profit */}
                <div className="border-t border-amber-400/20 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-500">Total P/L:</div>
                    <div
                      className={`text-xs font-bold ${
                        totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {totalProfit >= 0 ? '+' : ''}
                      Rp{Math.floor(totalProfit ?? 0).toLocaleString('id')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
