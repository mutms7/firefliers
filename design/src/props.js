// ---------- hub props ----------
// The Lantern Gate: an old stone lantern. Walk into its light to fly out on a run.
function lanternGate(f) {
  const g = pg(26, 42);
  for (let y = 0; y <= 6; y++) rect(g, 12 - y * 2, y + 1, 13 + y * 2, y + 1, 'R'); rect(g, 12, 0, 13, 0, 'R'); rect(g, 0, 8, 25, 8, 'R');
  rect(g, 4, 9, 21, 19, 'S'); rect(g, 7, 11, 18, 17, 'g'); rect(g, 9, 12, 16, 16, f ? 'h' : 'G'); rect(g, 12, 11, 13, 17, 'S'); rect(g, 7, 14, 18, 14, 'S');
  rect(g, 6, 20, 19, 21, 'R'); rect(g, 10, 22, 15, 33, 'S'); rect(g, 7, 34, 18, 36, 'S'); rect(g, 3, 37, 22, 41, 'B');
  for (const [x, y] of [[3, 38], [4, 38], [21, 39], [5, 2 + 6], [20, 8], [8, 34], [16, 35], [11, 25], [14, 29], [1, 8], [2, 8]]) put(g, x, y, 'm');
  return g;
}
const STONE_PAL = { S: P.stone, R: P.mossStone, B: P.stone, m: '#4a7a46', g: '#ffd86a', G: '#fff3a0', h: '#ffe4a0', d: '#1a1c22', y: P.gold };
const LANTERN_GATE = [0, 1].map(f => bake(STONE_PAL, lanternGate(f)));
const LAMP_POST = [0, 1].map(f => { const g = pg(9, 24); rect(g, 4, 6, 4, 22, 't'); rect(g, 2, 23, 6, 23, 't'); rect(g, 1, 1, 7, 1, 'L'); rect(g, 2, 2, 6, 5, 'L'); rect(g, 3, 2, 5, 4, f ? 'h' : 'g'); put(g, 4, 0, 'L'); return bake({ t: '#3a2a20', L: P.brass, g: '#ffd86a', h: '#fff3a0' }, g); });

// Glim's cart: striped canopy, hanging jars, a counter of goods
function cart(f) {
  const g = pg(46, 36);
  for (let x = 2; x <= 43; x++) for (let y = 0; y <= 7; y++) if (y >= Math.abs(x - 22.5) * .18) put(g, x, y, ((x >> 2) & 1) ? 'T' : 'A');
  for (let x = 2; x <= 43; x++) if (x % 4 !== 0) put(g, x, 8, ((x >> 2) & 1) ? 'T' : 'A');
  rect(g, 3, 9, 3, 24, 't'); rect(g, 42, 9, 42, 24, 't');
  for (const [x, len] of [[9, 3], [16, 5], [29, 4], [36, 2]]) { line(g, x, 9, x, 9 + len, 'c'); rect(g, x - 1, 10 + len, x + 1, 13 + len, 'J'); put(g, x, 12 + len, f && x % 2 ? 'k' : 'j'); }
  rect(g, 1, 20, 44, 21, 'W'); rect(g, 2, 22, 43, 30, 'W'); for (const y of [24, 27]) rect(g, 3, y, 42, y, 'd'); for (const x of [11, 23, 34]) rect(g, x, 22, x, 30, 'd');
  rect(g, 6, 16, 10, 19, 'K'); rect(g, 13, 17, 16, 19, 'J'); put(g, 14, 18, 'j'); rect(g, 31, 15, 36, 19, 'K'); rect(g, 19, 17, 21, 19, 'y'); put(g, 20, 16, 'y'); rect(g, 25, 16, 28, 19, 'Q');
  ell(g, 9.5, 31.5, 4.5, 4.5, 'K'); ell(g, 36.5, 31.5, 4.5, 4.5, 'K'); for (const cx of [9, 36]) { put(g, cx, 31, 'd'); put(g, cx + 1, 31, 'd'); put(g, cx, 32, 'd'); put(g, cx + 1, 32, 'd'); }
  return g;
}
const CART = [0, 1].map(f => bake({ T: P.teal, A: P.amber, t: '#3a2416', c: '#2a1a10', J: P.glass, j: '#ffd86a', k: '#fff6c0', W: P.wood, d: '#2a160c', K: P.bark, y: '#ffb83a', Q: P.cloth }, cart(f)));

