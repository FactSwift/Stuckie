import { create } from 'zustand';

export const MARKET_ASSETS = [
  { id: 'BBCA', name: 'Bank BCA', type: 'Saham', price: 9500, change: 0, description: 'Blue chip perbankan terbesar.', baseIncome: 12 },
  { id: 'TLKM', name: 'Telkom Indonesia', type: 'Saham', price: 3200, change: 0, description: 'BUMN telekomunikasi.', baseIncome: 8 },
  { id: 'GOTO', name: 'GoTo Group', type: 'Saham', price: 71, change: 0, description: 'Startup unicorn. High risk.', baseIncome: 3 },
  { id: 'SBN001', name: 'SBN ORI023', type: 'SBN', price: 1000000, change: 0, description: 'Obligasi negara. Dijamin pemerintah.', baseIncome: 50 },
  { id: 'RDPU', name: 'RD Pasar Uang', type: 'Reksa Dana', price: 1500, change: 0, description: 'Risiko rendah. ~5% p.a.', baseIncome: 5 },
  { id: 'RDSH', name: 'RD Saham', type: 'Reksa Dana', price: 2800, change: 0, description: 'Potensi return tinggi.', baseIncome: 9 },
];

// Real-world purchasable assets (tycoon style)
export const REAL_ASSETS = [
  // === TANAH (prerequisite) ===
  {
    id: 'tanah', category: 'Tanah', name: 'Kavling Tanah', icon: '🟫',
    desc: 'Kavling 200m². Kapasitas 6 poin untuk dibangun.',
    baseCost: 50000000, incomePerSec: 0, maxLevel: 1,
    levelMultiplier: 1, upgradeCostMultiplier: 1,
    landCost: 0, // tanah itu sendiri tidak butuh tanah
    landCapacity: 6, // tiap kavling kasih 6 kapasitas
    color: 'amber',
  },

  // === PROPERTI ===
  {
    id: 'kos', category: 'Properti', name: 'Kos-kosan', icon: '🏠',
    desc: 'Kos 6 kamar di pinggir kampus. Selalu penuh!',
    baseCost: 150000000, incomePerSec: 800, maxLevel: 5,
    levelMultiplier: 1.5, upgradeCostMultiplier: 2.2,
    landCost: 1, color: 'amber',
  },
  {
    id: 'ruko', category: 'Properti', name: 'Ruko Strategis', icon: '🏪',
    desc: 'Ruko di pinggir jalan raya. Disewakan ke tenant.',
    baseCost: 500000000, incomePerSec: 2500, maxLevel: 5,
    levelMultiplier: 1.5, upgradeCostMultiplier: 2.2,
    landCost: 1, color: 'amber',
  },
  {
    id: 'apartemen', category: 'Properti', name: 'Apartemen', icon: '🏢',
    desc: 'Apartemen studio di pusat kota. ROI tinggi.',
    baseCost: 1200000000, incomePerSec: 7000, maxLevel: 5,
    levelMultiplier: 1.5, upgradeCostMultiplier: 2.2,
    landCost: 2, color: 'amber',
  },
  {
    id: 'mall', category: 'Properti', name: 'Mall', icon: '🏬',
    desc: 'Pusat perbelanjaan dengan ratusan tenant.',
    baseCost: 10000000000, incomePerSec: 55000, maxLevel: 5,
    levelMultiplier: 1.5, upgradeCostMultiplier: 2.2,
    landCost: 4, color: 'amber',
  },
  {
    id: 'gedung', category: 'Properti', name: 'Gedung Perkantoran', icon: '🏙️',
    desc: 'Gedung 20 lantai di CBD Jakarta.',
    baseCost: 50000000000, incomePerSec: 300000, maxLevel: 5,
    levelMultiplier: 1.5, upgradeCostMultiplier: 2.2,
    landCost: 3, color: 'amber',
  },

  // === KENDARAAN (tidak butuh tanah) ===
  {
    id: 'motor', category: 'Kendaraan', name: 'Motor Ojol', icon: '🛵',
    desc: 'Armada ojek online. Passive income dari driver.',
    baseCost: 25000000, incomePerSec: 120, maxLevel: 5,
    levelMultiplier: 1.4, upgradeCostMultiplier: 2.0,
    landCost: 0, color: 'cyan',
  },
  {
    id: 'mobil', category: 'Kendaraan', name: 'Mobil Rental', icon: '🚗',
    desc: 'Armada rental mobil. Disewakan harian.',
    baseCost: 200000000, incomePerSec: 900, maxLevel: 5,
    levelMultiplier: 1.4, upgradeCostMultiplier: 2.0,
    landCost: 0, color: 'cyan',
  },
  {
    id: 'bus', category: 'Kendaraan', name: 'Bus Pariwisata', icon: '🚌',
    desc: 'Armada bus wisata. Booking penuh tiap weekend.',
    baseCost: 800000000, incomePerSec: 4000, maxLevel: 5,
    levelMultiplier: 1.4, upgradeCostMultiplier: 2.0,
    landCost: 0, color: 'cyan',
  },
  {
    id: 'kapal', category: 'Kendaraan', name: 'Kapal Kargo', icon: '🚢',
    desc: 'Kapal pengiriman barang antar pulau.',
    baseCost: 8000000000, incomePerSec: 40000, maxLevel: 5,
    levelMultiplier: 1.4, upgradeCostMultiplier: 2.0,
    landCost: 0, color: 'cyan',
  },
  {
    id: 'pesawat', category: 'Kendaraan', name: 'Pesawat Charter', icon: '✈️',
    desc: 'Armada pesawat charter VIP.',
    baseCost: 80000000000, incomePerSec: 500000, maxLevel: 5,
    levelMultiplier: 1.4, upgradeCostMultiplier: 2.0,
    landCost: 0, color: 'cyan',
  },

  // === BISNIS ===
  {
    id: 'warung', category: 'Bisnis', name: 'Warung Makan', icon: '🍜',
    desc: 'Warung nasi padang. Antrian panjang tiap hari.',
    baseCost: 10000000, incomePerSec: 60, maxLevel: 5,
    levelMultiplier: 1.6, upgradeCostMultiplier: 2.5,
    landCost: 1, color: 'green',
  },
  {
    id: 'cafe', category: 'Bisnis', name: 'Cafe Kekinian', icon: '☕',
    desc: 'Cafe aesthetic yang viral di Instagram.',
    baseCost: 80000000, incomePerSec: 400, maxLevel: 5,
    levelMultiplier: 1.6, upgradeCostMultiplier: 2.5,
    landCost: 1, color: 'green',
  },
  {
    id: 'startup', category: 'Bisnis', name: 'Startup Tech', icon: '💻',
    desc: 'Startup SaaS B2B. MRR terus naik.',
    baseCost: 500000000, incomePerSec: 3000, maxLevel: 5,
    levelMultiplier: 1.6, upgradeCostMultiplier: 2.5,
    landCost: 2, color: 'green',
  },
  {
    id: 'pabrik', category: 'Bisnis', name: 'Pabrik Manufaktur', icon: '🏭',
    desc: 'Pabrik produksi barang konsumsi.',
    baseCost: 5000000000, incomePerSec: 28000, maxLevel: 5,
    levelMultiplier: 1.6, upgradeCostMultiplier: 2.5,
    landCost: 3, color: 'green',
  },
  {
    id: 'bank', category: 'Bisnis', name: 'Bank Swasta', icon: '🏦',
    desc: 'Bank dengan ribuan nasabah. Uang bekerja untuk uang.',
    baseCost: 100000000000, incomePerSec: 800000, maxLevel: 5,
    levelMultiplier: 1.6, upgradeCostMultiplier: 2.5,
    landCost: 4, color: 'green',
  },

  // === GAYA HIDUP ===
  {
    id: 'jam', category: 'Gaya Hidup', name: 'Jam Tangan Mewah', icon: '⌚',
    desc: 'Rolex GMT Master II. Status symbol.',
    baseCost: 150000000, incomePerSec: 0, maxLevel: 1,
    levelMultiplier: 1, upgradeCostMultiplier: 1,
    landCost: 0, xpBonus: 500, color: 'purple',
  },
  {
    id: 'supercar', category: 'Gaya Hidup', name: 'Supercar', icon: '🏎️',
    desc: 'Lamborghini Huracan. Bukan investasi, tapi worth it.',
    baseCost: 5000000000, incomePerSec: 0, maxLevel: 1,
    levelMultiplier: 1, upgradeCostMultiplier: 1,
    landCost: 0, xpBonus: 2000, color: 'purple',
  },
  {
    id: 'yacht', category: 'Gaya Hidup', name: 'Yacht Pribadi', icon: '⛵',
    desc: 'Yacht 40 meter. Weekend di Labuan Bajo.',
    baseCost: 50000000000, incomePerSec: 0, maxLevel: 1,
    levelMultiplier: 1, upgradeCostMultiplier: 1,
    landCost: 0, xpBonus: 10000, color: 'purple',
  },
  {
    id: 'pulau', category: 'Gaya Hidup', name: 'Pulau Pribadi', icon: '🏝️',
    desc: 'Pulau kecil di Raja Ampat. Puncak kemewahan.',
    baseCost: 500000000000, incomePerSec: 0, maxLevel: 1,
    levelMultiplier: 1, upgradeCostMultiplier: 1,
    landCost: 0, xpBonus: 50000, color: 'purple',
  },
];

