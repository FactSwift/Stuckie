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

// 🔥 SAFE: only runs on client
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

  // 🔥 FIX: start with null (NO SSR mismatch)
  const [slots, setSlots] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmNew, setConfirmNew] = useState(null);
  const [blink, setBlink] = useState(true);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const importSlotRef = useRef(null);

  // 🔥 load AFTER mount
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
        showToast(
          `✅ Slot ${importSlotRef.current + 1} berhasil diimport!`
        );
      } else {
        showToast("❌ File tidak valid!", false);
      }
    };
    reader.readAsText(file);
  };

  // 🔥 CRITICAL: prevent hydration mismatch
  if (!slots) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-amber-400 font-mono">
        Booting terminal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono px-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="text-amber-400 text-4xl font-bold mb-6">
        STUCKIE
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        {slots.map((meta, i) => {
          const isConfirmingDelete = confirmDelete === i;
          const isConfirmingNew = confirmNew === i;

          return (
            <div
              key={i}
              className={`border rounded-lg p-3 transition-all
              ${
                meta
                  ? "border-amber-400/40 bg-zinc-900"
                  : "border-zinc-700 bg-zinc-950"
              }`}
            >
              <div className="text-xs text-zinc-400 mb-2">
                SLOT {i + 1}
              </div>

              {meta ? (
                <div className="flex flex-col gap-2 text-xs">
                  <div className="text-amber-400">
                    {formatRp(meta.balance)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(i)}
                      className="flex-1 border border-amber-400 py-1"
                    >
                      LANJUT
                    </button>
                    <button
                      onClick={() => handleNew(i)}
                      className="flex-1 border border-zinc-600 py-1"
                    >
                      BARU
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNew(i)}
                  className="w-full border border-dashed border-zinc-700 py-2 text-xs"
                >
                  + GAME BARU
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}