// the Daily Moonstone
function shrine(f) {
  const g = pg(20, 28);
  ell(g, 10, 6, 7.5, 6.5, 'S'); rect(g, 3, 6, 16, 22, 'S');
  ell(g, 10, 9.5, 4, 4, 'm'); ell(g, 11.5, 8.5, 3.3, 3.3, 'S'); // carved crescent
  for (let y = 15; y <= 19; y += 2) rect(g, 6, y, 13, y, 'd');
  rect(g, 1, 23, 18, 27, 'B'); put(g, 2, 22, 'c'); put(g, 17, 22, 'c'); put(g, 2, 21, f ? 'h' : 'g'); put(g, 17, 21, f ? 'g' : 'h');
  for (const [x, y] of [[4, 4], [5, 3], [15, 20], [14, 21], [3, 24], [16, 26]]) put(g, x, y, 'o');
  return g;
}
const SHRINE = [0, 1].map(f => bake({ S: P.mossStone, B: P.stone, m: f ? '#b8fff0' : '#7fd6c2', d: '#1a2420', c: '#e8e0c8', g: '#ffd86a', h: '#fff3a0', o: '#4a7a46' }, shrine(f)));

// the Wall of Glows: stats and achievements carved in an old slab
function tablet() {
  const g = pg(32, 24);
  rect(g, 2, 2, 29, 20, 'S'); rect(g, 0, 21, 31, 23, 'B'); for (let x = 3; x <= 28; x += 2) put(g, x, 1, 'S');
  for (const y of [6, 9, 12, 15]) for (let x = 6; x <= 25; x++) if ((x * 7 + y) % 5) put(g, x, y, 'd');
  for (const [x, y] of [[5, 4], [26, 4], [8, 17], [23, 17], [15, 3]]) { put(g, x, y, 'y'); put(g, x - 1, y, 'Y'); put(g, x + 1, y, 'Y'); put(g, x, y - 1, 'Y'); put(g, x, y + 1, 'Y'); }
  for (let x = 2; x <= 29; x++) if (rnd() < .45) put(g, x, 2, 'm'); for (let x = 2; x <= 12; x++) if (rnd() < .5) put(g, x, 3, 'm');
  return g;
}
reseed(31); const TABLET = bake({ S: P.stone, B: P.mossStone, d: '#16181e', y: '#fff3a0', Y: '#f2c14e', m: '#4a7a46' }, tablet());

// the Roost: mushroom perches your bugs sit on
const PERCH = ['#c8283c', '#2a6e68', '#a8701c', '#6040b0', '#3c9a44'].map((cap, i) => { const g = pg(16, 14); ell(g, 8, 4, 7.5, 4, 'C'); rect(g, 6, 7, 9, 13, 'T'); for (const [x, y] of [[4, 2], [10, 3], [7, 1], [12, 5]]) put(g, x, y, 'w'); return bake({ C: [shade(cap, .35), shade(cap, .6), cap, shade(cap, 1.3), shade(cap, 1.7)], T: P.cream, w: '#f4ecd8' }, g); });
function shade(hex, f) { const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) * .8 : v * f)))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); }