export const MARKET_UPGRADES = [
  { id: 'analyst', name: '📊 Analis Junior', desc: 'Passive income saham +10%', cost: 500000, multiplier: 0.1, owned: 0 },
  { id: 'bloomberg', name: '📺 Bloomberg Terminal', desc: 'Passive income saham +25%', cost: 2000000, multiplier: 0.25, owned: 0 },
  { id: 'algo', name: '🤖 Algo Trading Bot', desc: 'Passive income saham +50%', cost: 8000000, multiplier: 0.5, owned: 0 },
  { id: 'hft', name: '⚡ HFT Server', desc: 'Passive income saham +100%', cost: 25000000, multiplier: 1.0, owned: 0 },
  { id: 'ai', name: '🧠 AI Quant Engine', desc: 'Passive income saham +200%', cost: 100000000, multiplier: 2.0, owned: 0 },
];

const NEWS_POOL = [
  { id: 1, headline: '🔴 BI Naikkan Suku Bunga 25bps', impact: { Saham: -0.03, SBN: 0.01, 'Reksa Dana': -0.01 }, sentiment: 'bearish' },
  { id: 2, headline: '🟢 Inflasi Turun ke 2.1%!', impact: { Saham: 0.04, SBN: 0.02, 'Reksa Dana': 0.02 }, sentiment: 'bullish' },
  { id: 3, headline: '🔴 Rupiah Melemah ke Rp16.500/USD', impact: { Saham: -0.02, SBN: -0.01, 'Reksa Dana': -0.015 }, sentiment: 'bearish' },
  { id: 4, headline: '🟢 BBCA Cetak Laba Rp50T, Rekor!', impact: { Saham: 0.05, SBN: 0, 'Reksa Dana': 0.01 }, sentiment: 'bullish' },
  { id: 5, headline: '🔴 Perang Dagang AS-China Eskalasi', impact: { Saham: -0.04, SBN: 0.02, 'Reksa Dana': -0.02 }, sentiment: 'bearish' },
  { id: 6, headline: '🟢 Pemerintah Rilis Stimulus Rp200T', impact: { Saham: 0.03, SBN: -0.01, 'Reksa Dana': 0.02 }, sentiment: 'bullish' },
  { id: 7, headline: '⚡ GOTO Merger dengan Shopee!', impact: { Saham: 0.06, SBN: 0, 'Reksa Dana': 0.01 }, sentiment: 'bullish' },
  { id: 8, headline: '🔴 Harga Minyak Anjlok 8%', impact: { Saham: -0.025, SBN: 0.01, 'Reksa Dana': -0.01 }, sentiment: 'bearish' },
];

