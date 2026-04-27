'use client';
import { useGameStore } from '@/store/gameStore';

export default function FloatingTexts() {
  const { floatingTexts } = useGameStore();

  return (
    <>
      {floatingTexts.map(f => (
        <div
          key={f.id}
          className="fixed z-[100] pointer-events-none font-mono font-bold text-green-400 text-sm"
          style={{
            left: f.x,
            top: f.y,
            transform: 'translateX(-50%)',
            animation: 'floatUp 1.5s ease-out forwards',
            textShadow: '0 0 10px #4ade80',
          }}
        >
          {f.text}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
        }
      `}</style>
    </>
  );
}
