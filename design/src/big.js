// ---------- big stations and scenery for the walkable Hollow ----------
const blob = (g, pts, r0, r1, ch) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; for (let t = 0; t <= 1; t += .02) { const k = (i + t) / (pts.length - 1), r = r0 + (r1 - r0) * k; ell(g, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, r, ch); } } };
const bez = (p0, p1, p2, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; });
const sprinkle = (g, ch, onto, n, seed) => { reseed(seed); let k = 0; for (let i = 0; i < n * 40 && k < n; i++) { const x = (rnd() * g[0].length) | 0, y = (rnd() * g.length) | 0; if (g[y][x] === onto) { g[y][x] = ch; k++; } } };

// the Lantern Gate: a tall stone lantern with a living flame. Step into its light to fly out.
function bigGate(f) {
  const g = pg(52, 82);
  for (let y = 0; y <= 13; y++) { const h = 3 + y * 1.55 + (y > 9 ? (y - 9) * 1.3 : 0); rect(g, Math.round(26 - h), y + 3, Math.round(25 + h), y + 3, 'R'); }
  for (let y = 5; y <= 16; y += 3) for (let x = 0; x < 52; x++) if (g[y][x] === 'R' && x % 2) g[y][x] = 'r';
  rect(g, 24, 0, 27, 3, 'S'); ell(g, 26, 1.5, 2.6, 2, 'S');
  rect(g, 6, 17, 45, 18, 'D');
  rect(g, 10, 19, 41, 44, 'S'); rect(g, 13, 22, 38, 41, 'g'); // the fire chamber
  rect(g, 25, 22, 26, 41, 'S'); rect(g, 13, 31, 38, 31, 'S'); for (const x of [13, 38]) rect(g, x, 22, x, 41, 's');
  const fl = [[[19, 39], [17, 33], [20, 27], [22, 33], [24, 25], [23, 39]], [[18, 39], [19, 31], [21, 26], [23, 31], [24, 27], [24, 39]], [[18, 39], [17, 34], [21, 28], [21, 33], [24, 28], [23, 39]]][f];
  polyFill(g, fl, 'F'); polyFill(g, fl.map(([x, y]) => [x, y + 3]).map(([x, y], i) => [x + (i < 3 ? 1 : -1), y]), 'W');
  polyFill(g, fl.map(([x, y]) => [52 - x - 1, y]), 'F'); polyFill(g, fl.map(([x, y]) => [52 - x - 1, y + 3]).map(([x, y], i) => [x + (i < 3 ? -1 : 1), y]), 'W');
  rect(g, 7, 45, 44, 47, 'R'); for (let x = 8; x < 44; x += 3) put(g, x, 47, 'r');
  rect(g, 19, 48, 32, 69, 'S'); for (const y of [53, 54, 62]) rect(g, 19, y, 32, y, 's'); rect(g, 23, 56, 28, 59, 'd'); put(g, 25, 57, 'g'); put(g, 26, 57, 'g'); put(g, 25, 58, 'g'); put(g, 26, 58, 'g');
  rect(g, 13, 70, 38, 73, 'S'); rect(g, 6, 74, 45, 81, 'B'); rect(g, 6, 74, 45, 74, 's');
  for (const [x0, y0, x1, y1] of [[22, 20, 20, 25], [36, 62, 34, 68], [10, 78, 14, 80]]) line(g, x0, y0, x1, y1, 'd');
  sprinkle(g, 'm', 'R', 26, 3); sprinkle(g, 'M', 'B', 14, 4); sprinkle(g, 'm', 'S', 8, 5);
  return g;
}
const BIG_GATE = [0, 1, 2].map(f => bake({ R: P.mossStone, r: '#1e2c26', S: P.stone, s: '#262a32', D: '#0e1014', B: P.mossStone, d: '#121418', g: '#ffb83a', F: '#ffe066', W: '#fff8d0', m: '#4a7a46', M: '#2e5a32' }, bigGate(f)));

