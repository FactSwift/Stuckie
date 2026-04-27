'use client';
import { useGameStore } from '@/store/gameStore';

const SENTIMENT_STYLE = {
  bullish: 'border-green-500 bg-green-900/20 text-green-300',
  bearish: 'border-red-500 bg-red-900/20 text-red-300',
  neutral: 'border-zinc-500 bg-zinc-800 text-zinc-300',
};

export default function NewsFeed() {
  const { news, activeNews, triggerNews, gameTime } = useGameStore();

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="flex items-center justify-between">
        <div className="text-amber-400 text-xs tracking-widest">▶ MARKET INTEL FEED</div>
        <span className="text-zinc-500 text-xs border border-zinc-700 px-2 py-0.5 rounded">T+{gameTime}s</span>
      </div>

      {/* Active News Banner */}
      {activeNews ? (
        <div className={`border-2 rounded p-3 text-sm ${SENTIMENT_STYLE[activeNews.sentiment]}`}
          style={{ boxShadow: activeNews.sentiment === 'bullish' ? '0 0 15px #4ade8033' : activeNews.sentiment === 'bearish' ? '0 0 15px #f8717133' : 'none' }}>
          <div className="font-bold text-base">{activeNews.headline}</div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {Object.entries(activeNews.impact).map(([type, val]) => (
              <span key={type} className={`text-xs border px-2 py-0.5 rounded ${val > 0 ? 'border-green-500/50 text-green-400' : val < 0 ? 'border-red-500/50 text-red-400' : 'border-zinc-600 text-zinc-400'}`}>
                {type}: {val > 0 ? '+' : ''}{(val * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded p-3 text-zinc-600 text-sm text-center">
          Pasar sedang tenang... untuk sekarang.
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={triggerNews}
        className="w-full border-2 border-amber-400 text-amber-400 text-sm py-3 rounded font-bold hover:bg-amber-400/20 active:scale-95 transition-all tracking-widest"
        style={{ boxShadow: '0 0 10px #f59e0b33' }}
      >
        ⚡ SIMULASI BERITA PASAR
      </button>

      <div className="text-zinc-600 text-xs text-center">
        Berita mempengaruhi harga semua aset secara real-time. Beli saat merah, jual saat hijau!
      </div>

      {/* News History */}
      <div className="text-amber-400 text-xs tracking-widest">▶ RIWAYAT BERITA</div>
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1">
        {news.length === 0 ? (
          <div className="text-zinc-700 text-xs text-center py-6 border border-zinc-800 rounded">
            Belum ada berita. Tekan tombol di atas!
          </div>
        ) : (
          news.map((item, i) => (
            <div key={i} className={`border rounded p-2 text-xs flex justify-between items-center gap-2
              ${item.sentiment === 'bullish' ? 'border-green-900 bg-green-900/10' :
                item.sentiment === 'bearish' ? 'border-red-900 bg-red-900/10' :
                'border-zinc-800 bg-zinc-900/50'}`}>
              <span className="text-zinc-300">{item.headline}</span>
              <span className="text-zinc-600 shrink-0">{item.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
