"use client";

import { useGameStore } from '@/store/gameStore';
import SwipeDeck from './SwipeDeck';
import PortfolioPanel from './PortfolioPanel';

export default function Terminal() {
  const balance = useGameStore((state) => state.balance);
  const passiveIncome = useGameStore((state) => state.getPassiveIncome());

  return (
    <div className="flex flex-col gap-3 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-amber-400 font-mono text-xs tracking-widest">
          ▶ TERMINAL PASAR
        </div>
        <div className="text-xs text-zinc-500">
          Kas: <span className="text-green-400">
            Rp{(balance ?? 0).toLocaleString('id')}
          </span>
        </div>
      </div>

      {/* Passive Income */}
      {passiveIncome > 0 && (
        <div className="text-xs text-center text-green-400/70 border border-green-400/20 rounded py-1 bg-green-400/5">
          ⚡ Portfolio menghasilkan{" "}
          <span className="text-green-400 font-bold">
            +Rp{Math.floor(passiveIncome).toLocaleString('id')}/detik
          </span>
        </div>
      )}

      {/* Swipe Deck */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <SwipeDeck />
      </div>

      {/* Portfolio Panel */}
      <PortfolioPanel />

    </div>
  );
}