// the Elder Root: a great root arch hung with amber pods. Old Glim tends it. This is the skill tree.
function elderRoot(f) {
  const g = pg(104, 90);
  ell(g, 52, 56, 22, 30, 'h');
  for (const pts of [bez([20, 89], [6, 30], [52, 12]), bez([84, 89], [100, 30], [52, 12])]) blob(g, pts, 10, 6, 'B');
  for (const [a, b, c] of [[[20, 86], [2, 88], [0, 80]], [[24, 88], [34, 82], [40, 89]], [[84, 86], [100, 88], [103, 80]], [[80, 88], [70, 82], [64, 89]], [[16, 70], [4, 66], [2, 58]], [[88, 68], [100, 62], [102, 54]]]) blob(g, bez(a, b, c, 8), 3.4, 1.6, 'B');
  for (const side of [-1, 1]) { const pts = bez([52 + side * 32, 88], [52 + side * 48, 32], [52, 18]); for (const [x, y] of pts) { put(g, Math.round(x + side * 3), Math.round(y), 'd'); put(g, Math.round(x - side * 4), Math.round(y + 2), 'd'); } }
  for (const [x, y, r] of [[52, 32, 1], [43, 44, 2], [60, 40, 1.5], [37, 58, 1], [66, 56, 2], [50, 62, 1], [57, 72, 1.5], [44, 74, 1]]) { ell(g, x, y, r + .4, r + .4, 'y'); }
  for (const [x, y] of [[36, 24], [68, 24], [26, 36], [79, 38], [52, 19], [45, 20]]) { line(g, x, y, x, y + 5, 'k'); ell(g, x + .5, y + 9, 3.2, 4.2, 'A'); put(g, x - 1, y + 7, f ? 'G' : 'w'); }
  sprinkle(g, 'm', 'B', 70, 11); sprinkle(g, 'n', 'B', 30, 12);
  for (const [x, y] of [[30, 13], [33, 12], [72, 14], [60, 10]]) { ell(g, x, y, 2.4, 1.6, 'c'); put(g, x, y + 2, 'C'); }
  return g;
}
const ELDER = [0, 1].map(f => bake({ B: P.bark, d: '#0c0706', h: '#07090a', y: '#c88a2a', k: '#2a1a10', A: P.amber, w: '#fff6d8', G: '#ffffff', m: '#3a6a3a', n: '#264a2a', c: '#7fd6c2', C: '#d8d0bc' }, elderRoot(f)));

// the Roost: three big mushrooms, one per bug
function bigShroom(cap, spots) {
  const g = pg(40, 44);
  ell(g, 20, 12, 19.5, 11, 'C'); rect(g, 1, 12, 38, 16, 'C'); ell(g, 20, 16, 19, 3.6, 'G');
  for (let x = 4; x < 37; x += 3) line(g, x, 17, 20 + (x - 20) * .6, 19, 'g');
  rect(g, 14, 18, 25, 39, 'T'); ell(g, 19.5, 26, 8, 2, 'T'); for (const [x, y] of [[16, 22], [22, 30], [17, 34], [23, 37]]) put(g, x, y, 't');
  ell(g, 20, 41, 15, 3, 'm');
  if (spots) for (const [x, y, r] of [[9, 8, 2.2], [19, 4, 2.6], [30, 9, 2.4], [14, 13, 1.6], [26, 13, 1.8], [35, 13, 1.2], [5, 13, 1.2]]) ell(g, x, y, r, r, 'w');
  return bake({ C: cap, G: '#1a1208', g: '#3a2418', T: P.cream, t: '#8a7050', m: P.leaf, w: '#f4ecd8' }, g);
}
const BIG_SHROOMS = [bigShroom(P.red, 1), bigShroom(P.teal, 1), bigShroom(P.violet, 1)];

// the Moonstone: today's run, the same for everyone
function moonstone(f) {
  const g = pg(36, 62);
  polyFill(g, [[8, 61], [6, 18], [11, 4], [19, 0], [27, 5], [30, 20], [29, 61]], 'S');
  ell(g, 18, 19, 8, 8, 'o'); ell(g, 18, 19, 6.4, 6.4, 'M'); ell(g, 21, 17, 5.6, 5.6, 'S'); ell(g, 18, 19, 8, 8, 'o', (x, y) => g[y][x] === 'o');
  for (let y = 31; y <= 52; y += 4) { put(g, 17, y, f ? 'M' : 'r'); put(g, 19, y + 2, f ? 'r' : 'M'); }
  for (const [x0, y0, x1, y1] of [[10, 10, 12, 16], [26, 40, 24, 48]]) line(g, x0, y0, x1, y1, 'd');
  rect(g, 2, 57, 33, 61, 'B'); ell(g, 4, 58, 3.4, 2.6, 'B'); ell(g, 32, 58, 3.4, 2.6, 'B');
  for (const x of [3, 33]) { rect(g, x, 53, x + 1, 56, 'c'); put(g, x, 52, f ? 'F' : 'f'); put(g, x + 1, 51, 'f'); }
  sprinkle(g, 'm', 'S', 22, 21); sprinkle(g, 'm', 'B', 10, 22);
  return g;
}
const MOONSTONE = [0, 1].map(f => bake({ S: P.mossStone, B: P.stone, o: '#2a4a40', M: f ? '#c8fff2' : '#7fd6c2', r: '#3a6a5a', d: '#121a16', c: '#e8e0c8', f: '#ffd86a', F: '#fff3a0', m: '#4a7a46' }, moonstone(f)));

