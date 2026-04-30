'use client';
import { useGameStore } from '@/store/gameStore';
import SwipeCard from './SwipeCard';
import { AnimatePresence } from 'framer-motion';

export default function SwipeDeck() {
  const { marketAssets: assets, currentIndex, swipeLeft, swipeRight, resetDeck } = useGameStore();

  const currentAsset = assets[currentIndex];

  const handleSwipeLeft = () => {
    console.log('Swiped LEFT - Skipping asset:', currentAsset?.id);
    swipeLeft();
  };

  const handleSwipeRight = () => {
    console.log('Swiped RIGHT - Investigating asset:', currentAsset?.id);
    swipeRight(currentAsset);
  };

  if (!currentAsset) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 font-mono">
        <div className="text-5xl text-amber-400/30">▌</div>
        <p className="text-amber-400/50 text-sm tracking-widest">END OF MARKET</p>
        <p className="text-zinc-600 text-xs">No more assets to review</p>
        <button
          onClick={resetDeck}
          className="mt-4 px-6 py-2 border border-amber-400/50 text-amber-400/70 hover:text-amber-400 hover:border-amber-400 rounded text-xs tracking-widest transition-all"
        >
          RESET DECK
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
      <div className="text-xs text-zinc-600 font-mono tracking-widest">
        ASSET {currentIndex + 1} of {assets.length}
      </div>

      <AnimatePresence mode="wait">
        <SwipeCard
          key={currentAsset.id}
          asset={currentAsset}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </AnimatePresence>

      {/* Info footer */}
      <div className="text-xs text-zinc-700 font-mono text-center">
        Drag card left or right to continue
      </div>
    </div>
  );
}