// locked gates
function reedGate() {
  const g = pg(40, 26);
  rect(g, 6, 4, 8, 25, 'W'); rect(g, 31, 4, 33, 25, 'W'); put(g, 7, 3, 'W'); put(g, 32, 3, 'W');
  for (const y of [9, 17]) rect(g, 9, y, 30, y + 1, 'W'); for (let x = 11; x <= 29; x += 3) rect(g, x, 8, x, 21, 'w');
  line(g, 9, 10, 30, 17, 'n'); line(g, 9, 17, 30, 10, 'n'); // chains across
  rect(g, 17, 12, 22, 17, 'L'); rect(g, 18, 9, 21, 11, 'l'); put(g, 18, 10, '.'); put(g, 19, 10, '.'); put(g, 20, 10, '.'); rect(g, 19, 14, 20, 15, 'k');
  for (let x = 0; x <= 39; x++) if (x < 5 || x > 34) { const h = 8 + ((x * 37) % 9); line(g, x, 25, x, 25 - h, 'r'); if (x % 2) { put(g, x, 25 - h, 'K'); put(g, x, 24 - h, 'K'); } }
  return g;
}
const REED_GATE = bake({ W: P.wood, w: '#43271a', n: '#7e848c', L: P.brass, l: '#a8701c', k: '#1a1208', r: '#2e5a32', K: '#6a4026' }, reedGate());
function fallenLog() {
  const g = pg(48, 18);
  rect(g, 4, 3, 40, 16, 'B'); for (const y of [6, 10, 13]) for (let x = 5; x <= 39; x++) if ((x + y) % 7 > 1) put(g, x, y, 'd');
  ell(g, 42.5, 9.5, 5, 7, 'E'); ell(g, 42.5, 9.5, 3, 4.5, 'e'); ell(g, 42.5, 9.5, 1.2, 2, 'E');
  for (const [x, y] of [[8, 2], [9, 2], [10, 1], [22, 2], [23, 2], [30, 2]]) put(g, x, y, 'm'); rect(g, 6, 3, 14, 3, 'm');
  for (let i = 0; i < 6; i++) line(g, 0, 16, 2 + i * 3, 2 + i, 'c'); line(g, 0, 10, 12, 16, 'c'); // cobweb
  return g;
}
const LOG = bake({ B: P.bark, d: '#120b09', E: P.wood, e: '#8f5c36', m: '#4a7a46', c: 'rgba(230,240,240,.55)' }, fallenLog());
function rubble() { const g = pg(30, 16); for (const [x, y, rx, ry] of [[6, 11, 6, 4.5], [15, 9, 5, 6], [23, 11, 6, 4.5], [11, 5, 3, 3], [20, 4, 3.5, 3]]) ell(g, x, y, rx, ry, 'S'); for (const [x, y] of [[14, 3], [5, 7], [24, 7]]) put(g, x, y, 'm'); return g; }
const RUBBLE = bake({ S: P.stone, m: '#4a7a46' }, rubble());
function pillar() { const g = pg(12, 30); rect(g, 2, 6, 9, 27, 'S'); for (let x = 3; x <= 8; x += 2) rect(g, x, 8, x, 25, 'd'); rect(g, 0, 27, 11, 29, 'B'); for (let x = 2; x <= 9; x++) rect(g, x, 6 - ((x * 5) % 4) - (x === 4 ? 4 : 0), x, 6, 'S'); for (const [x, y] of [[2, 12], [3, 13], [9, 20], [8, 21]]) put(g, x, y, 'm'); return g; }
const PILLAR = bake({ S: P.stone, B: P.mossStone, d: '#262a32', m: '#4a7a46' }, pillar());
function telescope() { const g = pg(26, 30); line(g, 4, 22, 13, 14, 'W'); line(g, 22, 22, 13, 14, 'W'); line(g, 13, 26, 13, 14, 'W'); polyFill(g, [[6, 4], [21, 13], [18, 17], [3, 8]], 'L'); polyFill(g, [[2, 6], [6, 3], [8, 7], [4, 9]], 'g'); rect(g, 2, 26, 24, 29, 'S'); return g; }
const TELESCOPE = bake({ W: P.wood, L: P.brass, g: '#bfe2f4', S: P.stone }, telescope());

