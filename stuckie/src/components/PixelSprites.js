// Pure SVG pixel art sprites — buildings & characters
// Each pixel = 3x3 or 4x4 CSS pixels for that chunky retro look

export const PIXEL_SIZE = 3;

// ─── Helper: render a pixel grid from a color map ────────────────────────────
export function PixelArt({ pixels, scale = PIXEL_SIZE, style = {} }) {
  const rows = pixels.trim().split('\n');
  const height = rows.length;
  const width = Math.max(...rows.map(r => r.length));

  return (
    <svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      style={{ imageRendering: 'pixelated', ...style }}
    >
      {rows.map((row, y) =>
        row.split('').map((ch, x) => {
          if (ch === '.' || ch === ' ') return null;
          const color = PALETTE[ch] || '#ff00ff';
          return (
            <rect
              key={`${x}-${y}`}
              x={x * scale}
              y={y * scale}
              width={scale}
              height={scale}
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
}

// ─── Color Palette ────────────────────────────────────────────────────────────
export const PALETTE = {
  // Skin tones
  's': '#f4a460', // skin
  'S': '#d2691e', // dark skin
  // Hair
  'h': '#4a2800', // dark brown hair
  'H': '#8b4513', // brown hair
  'y': '#ffd700', // blonde
  'w': '#ffffff', // white
  // Clothes
  'r': '#cc2200', // red
  'b': '#2244cc', // blue
  'g': '#228822', // green
  'p': '#884488', // purple
  'o': '#cc6600', // orange
  'c': '#22aaaa', // cyan
  'n': '#886644', // brown/tan
  // Building colors
  'B': '#8b7355', // beige wall
  'W': '#d4c5a9', // light wall
  'R': '#cc3300', // red roof
  'G': '#4a7c59', // green roof
  'D': '#5c3d1e', // dark wood
  'L': '#f5deb3', // light wood
  'T': '#87ceeb', // sky/window
  'E': '#2c2c2c', // dark/shadow
  'A': '#aaaaaa', // gray
  'M': '#666666', // mid gray
  'K': '#333333', // dark gray
  'Y': '#ffee44', // yellow light
  'O': '#ff8800', // orange light
  'P': '#cc9966', // pavement
  'F': '#228b22', // grass/foliage
  'Z': '#1a1a2e', // night sky
  'I': '#4169e1', // indigo
  'N': '#8b4513', // brown
  'Q': '#ff6b6b', // pink/salmon
  'V': '#daa520', // gold
  'X': '#000000', // black outline
  'J': '#ff4444', // bright red
  'U': '#44ff44', // bright green
  '1': '#ffaaaa', // light pink
  '2': '#aaffaa', // light green
  '3': '#aaaaff', // light blue
  '4': '#ffffaa', // light yellow
};

// ─── NPC Sprites (16px tall, walking cycle) ───────────────────────────────────

// Frame 1 & 2 for walk cycle
export const NPC_SPRITES = {
  // Generic person - frame1 (left foot forward)
  person_f1: `
.XXX.
XsssX
XsssX
.XhX.
.bbb.
XbbbX
XbbbX
.b.b.
.X.X.
`,
  // Generic person - frame2 (right foot forward)
  person_f2: `
.XXX.
XsssX
XsssX
.XhX.
.bbb.
XbbbX
XbbbX
.b.b.
X.X..
`,
  // Cook (white hat)
  cook_f1: `
.www.
XwwwX
XsssX
.XsX.
.rrr.
XrrrX
XrrrX
.r.r.
.X.X.
`,
  cook_f2: `
.www.
XwwwX
XsssX
.XsX.
.rrr.
XrrrX
XrrrX
.r.r.
X.X..
`,
  // Business person (suit)
  exec_f1: `
.XXX.
XsssX
XsssX
.XhX.
.KKK.
XKKKX
XKKKX
.K.K.
.X.X.
`,
  exec_f2: `
.XXX.
XsssX
XsssX
.XhX.
.KKK.
XKKKX
XKKKX
.K.K.
X.X..
`,
  // Worker (hard hat)
  worker_f1: `
.YYY.
XYYyX
XsssX
.XsX.
.nnn.
XnnnX
XnnnX
.n.n.
.X.X.
`,
  worker_f2: `
.YYY.
XYYyX
XsssX
.XsX.
.nnn.
XnnnX
XnnnX
.n.n.
X.X..
`,
  // Shopper (bag)
  shopper_f1: `
.XXX.
XsssX
XsssX
.XyX.
.ppp.
XpppX
XpppX
.p.p.
.X.X.
`,
  shopper_f2: `
.XXX.
XsssX
XsssX
.XyX.
.ppp.
XpppX
XpppX
.p.p.
X.X..
`,
};

// ─── Building Sprites ─────────────────────────────────────────────────────────

export const BUILDING_SPRITES = {

  // landCost=1 — warung, 1 lantai
  warung: `
....RRRRRRRRRR....
...RRRRRRRRRRRR...
..RRRRRRRRRRRRRR..
BBBBBBBBBBBBBBBBBB
BWWWWWWWWWWWWWWWBB
BWTTTTDDDDDTTTTWBB
BWTTTTDDDDDTTTTWBB
BWTTTTDDDDDTTTTWBB
BWWWWWDDDDDWWWWWBB
BDDDDDDDDDDDDDDEBB
BDDDDDDDDDDDDDDEBB
BDDDDDDDDDDDDDDEBB
BBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPP
`,

  // landCost=1 — cafe, 1 lantai
  cafe: `
....GGGGGGGGGG....
...GGGGGGGGGGGG...
..GGGGGGGGGGGGGG..
BBBBBBBBBBBBBBBBBB
BWWWWWWWWWWWWWWWBB
BWTTTTTTTTTTTTTTWB
BWTTTTTTTTTTTTTTWB
BWTTTTTTTTTTTTTTWB
BWWWWWWWWWWWWWWWWB
BDDDDDDDDDDDDDDEBB
BDDDDDDDDDDDDDDEBB
BDDDDDDDDDDDDDDEBB
BBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPP
`,

  // landCost=1 — kos, 1 lantai
  kos: `
....RRRRRRRRRR....
...RRRRRRRRRRRR...
..RRRRRRRRRRRRRR..
BBBBBBBBBBBBBBBBBB
BWWWWWWWWWWWWWWWBB
BWTTBWTTBWTTBWTTBB
BWTTBWTTBWTTBWTTBB
BWWWBWWWBWWWBWWWBB
BDDDBDDDBDDDBDDDBB
BDDDBDDDBDDDBDDDBB
BDDDBDDDBDDDBDDDBB
BBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPP
`,

  // landCost=1 — ruko, 1 lantai
  ruko: `
....AAAAAAAAAA....
...AAAAAAAAAAAA...
..AAAAAAAAAAAAAAAA
BBBBBBBBBBBBBBBBBB
BWWWWWWWWWWWWWWWBB
BWWWWWWWWWWWWWWWBB
BWTTTTTTTTTTTTTTWB
BWTTTTTTTTTTTTTTWB
BWTTTTTTTTTTTTTTWB
BWWWWWWWWWWWWWWWWB
BDDDDDDDDDDDDDDEBB
BDDDDDDDDDDDDDDEBB
BBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPP
`,

  // landCost=2 — apartemen, 3 lantai
  apartemen: `
......KKKKKKKKKKKKKKKKKKKK......
.....KTTKKTTKKTTKKTTKKTTKKK.....
.....KTTKKTTKKTTKKTTKKTTKKK.....
.....KKKKKKKKKKKKKKKKKKKKKK.....
.....KTTKKTTKKTTKKTTKKTTKKK.....
.....KTTKKTTKKTTKKTTKKTTKKK.....
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK
KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  // landCost=2 — startup, 3 lantai kaca
  startup: `
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTKK
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  // landCost=3 — gedung, 5 lantai tinggi
  gedung: `
.........KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.........
........KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK........
........KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK........
........KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK........
........KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK........
........KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK........
.......KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.......
.......KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKK.......
.......KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKK.......
......KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK......
......KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK......
......KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK......
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK
KTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTKKTTK
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  // landCost=3 — pabrik, besar dengan cerobong
  pabrik: `
....KKK.............KKK.............................
....KYK.............KYK.............................
....KYK.............KYK.............................
....KYK.............KYK.............................
....KYK.............KYK.............................
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK.
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK.
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK.
KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKK.
KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  // landCost=4 — mall, sangat lebar dan tinggi
  mall: `
..VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV..
.VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV.
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVV
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB
BDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDB
BDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  // landCost=4 — bank, sangat lebar dan megah
  bank: `
...VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV...
..VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV..
.VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV.
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB
BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABB
BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTB
BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB
BDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
`,

  motor: `
...XXXXXXX....
..XAAAAAaaX...
.XAA.....AAX..
XMMMMMMMMMMX..
.XEEEEEEEEX...
..XX.....XX...
`,

  mobil: `
..XXXXXXXX....
.XTTTTTTTTX...
XTTTTTTTTTTX..
XAAAAAAAAAAAAX
XAAAAAAAAAAAAX
.XEXXEXXXXEXX.
..X..X....X..X
`,

  bus: `
XXXXXXXXXXXXXXXXX
XTTTTTTTTTTTTTTX.
XTTTTTTTTTTTTTTX.
XAAAAAAAAAAAAAAAX
XAAAAAAAAAAAAAAAX
XAAAAAAAAAAAAAAAX
.XEXXEXXXXXXEXX..
..X..X......X....
`,

  kapal: `
.......RRRRR....
......RRRRRRR...
.....BBBBBBBBB..
....BWWWWWWWWBB.
BBBBBWWWWWWWWBBB
BAAAAAAAAAAAAAAAB
BAAAAAAAAAAAAAAAB
.BBBBBBBBBBBBBBB.
`,

  pesawat: `
.......WWWW.....
......WWWWWW....
WWWWWWWWWWWWWWWW
WWWTTTTTTTTTWWWW
WWWWWWWWWWWWWWWW
....WWWWWWWW....
.....WWWWWW.....
`,

  pabrik: `
..KKK...KKK.....
..KYK...KYK.....
KKKKKKKKKKKKKKK.
KAAAAAAAAAAAAKK.
KAAAAAAAAAAAAKK.
KKKKKKKKKKKKKK..
BBBBBBBBBBBBBBB.
BDDDDDDDDDDDDBB.
BBBBBBBBBBBBBBB.
PPPPPPPPPPPPPPP.
`,

  bank: `
.VVVVVVVVVVVV..
VVVVVVVVVVVVVVV
BBBBBBBBBBBBBBB
BAAAAAAAAAAAABB
BAAAAAAAAAAAABB
BWWWWWWWWWWWWBB
BDDDDDDDDDDDDDBB
BDDDDDDDDDDDDDBB
BBBBBBBBBBBBBBB
PPPPPPPPPPPPPPP
`,

  tanah: `
FFFFFFFFFFFFFFFF
FNFFFNFFFNFFFNFF
FFFFFFFFFFFFFFFF
NFFFNFFFNFFFNFFF
FFFFFFFFFFFFFFFF
FNFFFNFFFNFFFNFF
FFFFFFFFFFFFFFFF
PPPPPPPPPPPPPPPP
PPPPPPPPPPPPPPPP
PPPPPPPPPPPPPPPP
`,
};

// ─── Ground / environment tiles ───────────────────────────────────────────────
export const GROUND_TILE = `PPPPPPPPPPPPPPPP`;
export const GRASS_TILE  = `FFFFFFFFFFFFFFFF`;
export const ROAD_TILE   = `EEEEEEEEEEEEEEEE`;

// ─── Environment / Prop Sprites ───────────────────────────────────────────────
export const ENV_SPRITES = {

  // Pohon kecil (untuk kos, warung, ruko)
  tree_small: `
..FFF..
.FFFFF.
FFFFFFF
.FFFFF.
..FFF..
..NNN..
..NNN..
`,

  // Pohon besar (untuk apartemen, gedung)
  tree_big: `
...FFF...
..FFFFF..
.FFFFFFF.
FFFFFFFFF
.FFFFFFF.
..FFFFF..
...FFF...
...NNN...
...NNN...
...NNN...
`,

  // Semak / bush
  bush: `
.FFF.
FFFFF
FFFFF
.FFF.
`,

  // Pagar kayu
  fence: `
N.N.N.N.N
NNNNNNNNN
N.N.N.N.N
`,

  // Lampu jalan
  street_lamp: `
.YY.
.YY.
..M.
..M.
..M.
..M.
..M.
`,

  // Bangku taman
  bench: `
NNNNNNN
.N...N.
`,

  // Mobil parkir (kecil)
  car_parked: `
.XXXXX.
XTTTTTTX
XAAAAAAX
XAAAAAAX
.XEXEXX.
`,

  // Garis parkir
  parking_line: `
M.M.M.M.M.M.M.M
`,

  // Tanda parkir P
  parking_sign: `
.MM.
MMMM
MM..
MM..
MMMM
.MM.
....
.MM.
.MM.
`,

  // Pot bunga
  flower_pot: `
.YYY.
YYYYY
.nnn.
.nnn.
`,

  // Trotoar / sidewalk tile
  sidewalk: `
AAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAA
`,

  // Jalan besar (untuk mall, bank)
  road_big: `
EEEEEEEEEEEEEEEEEEEEEEEE
EEEEEEEEEEEEEEEEEEEEEEEE
MMMMMMMMMMMMMMMMMMMMMMMM
EEEEEEEEEEEEEEEEEEEEEEEE
EEEEEEEEEEEEEEEEEEEEEEEE
`,

  // Zebra cross
  zebra: `
MMMM....MMMM....MMMM
MMMM....MMMM....MMMM
MMMM....MMMM....MMMM
`,

  // Taman kecil (patch rumput)
  garden: `
.F.F.F.F.
FFFFFFFFF
FFFFFFFFF
.F.F.F.F.
`,

  // Kolam / fountain
  fountain: `
..TTT..
.TTTTT.
TTTTTTT
.TTTTT.
..TTT..
..AAA..
`,
};

// ─── Environment config per asset type ───────────────────────────────────────
// Each entry: array of { sprite, x (% from left), bottom (px from ground), scale }
export const ASSET_ENV = {
  kos: [
    { sprite: 'tree_small', x: 5,  bottom: 20, scale: 2 },
    { sprite: 'tree_small', x: 80, bottom: 20, scale: 2 },
    { sprite: 'fence',      x: 0,  bottom: 20, scale: 2 },
    { sprite: 'bush',       x: 55, bottom: 20, scale: 2 },
  ],
  warung: [
    { sprite: 'tree_small', x: 5,  bottom: 20, scale: 2 },
    { sprite: 'flower_pot', x: 70, bottom: 20, scale: 2 },
    { sprite: 'bench',      x: 50, bottom: 20, scale: 2 },
  ],
  cafe: [
    { sprite: 'flower_pot', x: 5,  bottom: 20, scale: 2 },
    { sprite: 'flower_pot', x: 75, bottom: 20, scale: 2 },
    { sprite: 'bench',      x: 45, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 85, bottom: 20, scale: 2 },
  ],
  ruko: [
    { sprite: 'street_lamp',x: 5,  bottom: 20, scale: 2 },
    { sprite: 'bush',       x: 70, bottom: 20, scale: 2 },
  ],
  apartemen: [
    { sprite: 'tree_big',   x: 3,  bottom: 20, scale: 2 },
    { sprite: 'tree_big',   x: 82, bottom: 20, scale: 2 },
    { sprite: 'garden',     x: 30, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 15, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 72, bottom: 20, scale: 2 },
    { sprite: 'bench',      x: 45, bottom: 20, scale: 2 },
  ],
  startup: [
    { sprite: 'tree_big',   x: 3,  bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 20, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 75, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 55, bottom: 20, scale: 2 },
  ],
  gedung: [
    { sprite: 'tree_big',   x: 2,  bottom: 20, scale: 2 },
    { sprite: 'tree_big',   x: 88, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 10, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 80, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 35, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 55, bottom: 20, scale: 2 },
    { sprite: 'fountain',   x: 45, bottom: 20, scale: 2 },
  ],
  pabrik: [
    { sprite: 'street_lamp',x: 5,  bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 85, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 60, bottom: 20, scale: 2 },
    { sprite: 'fence',      x: 0,  bottom: 20, scale: 2 },
  ],
  mall: [
    { sprite: 'car_parked', x: 5,  bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 18, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 31, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 60, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 73, bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 86, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 44, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 52, bottom: 20, scale: 2 },
    { sprite: 'zebra',      x: 46, bottom: 20, scale: 2 },
  ],
  bank: [
    { sprite: 'car_parked', x: 5,  bottom: 20, scale: 2 },
    { sprite: 'car_parked', x: 18, bottom: 20, scale: 2 },
    { sprite: 'tree_big',   x: 40, bottom: 20, scale: 2 },
    { sprite: 'tree_big',   x: 75, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 30, bottom: 20, scale: 2 },
    { sprite: 'street_lamp',x: 65, bottom: 20, scale: 2 },
    { sprite: 'fountain',   x: 50, bottom: 20, scale: 2 },
  ],
};

// Ground style per asset type
export const ASSET_GROUND = {
  kos:       { bg: '#3d2b1f', stripe: '#4a3525' },  // tanah biasa
  warung:    { bg: '#3d2b1f', stripe: '#4a3525' },
  cafe:      { bg: '#555555', stripe: '#666666' },  // trotoar
  ruko:      { bg: '#555555', stripe: '#666666' },
  apartemen: { bg: '#444444', stripe: '#555555' },  // aspal
  startup:   { bg: '#444444', stripe: '#555555' },
  gedung:    { bg: '#333333', stripe: '#444444' },  // aspal gelap
  pabrik:    { bg: '#333333', stripe: '#3a3a3a' },
  mall:      { bg: '#555555', stripe: '#666666' },  // parkiran
  bank:      { bg: '#444444', stripe: '#555555' },
};