// the Records board: your best runs and achievements, pinned up
function records() {
  const g = pg(56, 46);
  rect(g, 6, 14, 9, 45, 'P'); rect(g, 46, 14, 49, 45, 'P');
  polyFill(g, [[0, 9], [28, 0], [55, 9], [52, 12], [28, 4], [3, 12]], 'R');
  rect(g, 3, 12, 52, 38, 'W'); for (const y of [19, 26, 33]) rect(g, 4, y, 51, y, 'd');
  for (const [x, y, w, h] of [[7, 15, 12, 9], [22, 14, 10, 12], [35, 16, 13, 8], [9, 27, 14, 9], [27, 28, 9, 8], [39, 27, 9, 9]]) { rect(g, x, y, x + w, y + h, 'p'); for (let yy = y + 2; yy < y + h; yy += 2) rect(g, x + 2, yy, x + w - 2 - ((yy * 3) % 4), yy, 'l'); put(g, x + (w >> 1), y, 'n'); }
  for (const [x, y] of [[24, 18], [44, 31], [14, 30]]) { put(g, x, y, 'y'); put(g, x - 1, y, 'Y'); put(g, x + 1, y, 'Y'); put(g, x, y - 1, 'Y'); put(g, x, y + 1, 'Y'); }
  sprinkle(g, 'm', 'R', 10, 31);
  return g;
}
const RECORDS = bake({ P: P.wood, R: P.mossStone, W: P.bark, d: '#120b09', p: '#e8e0c8', l: '#8a7a68', n: '#e8604c', y: '#fff3a0', Y: '#f2c14e', m: '#4a7a46' }, records());

// locked: the Pond gate, chained shut
function pondGate() {
  const g = pg(76, 58);
  for (const x of [4, 58]) { rect(g, x, 10, x + 13, 57, 'S'); rect(g, x - 2, 4, x + 15, 9, 'R'); rect(g, x + 3, 0, x + 10, 3, 'R'); for (let y = 16; y < 56; y += 7) rect(g, x, y, x + 13, y, 's'); }
  rect(g, 18, 14, 57, 55, 'W'); for (let x = 20; x < 57; x += 4) rect(g, x, 15, x, 54, 'w'); rect(g, 37, 14, 38, 55, 'd');
  for (const y of [20, 46]) rect(g, 18, y, 57, y + 2, 'i');
  line(g, 18, 24, 57, 44, 'n'); line(g, 18, 44, 57, 24, 'n'); line(g, 18, 25, 57, 45, 'n');
  rect(g, 33, 29, 42, 39, 'L'); rect(g, 35, 24, 40, 28, 'l'); rect(g, 36, 25, 39, 27, '.'); rect(g, 37, 33, 38, 36, 'k');
  sprinkle(g, 'm', 'S', 30, 41); sprinkle(g, 'm', 'R', 16, 42);
  return g;
}
const POND_GATE = bake({ S: P.stone, s: '#262a32', R: P.mossStone, W: P.wood, w: '#43271a', d: '#1a0e08', i: '#3a3f48', n: '#7e848c', L: P.brass, l: '#a8701c', k: '#1a1208', m: '#4a7a46' }, pondGate());
// locked: the Market, a mushroom stall boarded up
function market() {
  const g = pg(70, 62);
  ell(g, 35, 14, 34.5, 14, 'C'); rect(g, 1, 14, 68, 19, 'C'); ell(g, 35, 19, 33, 3, 'G');
  for (const [x, y, r] of [[14, 8, 3], [30, 5, 3.4], [48, 7, 3], [60, 13, 2], [22, 15, 2], [40, 15, 2.2]]) ell(g, x, y, r, r, 'w');
  rect(g, 8, 22, 11, 59, 'P'); rect(g, 58, 22, 61, 59, 'P');
  rect(g, 6, 40, 63, 59, 'W'); for (const y of [45, 50, 55]) rect(g, 7, y, 62, y, 'd');
  rect(g, 12, 22, 57, 39, 'h');
  for (const [y0, y1] of [[24, 36], [36, 25]]) { line(g, 12, y0, 57, y1, 'b'); line(g, 12, y0 + 1, 57, y1 + 1, 'b'); line(g, 12, y0 + 2, 57, y1 + 2, 'b'); }
  for (const [x, y] of [[13, 25], [56, 36], [13, 37], [56, 26]]) put(g, x, y, 'i');
  rect(g, 31, 43, 38, 51, 'L'); rect(g, 32, 39, 37, 42, 'l'); rect(g, 33, 40, 36, 42, '.'); rect(g, 34, 46, 35, 48, 'k');
  for (let i = 0; i < 5; i++) line(g, 12, 22, 12 + i * 3, 30 - i, 'c');
  return g;
}
const MARKET = bake({ C: ['#3a1c10', '#6a3418', '#9a5228', '#c07a40', '#e8a868'], G: '#1a0e08', w: '#e8d8c0', P: P.wood, W: P.wood, d: '#2a160c', h: '#06090a', b: '#6a4026', i: '#7e848c', L: P.brass, l: '#a8701c', k: '#1a1208', c: 'rgba(230,240,240,.5)' }, market());

