'use client';
import { useState } from 'react';

function calcCompound(monthly, years, rate) {
  const months = years * 12;
  const r = rate / 12 / 100;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r);
}

const PRESETS = [
  { label: '☕ Kopi Harian', amount: 50000, desc: 'Rp50rb/hari = Rp1.5jt/bulan' },
  { label: '🎮 Game Pass', amount: 200000, desc: 'Rp200rb/bulan' },
  { label: '🚗 Bensin', amount: 500000, desc: 'Rp500rb/bulan' },
];

export default function WhatIfSimulator() {
  const [monthly, setMonthly] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(8);

  const result = calcCompound(monthly, years, rate);
  const totalInvested = monthly * years * 12;
  const gain = result - totalInvested;

  const bars = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    value: calcCompound(monthly, i + 1, rate),
  }));
  const maxVal = bars[bars.length - 1]?.value || 1;

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="text-amber-400 text-xs tracking-widest">▶ SIMULATOR WHAT-IF</div>

      {/* Presets */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setMonthly(p.amount)}
            className="text-xs border border-zinc-600 text-zinc-400 px-2 py-1 rounded hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
          <div className="text-zinc-500 text-xs mb-1">INVEST/BULAN</div>
          <input
            type="number"
            value={monthly}
            onChange={e => setMonthly(Number(e.target.value))}
            className="w-full bg-transparent text-amber-400 text-sm outline-none"
          />
        </div>
        <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
          <div className="text-zinc-500 text-xs mb-1">TAHUN</div>
          <input
            type="number"
            value={years}
            min={1} max={30}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full bg-transparent text-amber-400 text-sm outline-none"
          />
        </div>
        <div className="border border-zinc-700 rounded p-2 bg-zinc-900">
          <div className="text-zinc-500 text-xs mb-1">RETURN %/TH</div>
          <input
            type="number"
            value={rate}
            min={1} max={30}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full bg-transparent text-amber-400 text-sm outline-none"
          />
        </div>
      </div>

      {/* Result */}
      <div className="border border-amber-400/50 rounded p-3 bg-zinc-900">
        <div className="text-zinc-400 text-xs">PROYEKSI {years} TAHUN</div>
        <div className="text-2xl text-amber-400 font-bold mt-1">
          Rp{Math.round(result).toLocaleString('id')}
        </div>
        <div className="flex gap-4 mt-1 text-xs">
          <span className="text-zinc-400">Modal: Rp{totalInvested.toLocaleString('id')}</span>
          <span className="text-green-400">Gain: +Rp{Math.round(gain).toLocaleString('id')}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex items-end gap-1 border border-zinc-800 rounded p-2 bg-zinc-900/50 overflow-hidden">
        {bars.map(b => (
          <div key={b.year} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-amber-400/70 rounded-t transition-all"
              style={{ height: `${(b.value / maxVal) * 100}%`, minHeight: 2 }}
            />
            {years <= 15 && (
              <span className="text-zinc-600 text-xs">{b.year}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