export const PRESTIGE_TITLES = [
  { min: 0,             title: 'Anak Kos Bokek',     icon: '😅' },
  { min: 15000000,      title: 'Karyawan Rajin',      icon: '💼' },
  { min: 100000000,     title: 'Investor Pemula',     icon: '📈' },
  { min: 1000000000,    title: 'Pengusaha Muda',      icon: '🚀' },
  { min: 10000000000,   title: 'Konglomerat Lokal',   icon: '�' },
  { min: 100000000000,  title: 'Taipan Nusantara',    icon: '👑' },
  { min: 1000000000000, title: 'FINANCIAL EMPEROR',   icon: '�' },
];

export const SAVE_KEY_PREFIX = 'stuckie_save_';
export const SAVE_SLOTS = 3;

export const INITIAL_STATE = {
  balance: 500000000000,
  portfolio: [],
  plots: [],
  realAssets: {},
  news: [],
  activeNews: null,
  gameTime: 0,
  totalTrades: 0,
  xp: 0,
  level: 1,
  pendingIncome: 0,
  priceHistory: Object.fromEntries(MARKET_ASSETS.map(a => [a.id, [a.price]])),
};

export const useGameStore = create((set, get) => ({
  ...INITIAL_STATE,
  marketAssets: MARKET_ASSETS,
  marketUpgrades: MARKET_UPGRADES,
  floatingTexts: [],
  currentSlot: null, // which save slot is active
  floatingTexts: [],

  // ── Computed ──────────────────────────────────────────────

  getNetWorth: () => {
    const { balance, marketAssets, portfolio, plots, realAssets } = get();
    const portfolioVal = portfolio.reduce((sum, p) => {
      const a = marketAssets.find(x => x.id === p.assetId);
      return sum + (a ? a.price * p.qty : 0);
    }, 0);
    // plots value
    const plotsVal = plots.length * REAL_ASSETS.find(a => a.id === 'tanah').baseCost * 0.7
      + plots.flatMap(p => p.slots).reduce((sum, s) => {
        const def = REAL_ASSETS.find(a => a.id === s.assetId);
        return sum + (def ? def.baseCost * (s.qty ?? 1) * 0.7 : 0);
      }, 0);
    // non-land real assets (kendaraan, gaya hidup)
    const realVal = Object.entries(realAssets).reduce((sum, [id, data]) => {
      const def = REAL_ASSETS.find(a => a.id === id);
      return sum + (def ? def.baseCost * (data.qty ?? 1) * 0.7 : 0);
    }, 0);
    return balance + portfolioVal + plotsVal + realVal;
  },

  getPassiveIncome: () => {
    const { portfolio, marketAssets, marketUpgrades, plots, realAssets } = get();
    const upgradeMultiplier = 1 + marketUpgrades.reduce((s, u) => s + u.multiplier * u.owned, 0);

    const stockIncome = portfolio.reduce((total, p) => {
      const a = marketAssets.find(x => x.id === p.assetId);
      return total + (a ? a.baseIncome * p.qty * upgradeMultiplier : 0);
    }, 0);

    // income from buildings on plots
    const plotIncome = plots.flatMap(p => p.slots).reduce((sum, s) => {
      const def = REAL_ASSETS.find(a => a.id === s.assetId);
      if (!def || !def.incomePerSec) return sum;
      return sum + def.incomePerSec * Math.pow(def.levelMultiplier, (s.level ?? 1) - 1);
    }, 0);

    // income from non-land real assets
    const realIncome = Object.entries(realAssets).reduce((sum, [id, data]) => {
      const def = REAL_ASSETS.find(a => a.id === id);
      if (!def || !def.incomePerSec) return sum;
      return sum + def.incomePerSec * Math.pow(def.levelMultiplier, data.level - 1) * (data.qty ?? 1);
    }, 0);

    return stockIncome + plotIncome + realIncome;
  },

  getPrestige: () => {
    const nw = get().getNetWorth();
    let current = PRESTIGE_TITLES[0];
    for (const p of PRESTIGE_TITLES) {
      if (nw >= p.min) current = p;
    }
    return current;
  },

  // ── Tick ──────────────────────────────────────────────────

  tick: () => {
    const income = get().getPassiveIncome();
    set(s => ({
      pendingIncome: s.pendingIncome + income,
      gameTime: s.gameTime + 1,
    }));
  },

  collectIncome: () => {
    const { pendingIncome } = get();
    if (pendingIncome < 1) return 0;
    const amount = Math.floor(pendingIncome);
    set(s => ({
      balance: s.balance + amount,
      pendingIncome: 0,
      xp: s.xp + Math.floor(amount / 10000),
    }));
    get().checkLevelUp();
    return amount;
  },

  checkLevelUp: () => {
    const { xp, level } = get();
    const needed = level * 1000;
    if (xp >= needed) set(s => ({ level: s.level + 1, xp: s.xp - needed }));
  },

  addFloatingText: (text, x, y) => {
    const id = Date.now() + Math.random();
    set(s => ({ floatingTexts: [...s.floatingTexts, { id, text, x, y }] }));
    setTimeout(() => set(s => ({ floatingTexts: s.floatingTexts.filter(f => f.id !== id) })), 1500);
  },

  // ── Market Trading ────────────────────────────────────────

  buyMarketAsset: (assetId, qty) => {
    const { balance, marketAssets, portfolio } = get();
    const asset = marketAssets.find(a => a.id === assetId);
    if (!asset) return { success: false, msg: 'Aset tidak ditemukan' };
    const total = asset.price * qty;
    if (total > balance) return { success: false, msg: 'Saldo tidak cukup!' };

    const existing = portfolio.find(p => p.assetId === assetId);
    const newPortfolio = existing
      ? portfolio.map(p => p.assetId === assetId
          ? { ...p, qty: p.qty + qty, avgPrice: (p.avgPrice * p.qty + total) / (p.qty + qty) }
          : p)
      : [...portfolio, { assetId, qty, avgPrice: asset.price }];

    set(s => ({ balance: s.balance - total, portfolio: newPortfolio, totalTrades: s.totalTrades + 1, xp: s.xp + 50 }));
    get().checkLevelUp();
    return { success: true, msg: `✅ Beli ${qty} lot ${asset.name}` };
  },

  sellMarketAsset: (assetId, qty) => {
    const { balance, marketAssets, portfolio } = get();
    const asset = marketAssets.find(a => a.id === assetId);
    const holding = portfolio.find(p => p.assetId === assetId);
    if (!holding || holding.qty < qty) return { success: false, msg: 'Lot tidak cukup!' };

    const total = asset.price * qty;
    const newPortfolio = holding.qty === qty
      ? portfolio.filter(p => p.assetId !== assetId)
      : portfolio.map(p => p.assetId === assetId ? { ...p, qty: p.qty - qty } : p);

    set(s => ({ balance: s.balance + total, portfolio: newPortfolio, totalTrades: s.totalTrades + 1, xp: s.xp + 30 }));
    get().checkLevelUp();
    return { success: true, msg: `💰 Jual ${qty} lot ${asset.name}` };
  },

  // ── Land helpers ──────────────────────────────────────────

  getLandStats: () => {
    const { plots } = get();
    const totalCapacity = plots.length * 6;
    const usedCapacity = plots.flatMap(p => p.slots).reduce((sum, s) => {
      const def = REAL_ASSETS.find(a => a.id === s.assetId);
      return sum + (def?.landCost ?? 0);
    }, 0);
    return { totalCapacity, usedCapacity, freeCapacity: totalCapacity - usedCapacity, plotCount: plots.length };
  },

  // ── Real Asset Purchase / Upgrade ─────────────────────────

  buyPlot: (qty = 1) => {
    const { balance } = get();
    const def = REAL_ASSETS.find(a => a.id === 'tanah');
    const cost = def.baseCost * qty;
    if (balance < cost) return { success: false, msg: 'Saldo tidak cukup!' };
    const newPlots = Array.from({ length: qty }, (_, i) => ({
      id: `plot_${Date.now()}_${i}`,
      slots: [],
    }));
    set(s => ({ balance: s.balance - cost, plots: [...s.plots, ...newPlots], xp: s.xp + qty * 100 }));
    get().checkLevelUp();
    return { success: true, msg: `🟫 Beli ${qty} kavling tanah!` };
  },

  buyRealAsset: (assetId, purchaseQty = 1) => {
    const { balance, plots, realAssets } = get();
    const def = REAL_ASSETS.find(a => a.id === assetId);
    if (!def) return { success: false, msg: 'Aset tidak ada' };

    // Tanah handled separately
    if (assetId === 'tanah') return get().buyPlot(purchaseQty);

    // Non-land assets (kendaraan, gaya hidup) — use realAssets
    if (def.landCost === 0) {
      const cost = def.baseCost * purchaseQty;
      if (balance < cost) return { success: false, msg: 'Saldo tidak cukup!' };
      const existing = realAssets[assetId];
      const level = existing?.level ?? 1;
      const newQty = (existing?.qty ?? 0) + purchaseQty;
      set(s => ({
        balance: s.balance - cost,
        realAssets: { ...s.realAssets, [assetId]: { level, qty: newQty } },
        xp: s.xp + (def.xpBonus || purchaseQty * 100),
      }));
      get().checkLevelUp();
      return { success: true, msg: `🎉 Beli ${purchaseQty}x ${def.name}!` };
    }

    // Land-based assets — check capacity then place on plot
    const { freeCapacity } = get().getLandStats();
    const needed = def.landCost * purchaseQty;
    if (freeCapacity < needed) {
      return { success: false, msg: `Butuh ${needed} kapasitas tanah! Sisa: ${freeCapacity}` };
    }

    const cost = def.baseCost * purchaseQty;
    if (balance < cost) return { success: false, msg: 'Saldo tidak cukup!' };

    // Place buildings into plots greedily — each unit = separate slot
    let remaining = purchaseQty;
    const newPlots = plots.map(plot => {
      if (remaining <= 0) return plot;
      const usedInPlot = plot.slots.reduce((s, sl) => {
        const d = REAL_ASSETS.find(a => a.id === sl.assetId);
        return s + (d?.landCost ?? 0);
      }, 0);
      let freeCap = 6 - usedInPlot;
      if (freeCap < def.landCost) return plot;

      const canFit = Math.floor(freeCap / def.landCost);
      const placing = Math.min(canFit, remaining);
      remaining -= placing;

      // Each unit = its own slot so it renders as a separate tile
      const newSlots = [
        ...plot.slots,
        ...Array.from({ length: placing }, () => ({ assetId, level: 1 })),
      ];
      return { ...plot, slots: newSlots };
    });
    set(s => ({
      balance: s.balance - cost,
      plots: newPlots,
      xp: s.xp + purchaseQty * 100,
    }));
    get().checkLevelUp();
    return { success: true, msg: `🎉 Beli ${purchaseQty}x ${def.name}!` };
  },

  upgradeRealAsset: (assetId) => {
    const { balance, plots, realAssets } = get();
    const def = REAL_ASSETS.find(a => a.id === assetId);
    if (!def) return { success: false, msg: 'Aset tidak ada' };

    if (def.landCost === 0) {
      const existing = realAssets[assetId];
      if (!existing || existing.qty === 0) return { success: false, msg: 'Belum punya aset ini!' };
      if (existing.level >= def.maxLevel) return { success: false, msg: 'Sudah level max!' };
      const upgradeCost = Math.floor(def.baseCost * Math.pow(def.upgradeCostMultiplier, existing.level) * existing.qty);
      if (balance < upgradeCost) return { success: false, msg: 'Saldo tidak cukup!' };
      set(s => ({
        balance: s.balance - upgradeCost,
        realAssets: { ...s.realAssets, [assetId]: { ...existing, level: existing.level + 1 } },
        xp: s.xp + (existing.level + 1) * 200,
      }));
      get().checkLevelUp();
      return { success: true, msg: `⬆️ ${def.name} naik ke Lv.${existing.level + 1}!` };
    }

    // Find slot in plots
    const allSlots = plots.flatMap(p => p.slots).filter(s => s.assetId === assetId);
    if (allSlots.length === 0) return { success: false, msg: 'Belum punya aset ini!' };
    const currentLevel = allSlots[0].level ?? 1;
    if (currentLevel >= def.maxLevel) return { success: false, msg: 'Sudah level max!' };
    const totalQty = allSlots.length;
    const upgradeCost = Math.floor(def.baseCost * Math.pow(def.upgradeCostMultiplier, currentLevel) * totalQty);
    if (balance < upgradeCost) return { success: false, msg: 'Saldo tidak cukup!' };

    const newLevel = currentLevel + 1;
    const newPlots = plots.map(plot => ({
      ...plot,
      slots: plot.slots.map(s => s.assetId === assetId ? { ...s, level: newLevel } : s),
    }));
    set(s => ({ balance: s.balance - upgradeCost, plots: newPlots, xp: s.xp + newLevel * 200 }));
    get().checkLevelUp();
    return { success: true, msg: `⬆️ Semua ${def.name} naik ke Lv.${newLevel}!` };
  },

  // ── Market Upgrades ───────────────────────────────────────

  buyMarketUpgrade: (upgradeId) => {
    const { balance, marketUpgrades } = get();
    const upgrade = marketUpgrades.find(u => u.id === upgradeId);
    if (!upgrade) return { success: false, msg: 'Upgrade tidak ada' };
    const cost = Math.floor(upgrade.cost * Math.pow(1.5, upgrade.owned));
    if (balance < cost) return { success: false, msg: 'Saldo tidak cukup!' };

    set(s => ({
      balance: s.balance - cost,
      marketUpgrades: s.marketUpgrades.map(u => u.id === upgradeId ? { ...u, owned: u.owned + 1 } : u),
      xp: s.xp + 100,
    }));
    get().checkLevelUp();
    return { success: true, msg: `⚡ ${upgrade.name} dibeli!` };
  },

  // ── Save / Load ───────────────────────────────────────────

  saveGame: () => {
    const { currentSlot, balance, portfolio, plots, realAssets, marketUpgrades, gameTime, totalTrades, xp, level, pendingIncome, priceHistory } = get();
    if (currentSlot === null) return false;
    const save = {
      balance, portfolio, plots, realAssets,
      marketUpgrades, gameTime, totalTrades, xp, level, pendingIncome, priceHistory,
      savedAt: Date.now(),
    };
    localStorage.setItem(`${SAVE_KEY_PREFIX}${currentSlot}`, JSON.stringify(save));
    return true;
  },

  saveToSlot: (slot) => {
    const { balance, portfolio, plots, realAssets, marketUpgrades, gameTime, totalTrades, xp, level, pendingIncome, priceHistory } = get();
    const save = {
      balance, portfolio, plots, realAssets,
      marketUpgrades, gameTime, totalTrades, xp, level, pendingIncome, priceHistory,
      savedAt: Date.now(),
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(save))));
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slot}`, encoded);
    set({ currentSlot: slot });
    return encoded;
  },

  // Export save as downloadable .txt file
  exportSave: (slot) => {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
    if (!raw) return false;
    const blob = new Blob([raw], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stuckie_save_slot${slot + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  },

  // Import save from .txt file content string
  importSave: (slot, fileContent) => {
    try {
      const trimmed = fileContent.trim();
      // Validate: try decode
      const json = decodeURIComponent(escape(atob(trimmed)));
      JSON.parse(json); // validate parseable
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slot}`, trimmed);
      return true;
    } catch {
      return false;
    }
  },
  loadSlot: (slot) => {
    try {
      const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
      if (!raw) return false;
      const json = decodeURIComponent(escape(atob(raw.trim())));
      const save = JSON.parse(json);
      set({
        balance: save.balance ?? INITIAL_STATE.balance,
        portfolio: save.portfolio ?? [],
        plots: save.plots ?? [],
        realAssets: save.realAssets ?? {},
        marketUpgrades: save.marketUpgrades ?? MARKET_UPGRADES,
        gameTime: save.gameTime ?? 0,
        totalTrades: save.totalTrades ?? 0,
        xp: save.xp ?? 0,
        level: save.level ?? 1,
        pendingIncome: save.pendingIncome ?? 0,
        priceHistory: save.priceHistory ?? INITIAL_STATE.priceHistory,
        currentSlot: slot,
      });
      return true;
    } catch { return false; }
  },

  newGame: (slot) => {
    set({ ...INITIAL_STATE, marketAssets: MARKET_ASSETS, marketUpgrades: MARKET_UPGRADES, floatingTexts: [], currentSlot: slot });
  },

  deleteSlot: (slot) => {
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${slot}`);
  },

  getSlotMeta: (slot) => {
    try {
      const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
      if (!raw) return null;
      const json = decodeURIComponent(escape(atob(raw.trim())));
      const save = JSON.parse(json);
      return { savedAt: save.savedAt, balance: save.balance, level: save.level ?? 1, gameTime: save.gameTime ?? 0 };
    } catch { return null; }
  },

  // ── News / Market ─────────────────────────────────────────

  triggerNews: () => {
    const { marketAssets, priceHistory, news } = get();
    const randomNews = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];

    const updatedAssets = marketAssets.map(asset => {
      const impactPct = (randomNews.impact[asset.type] || 0) + (Math.random() - 0.5) * 0.02;
      const newPrice = Math.max(1, Math.round(asset.price * (1 + impactPct)));
      return { ...asset, price: newPrice, change: impactPct };
    });

    const newHistory = { ...priceHistory };
    updatedAssets.forEach(a => {
      newHistory[a.id] = [...(newHistory[a.id] || []).slice(-19), a.price];
    });

    set({
      marketAssets: updatedAssets,
      activeNews: randomNews,
      news: [{ ...randomNews, time: new Date().toLocaleTimeString('id') }, ...news.slice(0, 9)],
      priceHistory: newHistory,
    });
  },
}));