// small things
const GLOW_SHROOMS = [['#7fd6c2', '#b8fff0'], ['#c8b0ff', '#f0e4ff'], ['#ffb83a', '#fff0b0']].map(([a, b]) => { const g = pg(12, 10); ell(g, 3.5, 3.5, 3, 2.2, 'c'); rect(g, 3, 5, 3, 9, 's'); ell(g, 8.5, 5.5, 2.4, 1.8, 'c'); rect(g, 8, 7, 8, 9, 's'); put(g, 2, 2, 'h'); put(g, 8, 4, 'h'); return bake({ c: a, h: b, s: '#d8d0bc' }, g, '#06100e'); });
const JAR = [0, 1].map(f => { const g = fromRows(['.LLLLL.', '.lllll.', 'JJJJJJJ', 'JJJjJJJ', 'JJjjjJJ', 'JJJjJJJ', 'JJJJJJJ', '.JJJJJ.']); if (f) { g[3][3] = 'J'; g[4][2] = 'J'; g[4][4] = 'j'; g[5][4] = 'j'; } return bake({ L: P.brass, l: '#6a420e', J: P.glass, j: '#ffe066' }, g); });
const CRATE = bake({ W: P.wood, d: '#2a160c' }, (() => { const g = pg(14, 13); rect(g, 0, 0, 13, 12, 'W'); rect(g, 0, 0, 13, 0, 'd'); rect(g, 0, 12, 13, 12, 'd'); line(g, 1, 1, 12, 11, 'd'); line(g, 12, 1, 1, 11, 'd'); return g; })());
const BENCH = bake({ W: P.wood, d: '#2a160c', t: '#24140c' }, (() => { const g = pg(24, 11); rect(g, 0, 2, 23, 4, 'W'); rect(g, 0, 5, 23, 6, 'W'); rect(g, 0, 4, 23, 4, 'd'); rect(g, 2, 7, 3, 10, 't'); rect(g, 20, 7, 21, 10, 't'); rect(g, 0, 0, 23, 1, 'W'); return g; })());
const SIGNPOST = bake({ W: P.wood, t: '#3a2416', d: '#2a160c', y: '#f2c14e' }, (() => { const g = pg(18, 20); rect(g, 8, 6, 9, 19, 't'); polyFill(g, [[0, 1], [15, 1], [18, 4.5], [15, 8], [0, 8]], 'W'); for (const x of [3, 6, 9, 12]) put(g, x, 4, 'd'); put(g, 14, 4, 'y'); return g; })());
const SOON_BOARD = bake({ W: P.wood, d: '#2a160c', t: '#3a2416', y: '#f2c14e', n: '#7e848c' }, (() => { const g = pg(24, 20); rect(g, 3, 9, 4, 19, 't'); rect(g, 19, 9, 20, 19, 't'); rect(g, 0, 1, 23, 12, 'W'); for (const y of [4, 7, 10]) for (let x = 3; x <= 20; x++) if ((x + y) % 4) put(g, x, y, 'd'); line(g, 0, 1, 23, 12, 'n'); line(g, 23, 1, 0, 12, 'n'); rect(g, 10, 5, 13, 8, 'y'); return g; })());
const BUSH = bake({ L: P.leaf, f: '#ffd0f0' }, (() => { const g = pg(18, 13); for (const [x, y, r] of [[5, 7, 5], [12, 6, 5.5], [9, 4, 4], [14, 9, 3.5]]) ell(g, x, y, r, r * .85, 'L'); for (const [x, y] of [[6, 5], [12, 3], [15, 8]]) put(g, x, y, 'f'); return g; })());
const LILY = bake({ P: P.leaf, f: '#ffb0d8', y: '#ffe066' }, (() => { const g = pg(11, 7); ell(g, 5.5, 3.5, 5, 3, 'P'); line(g, 5, 3, 8, 0, '.'); put(g, 6, 2, '.'); put(g, 3, 2, 'f'); put(g, 2, 2, 'f'); put(g, 3, 1, 'f'); put(g, 3, 3, 'y'); return g; })(), '#04120c');
const REEDS = bake({ r: '#2e5a32', K: '#6a4026' }, (() => { const g = pg(8, 16); for (const [x, h] of [[1, 11], [3, 15], [5, 9], [6, 13]]) { line(g, x, 15, x, 15 - h, 'r'); put(g, x, 15 - h, 'K'); put(g, x, 16 - h, 'K'); put(g, x, 17 - h, 'K'); } return g; })(), null);
const FLOWERS = ['#ff9ac8', '#a8c8ff', '#ffe066'].map(c => bake({ f: c, y: '#fff4d8', s: '#2e5a32' }, ['.f.', 'fyf', '.f.', '.s.'], null));
const PADLOCK = bake({ L: P.brass, l: '#6a420e', k: '#1a1208' }, (() => { const g = pg(12, 15); rect(g, 3, 0, 8, 1, 'l'); rect(g, 2, 1, 3, 6, 'l'); rect(g, 8, 1, 9, 6, 'l'); rect(g, 0, 6, 11, 14, 'L'); rect(g, 5, 9, 6, 11, 'k'); put(g, 5, 12, 'k'); put(g, 6, 12, 'k'); return g; })());
