'use client';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Terminal from '@/components/Terminal';
import NewsFeed from '@/components/NewsFeed';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import AIScout from '@/components/AIScout';
import HQView from '@/components/HQView';
import UpgradeShop from '@/components/UpgradeShop';
import TycoonWorld from '@/components/TycoonWorld';
import TickerTape from '@/components/TickerTape';
import FloatingTexts from '@/components/FloatingTexts';
import StartScreen from '@/components/StartScreen';

const TABS = [
  { id: 'hq',       label: '🌍',  name: 'DUNIA'       },
  { id: 'world',    label: '🛒',  name: 'BELI ASET'   },
  { id: 'terminal', label: '📊',  name: 'PASAR'       },
  { id: 'upgrade',  label: '⚡',  name: 'UPGRADE'     },
  { id: 'news',     label: '📡',  name: 'BERITA'      },
  { id: 'whatif',   label: '🔮',  name: 'SIMULASI'    },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('hq');
  const [time, setTime] = useState('');
  const { tick, triggerNews, level, pendingIncome, getPassiveIncome, saveToSlot, currentSlot, getSlotMeta, exportSave } = useGameStore();
  const [showSave, setShowSave] = useState(false);
  const [saveToast, setSaveToast] = useState(null);
  const [showScout, setShowScout] = useState(false);

  const handleSave = (slot) => {
    saveToSlot(slot);
    setSaveToast(`✅ Tersimpan di Slot ${slot + 1}`);
    setTimeout(() => setSaveToast(null), 2000);
    setShowSave(false);
  };

  // Clock
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('id', { hour12: false }));
    }, 1000);
    return () => clearInterval(iv);
  }, [started]);

  // Game tick
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => tick(), 1000);
    return () => clearInterval(iv);
  }, [started, tick]);

  // Auto news
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => triggerNews(), 25000);
    return () => clearInterval(iv);
  }, [started, triggerNews]);

  // Auto-save every 30s
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => saveToSlot(currentSlot), 30000);
    return () => clearInterval(iv);
  }, [started, saveToSlot, currentSlot]);

  // Save on tab close
  useEffect(() => {
    if (!started || currentSlot === null) return;
    const handler = () => saveToSlot(currentSlot);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [started, saveToSlot, currentSlot]);

  const hasPending = pendingIncome >= 1;
  const passiveIncome = getPassiveIncome();

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-amber-400 font-mono flex flex-col overflow-hidden">
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-40"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)' }} />

      <FloatingTexts />

      {/* Header */}
      <header className="border-b border-amber-400/30 px-4 py-2 flex items-center justify-between bg-zinc-950 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setStarted(false)}
            className="text-zinc-300 text-sm border border-zinc-600 hover:border-zinc-400 hover:text-white transition-colors px-2 py-1 rounded"
            title="Kembali ke menu">
            ← MENU
          </button>
          <span className="text-amber-400 font-bold text-xl tracking-widest" style={{ textShadow: '0 0 10px #f59e0b' }}>
            STUCKIE
          </span>
          <span className="text-green-400 text-xs animate-pulse">●</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {passiveIncome > 0 && (
            <span className="text-green-400 hidden sm:block">
              +{passiveIncome >= 1000 ? `${(passiveIncome/1000).toFixed(1)}k` : Math.floor(passiveIncome)}/s
            </span>
          )}
          <span className="border border-cyan-400/50 text-cyan-400 px-2 py-0.5 rounded">LVL {level}</span>
          <span className="text-zinc-500 hidden sm:block">{time}</span>
          <button onClick={() => setShowSave(true)}
            className="text-xs border border-zinc-700 text-zinc-500 px-2 py-0.5 rounded hover:border-amber-400 hover:text-amber-400 transition-colors">
            💾 SIMPAN
          </button>
          <button
            onClick={() => {
              if (currentSlot === null) { setShowSave(true); return; }
              const ok = exportSave(currentSlot);
              if (ok) { setSaveToast('📤 Save diexport!'); setTimeout(() => setSaveToast(null), 2000); }
            }}
            className="text-xs border border-zinc-700 text-zinc-500 px-2 py-0.5 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            title="Export save ke file .txt"
          >
            📤
          </button>
        </div>
      </header>

      {/* Ticker */}
      <TickerTape />

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 126px)' }}>
          {activeTab === 'hq'       && <HQView />}
          {activeTab === 'world'    && <TycoonWorld />}
          {activeTab === 'terminal' && <Terminal />}
          {activeTab === 'upgrade'  && <UpgradeShop />}
          {activeTab === 'news'     && <NewsFeed />}
          {activeTab === 'whatif'   && <WhatIfSimulator />}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="border-t border-zinc-800 bg-zinc-950 shrink-0">
        <div className="flex">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 px-0.5 text-xs transition-all relative
                ${activeTab === tab.id ? 'text-amber-400 bg-amber-400/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {tab.id === 'hq' && hasPending && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
              )}
              <span className="text-base leading-none">{tab.label}</span>
              <span className="text-xs mt-0.5 leading-none" style={{ fontSize: '9px' }}>{tab.name}</span>
              {activeTab === tab.id && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      </nav>
      {/* Save Modal */}
      {showSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 font-mono px-4">
          <div className="w-full max-w-sm border border-amber-400/50 rounded-lg bg-zinc-950 p-4">
            <div className="text-amber-400 text-xs tracking-widest mb-3">▶ SIMPAN KE SLOT</div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }, (_, i) => {
                const meta = getSlotMeta(i);
                const isActive = currentSlot === i;
                return (
                  <div key={i}
                    className={`flex items-center justify-between px-3 py-2 border rounded text-xs transition-all cursor-pointer active:scale-95
                      ${isActive ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                    onClick={() => handleSave(i)}>
                    <span className="font-bold">SLOT {i + 1}{isActive ? ' (aktif)' : ''}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">
                        {meta ? `LVL ${meta.level} · ${new Date(meta.savedAt).toLocaleDateString('id')}` : 'Kosong'}
                      </span>
                      {meta && (
                        <button onClick={(e) => { e.stopPropagation(); exportSave(i); setSaveToast('📤 File didownload!'); setTimeout(() => setSaveToast(null), 2000); }}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors px-1 text-base"
                          title="Export ke .txt">
                          📤
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowSave(false)}
              className="w-full mt-3 py-2 border border-zinc-700 text-zinc-500 text-xs rounded hover:bg-zinc-800 transition-colors">
              BATAL
            </button>
          </div>
        </div>
      )}

      {/* Save toast */}
      {saveToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border border-green-500 bg-green-900 font-mono text-sm text-green-300">
          {saveToast}
        </div>
      )}

      {/* AI Scout floating button */}
      <button
        onClick={() => setShowScout(s => !s)}
        className="fixed bottom-20 right-4 z-[60] w-12 h-12 rounded-full border-2 border-cyan-400 bg-zinc-950 text-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: showScout ? '0 0 20px #22d3ee88' : '0 0 10px #22d3ee44' }}
        title="AI Scout"
      >
        🤖
      </button>

      {/* AI Scout popup — kiri dari tombol, tidak terpotong */}
      {showScout && (
        <div className="fixed z-[60] w-96 max-w-[calc(100vw-2rem)] h-[480px] border border-cyan-400/50 rounded-xl bg-zinc-950 shadow-2xl flex flex-col overflow-hidden"
          style={{
            bottom: 64,
            right: 64,
            boxShadow: '0 0 30px rgba(34,211,238,0.15)',
          }}>
          {/* Popup header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="text-cyan-400 font-mono text-xs font-bold tracking-widest">AI SCOUT</span>
            </div>
            <button onClick={() => setShowScout(false)}
              className="text-zinc-500 hover:text-white transition-colors text-lg px-1">✕</button>
          </div>
          {/* Chat content */}
          <div className="flex-1 overflow-hidden p-3">
            <AIScout />
          </div>
        </div>
      )}
    </div>
  );
}