// scenery
function bigTree(seed) {
  reseed(seed); const g = pg(48, 72);
  rect(g, 16, 20, 31, 64, 'B'); for (const [a, b, c] of [[[18, 62], [6, 66], [1, 71]], [[29, 62], [40, 66], [46, 71]], [[22, 64], [20, 69], [16, 71]], [[26, 64], [30, 69], [33, 71]]]) blob(g, bez(a, b, c, 8), 3, 1.4, 'B');
  for (let x = 17; x < 31; x += 3) for (let y = 22; y < 62; y++) if (rnd() < .7) put(g, x + ((y >> 3) % 2), y, 'd');
  for (const [x, y, r] of [[24, 14, 15], [12, 20, 10], [36, 20, 10], [24, 4, 9], [14, 8, 8], [34, 9, 8]]) ell(g, x, y, r, r * .85, 'L');
  sprinkle(g, 'l', 'L', 90, seed + 1); sprinkle(g, 'f', 'L', 8, seed + 2); sprinkle(g, 'm', 'B', 16, seed + 3);
  return bake({ B: P.bark, d: '#0c0706', L: ['#081810', '#0f2a1a', '#1a4026', '#2a5a32', '#467a44'], l: '#0c2014', f: '#ffd86a', m: '#3a6a3a' }, g);
}
const TREES = [bigTree(101), bigTree(202), bigTree(303)];
const BIG_LAMP = [0, 1].map(f => { const g = pg(14, 40); rect(g, 6, 12, 7, 38, 't'); rect(g, 3, 38, 10, 39, 't'); rect(g, 7, 12, 11, 12, 't'); rect(g, 1, 1, 12, 2, 'L'); rect(g, 2, 3, 11, 10, 'L'); rect(g, 3, 4, 10, 9, f ? 'h' : 'g'); rect(g, 6, 4, 7, 9, 'L'); put(g, 6, 0, 'L'); put(g, 7, 0, 'L'); return bake({ t: '#2a2018', L: P.brass, g: '#ffd86a', h: '#fff3a0' }, g); });
const FERN = bake({ L: P.leaf }, (() => { const g = pg(30, 18); for (const [a, c] of [[[15, 17], [2, 4]], [[15, 17], [8, 0]], [[15, 17], [22, 0]], [[15, 17], [28, 5]], [[15, 17], [15, 1]]]) { const pts = bez(a, [(a[0] + c[0]) / 2 + (c[0] < 15 ? -3 : 3), (a[1] + c[1]) / 2], c, 10); blob(g, pts, 1.6, .6, 'L'); for (let i = 2; i < pts.length - 1; i += 2) { const [x, y] = pts[i]; put(g, Math.round(x - 2), Math.round(y), 'L'); put(g, Math.round(x + 2), Math.round(y), 'L'); } } return g; })());
const SHROOM_PATCH = bake({ c: '#7fd6c2', C: '#c8b0ff', h: '#e8fff8', s: '#d8d0bc' }, (() => { const g = pg(22, 14); for (const [x, y, rx, col] of [[5, 6, 4, 'c'], [12, 4, 5, 'C'], [18, 8, 3, 'c'], [9, 10, 2.6, 'C']]) { ell(g, x, y, rx, rx * .6, col); rect(g, x, y + 1, x, y + rx + 1, 's'); put(g, x - 1, y - 1, 'h'); } return g; })(), '#06100e');
