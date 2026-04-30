"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore, SAVE_SLOTS, SAVE_KEY_PREFIX } from "@/store/gameStore";

function formatRp(n) {
  if (!n) return "Rp0";
  if (n >= 1e12) return `Rp${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `Rp${(n / 1e9).toFixed(1)}M`;
  if (n >= 1e6) return `Rp${(n / 1e6).toFixed(1)}jt`;
  return `Rp${Math.floor(n).toLocaleString("id")}`;
}

function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("id", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatTime(secs) {
  if (!secs) return "0m";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}

function readSlotMeta(slot) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
    if (!raw) return null;
    const json = decodeURIComponent(escape(atob(raw.trim())));
    const save = JSON.parse(json);
    return {
      savedAt: save.savedAt,
      balance: save.balance,
      level: save.level ?? 1,
      gameTime: save.gameTime ?? 0,
    };
  } catch {
    return null;
  }
}

function readAllSlots() {
  if (typeof window === "undefined") return [];
  return Array.from({ length: SAVE_SLOTS }, (_, i) =>
    readSlotMeta(i)
  );
}

export default function StartScreen({ onStart }) {
  const { loadSlot, newGame, deleteSlot, exportSave, importSave } =
    useGameStore();

  const [slots, setSlots] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmNew, setConfirmNew] = useState(null);
  const [blink, setBlink] = useState(true);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const importSlotRef = useRef(null);

  useEffect(() => {
    setSlots(readAllSlots());
    const iv = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = () => setSlots(readAllSlots());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const refreshSlots = useCallback(
    () => setSlots(readAllSlots()),
    []
  );

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const handleLoad = (slot) => {
    loadSlot(slot);
    onStart();
  };

  const handleNew = (slot) => {
    if (slots[slot]) setConfirmNew(slot);
    else {
      newGame(slot);
      onStart();
    }
  };

  const handleConfirmNew = () => {
    newGame(confirmNew);
    setConfirmNew(null);
    onStart();
  };

  const handleDelete = (slot) => {
    deleteSlot(slot);
    refreshSlots();
    setConfirmDelete(null);
    showToast(`🗑 Slot ${slot + 1} dihapus`);
  };

  const handleExport = (slot) => {
    const ok = exportSave(slot);
    showToast(ok ? `📤 Slot ${slot + 1} diexport!` : "Export gagal", ok);
  };

  const handleImportClick = (slot) => {
    importSlotRef.current = slot;
    fileInputRef.current.value = "";
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
        showToast("❌ File tidak valid!", false);
      }
    };
    reader.readAsText(file);
  };

  if (!slots) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-amber-400 font-mono">
        Booting terminal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono px-4">
      <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleFileChange} />

      <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-lg">
        <div className="flex flex-col items-center gap-1">
          <div className="text-amber-400 font-bold tracking-[0.3em]"
            style={{ fontSize: 44, textShadow: '0 0 30px #f59e0b' }}>
            STUCKIE
          </div>
          <div className="text-zinc-500 text-xs tracking-widest">
            GAME TYCOON SIMULATOR KEUANGAN
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          {slots.map((meta, i) => (
            <div key={i} className={`border rounded-lg p-3 bg-zinc-950 transition-all
              ${meta ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-800'}`}>

              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-xs tracking-widest">SLOT {i + 1}</span>
                {meta && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleImportClick(i)}
                      className="text-xs border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                      title="Import save">
                      📥
                    </button>
                    <button onClick={() => handleExport(i)}
                      className="text-xs border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                      title="Export save">
                      📤
                    </button>
                    <button onClick={() => setConfirmDelete(i)}
                      className="text-xs border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded hover:border-red-400 hover:text-red-400 transition-colors"
                      title="Hapus save">
                      🗑
                    </button>
                  </div>
                )}
              </div>

              {meta ? (
                <>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-amber-400 font-bold text-lg">{formatRp(meta.balance)}</span>
                    <span className="text-zinc-600 text-xs">LVL {meta.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-600 mb-3">
                    <span>⏱ {formatTime(meta.gameTime)}</span>
                    <span>·</span>
                    <span>{formatDate(meta.savedAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleLoad(i)}
                      className="flex-1 border border-amber-400 text-amber-400 py-1.5 text-xs font-bold rounded hover:bg-amber-400/20 active:scale-95 transition-all">
                      ▶ LANJUT
                    </button>
                    <button onClick={() => handleNew(i)}
                      className="flex-1 border border-zinc-600 text-zinc-400 py-1.5 text-xs font-bold rounded hover:border-zinc-400 hover:text-zinc-200 active:scale-95 transition-all">
                      ↺ BARU
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => handleNew(i)}
                    className="flex-1 border border-dashed border-zinc-700 text-zinc-500 py-2.5 text-xs rounded hover:border-amber-400 hover:text-amber-400 active:scale-95 transition-all">
                    + GAME BARU
                  </button>
                  <button onClick={() => handleImportClick(i)}
                    className="border border-dashed border-zinc-700 text-zinc-500 px-3 py-2.5 text-xs rounded hover:border-cyan-400 hover:text-cyan-400 active:scale-95 transition-all"
                    title="Import save ke slot ini">
                    📥 IMPORT
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono px-4">
          <div className="w-full max-w-xs border border-red-500/50 rounded-lg bg-zinc-950 p-4">
            <div className="text-red-400 text-xs tracking-widest mb-2">⚠ HAPUS SAVE</div>
            <div className="text-zinc-400 text-xs mb-4">Yakin hapus Slot {confirmDelete + 1}? Data tidak bisa dikembalikan.</div>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 border border-red-500 text-red-400 py-1.5 text-xs rounded hover:bg-red-500/20 transition-colors">
                🗑 HAPUS
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-zinc-700 text-zinc-400 py-1.5 text-xs rounded hover:bg-zinc-800 transition-colors">
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm New Game Modal */}
      {confirmNew !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono px-4">
          <div className="w-full max-w-xs border border-amber-500/50 rounded-lg bg-zinc-950 p-4">
            <div className="text-amber-400 text-xs tracking-widest mb-2">⚠ GAME BARU</div>
            <div className="text-zinc-400 text-xs mb-4">Slot {confirmNew + 1} sudah ada save. Data lama akan tertimpa!</div>
            <div className="flex gap-2">
              <button onClick={handleConfirmNew}
                className="flex-1 border border-amber-400 text-amber-400 py-1.5 text-xs rounded hover:bg-amber-400/20 transition-colors">
                ✓ LANJUT
              </button>
              <button onClick={() => setConfirmNew(null)}
                className="flex-1 border border-zinc-700 text-zinc-400 py-1.5 text-xs rounded hover:bg-zinc-800 transition-colors">
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border font-mono text-sm whitespace-nowrap
          ${toast.ok ? 'bg-green-900 border-green-500 text-green-300' : 'bg-red-900 border-red-500 text-red-300'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}