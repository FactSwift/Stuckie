'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore, SAVE_SLOTS, SAVE_KEY_PREFIX } from '@/store/gameStore';

function formatRp(n) {
  if (!n) return 'Rp0';
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `Rp${(n / 1e9).toFixed(1)}M`;
  if (n >= 1e6)  return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString('id')}`;
}

function formatDate(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleString('id', { dateStyle: 'short', timeStyle: 'short' });
}

function formatTime(secs) {
  if (!secs) return '0m';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

// Read slot meta directly from localStorage — no Zustand dependency
function readSlotMeta(slot) {
  try {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
    if (!raw) return null;
    const json = decodeURIComponent(escape(atob(raw.trim())));
    const save = JSON.parse(json);
    return { savedAt: save.savedAt, balance: save.balance, level: save.level ?? 1, gameTime: save.gameTime ?? 0 };
  } catch { return null; }
}

function readAllSlots() {
  return Array.from({ length: SAVE_SLOTS }, (_, i) => readSlotMeta(i));
}

export default function StartScreen({ onStart }) {
  const { loadSlot, newGame, deleteSlot, exportSave, importSave } = useGameStore();
  const [slots, setSlots] = useState(Array(SAVE_SLOTS).fill(null));
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmNew, setConfirmNew] = useState(null);
  const [blink, setBlink] = useState(true);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const importSlotRef = useRef(null);

  // Re-read slots every time component mounts or becomes visible
  useEffect(() => {
    setSlots(readAllSlots());
    const iv = setInterval(() => setBlink(b => !b), 600);
    return () => clearInterval(iv);
  }, []);

  // Also re-read when window regains focus
  useEffect(() => {
    const handler = () => setSlots(readAllSlots());
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  const refreshSlots = useCallback(() => setSlots(readAllSlots()), []);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const handleLoad = (slot) => { loadSlot(slot); onStart(); };

  const handleNew = (slot) => {
    if (slots[slot]) { setConfirmNew(slot); } else { newGame(slot); onStart(); }
  };

  const handleConfirmNew = () => { newGame(confirmNew); setConfirmNew(null); onStart(); };

  const handleDelete = (slot) => {
    deleteSlot(slot);
    refreshSlots();
    setConfirmDelete(null);
    showToast(`🗑 Slot ${slot + 1} dihapus`);
  };

  const handleExport = (slot) => {
    const ok = exportSave(slot);
    showToast(ok ? `📤 Slot ${slot + 1} diexport!` : 'Export gagal', ok);
  };

  const handleImportClick = (slot) => {
    importSlotRef.current = slot;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importSave(importSlotRef.current, ev.target.result);
      if (ok) {
        refreshSlots();
        showToast(`✅ Slot ${importSlotRef.current + 1} berhasil diimport!`);
      } else {
        showToast('❌ File tidak valid!', false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono relative overflow-hidden px-4">
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)' }} />
      {/* Grid bg */}
      <div className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-lg">
        <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleFileChange} />

        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-amber-400 font-bold tracking-[0.3em]"
            style={{ fontSize: 44, textShadow: '0 0 30px #f59e0b, 0 0 60px #f59e0b44' }}>
            STUCKIE
          </div>
          <div className="text-zinc-500 text-xs tracking-widest">FINANCIAL TYCOON SIMULATOR</div>
        </div>

        {/* Save Slots */}
        <div className="w-full flex flex-col gap-3">
          <div className="text-amber-400 text-xs tracking-widest text-center">▶ PILIH SAVE FILE</div>

          {slots.map((meta, i) => {
            const isConfirmingDelete = confirmDelete === i;
            const isConfirmingNew = confirmNew === i;

            return (
              <div key={i} className={`border rounded-lg p-3 transition-all
                ${meta ? 'border-amber-400/40 bg-zinc-900' : 'border-zinc-700 bg-zinc-950'}`}>

                {/* Slot header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-xs tracking-widest">SLOT {i + 1}</span>
                  {meta && !isConfirmingDelete && !isConfirmingNew && (
                    <div className="flex gap-1">
                      <button onClick={() => handleExport(i)}
                        className="text-cyan-400 text-base hover:text-cyan-300 transition-colors px-2 py-1 rounded hover:bg-cyan-400/10"
                        title="Export ke .txt">
                        📤
                      </button>
                      <button onClick={() => setConfirmDelete(i)}
                        className="text-red-400 text-base hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-400/10"
                        title="Hapus save">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                {/* Confirm delete */}
                {isConfirmingDelete && (
                  <div className="flex flex-col gap-2">
                    <div className="text-red-400 text-xs text-center">Hapus save ini permanen?</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(i)}
                        className="flex-1 py-1.5 border border-red-500 text-red-400 text-xs rounded hover:bg-red-500/20 active:scale-95 transition-all">
                        HAPUS
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        className="flex-1 py-1.5 border border-zinc-600 text-zinc-400 text-xs rounded hover:bg-zinc-700 active:scale-95 transition-all">
                        BATAL
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm overwrite */}
                {isConfirmingNew && (
                  <div className="flex flex-col gap-2">
                    <div className="text-yellow-400 text-xs text-center">Timpa save yang ada?</div>
                    <div className="flex gap-2">
                      <button onClick={handleConfirmNew}
                        className="flex-1 py-1.5 border border-yellow-500 text-yellow-400 text-xs rounded hover:bg-yellow-500/20 active:scale-95 transition-all">
                        TIMPA
                      </button>
                      <button onClick={() => setConfirmNew(null)}
                        className="flex-1 py-1.5 border border-zinc-600 text-zinc-400 text-xs rounded hover:bg-zinc-700 active:scale-95 transition-all">
                        BATAL
                      </button>
                    </div>
                  </div>
                )}

                {/* Normal slot view */}
                {!isConfirmingDelete && !isConfirmingNew && (
                  meta ? (
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-zinc-600">BALANCE</div>
                          <div className="text-amber-400 font-bold">{formatRp(meta.balance)}</div>
                        </div>
                        <div>
                          <div className="text-zinc-600">LEVEL</div>
                          <div className="text-cyan-400 font-bold">LVL {meta.level}</div>
                        </div>
                        <div>
                          <div className="text-zinc-600">WAKTU</div>
                          <div className="text-zinc-400">{formatTime(meta.gameTime)}</div>
                        </div>
                      </div>
                      <div className="text-zinc-600 text-xs">Disimpan: {formatDate(meta.savedAt)}</div>
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => handleLoad(i)}
                          className="flex-1 py-2 border-2 border-amber-400 text-amber-400 text-xs font-bold rounded hover:bg-amber-400/20 active:scale-95 transition-all"
                          style={{ boxShadow: '0 0 10px #f59e0b22' }}>
                          ▶ LANJUTKAN
                        </button>
                        <button onClick={() => handleNew(i)}
                          className="px-3 py-2 border border-zinc-600 text-zinc-400 text-xs rounded hover:border-zinc-400 hover:text-zinc-200 active:scale-95 transition-all">
                          BARU
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => handleNew(i)}
                        className="flex-1 py-3 border border-dashed border-zinc-700 text-zinc-500 text-xs rounded hover:border-amber-400/50 hover:text-amber-400/70 active:scale-95 transition-all">
                        + GAME BARU
                      </button>
                      <button onClick={() => handleImportClick(i)}
                        className="px-3 py-3 border border-dashed border-zinc-700 text-zinc-500 text-xs rounded hover:border-cyan-400/50 hover:text-cyan-400/70 active:scale-95 transition-all"
                        title="Import dari file .txt">
                        📥 IMPORT
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-zinc-700 text-xs text-center">
          <span className={blink ? 'opacity-100' : 'opacity-0'}>█</span>
          {' '}STUCKIE v0.1.0 · DICODING HACKATHON 2025{' '}
          <span className={blink ? 'opacity-100' : 'opacity-0'}>█</span>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border font-mono text-xs whitespace-nowrap
          ${toast.ok !== false ? 'border-green-500 bg-green-900 text-green-300' : 'border-red-500 bg-red-900 text-red-300'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
