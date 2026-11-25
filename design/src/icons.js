// ---------- icons (16x16 unless noted). Each is a little object you could pick up, not a font glyph. ----------
const I = (w, h, fn, pal, ol) => { const g = pg(w, h); fn(g); return bake(pal, g, ol === undefined ? '#050608' : ol); };
const heartMask = (g, cx, cy, s, ch) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) { const X = (x + .5 - cx) / s, Y = -(y + .5 - cy) / s; if ((X * X + Y * Y - 1) ** 3 - X * X * Y ** 3 <= 0) g[y][x] = ch; } };
const starPts = (cx, cy, R, r, n = 5, rot = -Math.PI / 2) => Array.from({ length: n * 2 }, (_, i) => { const a = rot + i * Math.PI / n, d = i % 2 ? r : R; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });
const bolt = (g, ch) => polyFill(g, [[9, 0], [3, 9], [7, 9], [5, 16], [13, 6], [9, 6], [11, 0]], ch);

// ---- amber, the hub currency: fireflies' old light, set hard ----
const AMBER = I(10, 12, g => { polyFill(g, [[5, 0], [10, 4], [9, 10], [5, 12], [1, 10], [0, 4]], 'A'); put(g, 3, 3, 'w'); put(g, 4, 4, 'w'); put(g, 5, 7, 'f'); }, { A: P.amber, w: '#fff6d8', f: '#3a1a04' });
const AMBER_SMALL = I(6, 7, g => { polyFill(g, [[3, 0], [6, 2], [5, 6], [3, 7], [1, 6], [0, 2]], 'A'); put(g, 2, 2, 'w'); }, { A: P.amber, w: '#fff6d8' });
const AMBER_PILE = I(20, 14, g => { for (const [x, y] of [[4, 9], [10, 8], [15, 9], [7, 4], [12, 3]]) polyFill(g, [[x, y - 4], [x + 4, y - 1], [x + 3, y + 4], [x, y + 5], [x - 3, y + 4], [x - 4, y - 1]], 'A'); for (const [x, y] of [[6, 2], [11, 1], [3, 7], [14, 6]]) put(g, x, y, 'w'); }, { A: P.amber, w: '#fff6d8' });

// ---- permanent upgrades sold by Old Glim ----
const UPGRADE_ICONS = {
  shell: I(16, 16, g => { ell(g, 8, 8, 7.5, 7.5, 'S'); line(g, 8, 1, 8, 15, 'd'); heartMask(g, 8, 8.5, 3.2, 'R'); }, { S: P.pink, d: '#4a0f3a', R: P.red }),
  sting: I(16, 16, g => { polyFill(g, [[0, 2], [7, 0], [12, 5], [15, 15], [9, 9], [3, 8]], 'B'); for (const [a, b] of [[[3, 1], [1, 6]], [[6, 1], [4, 8]], [[9, 3], [7, 9]]]) line(g, a[0], a[1], b[0], b[1], 'd'); }, { B: P.amber, d: '#2a1208' }),
  wings: I(16, 16, g => { ell(g, 9, 6, 6, 4.5, 'W'); ell(g, 8, 11, 5, 3.2, 'W'); for (const y of [4, 8, 12]) line(g, 0, y, 2, y, 's'); }, { W: P.ice, s: '#e8fbff' }),
  lure: I(16, 16, g => { ell(g, 8, 10, 6.5, 5.5, 'J'); rect(g, 4, 3, 11, 5, 'J'); rect(g, 3, 3, 12, 3, 'L'); ell(g, 8, 11, 5, 3.6, 'H'); put(g, 5, 7, 'w'); put(g, 5, 8, 'w'); line(g, 11, 0, 9, 6, 'S'); rect(g, 9, 6, 10, 7, 'H'); put(g, 4, 15, 'H'); put(g, 4, 14, 'H'); }, { J: ['#3a2410', '#6a4420', '#a8703a', '#d8a060', '#ffd8a0'], L: '#3a2410', H: P.amber, w: '#fff6d8', S: '#8f5c36' }),
  lastLight: I(16, 16, g => { rect(g, 4, 2, 11, 2, 'L'); rect(g, 3, 3, 12, 13, 'L'); rect(g, 5, 4, 10, 12, 'g'); heartMask(g, 7.5, 8.5, 2.4, 'r'); rect(g, 6, 14, 9, 15, 'L'); put(g, 7, 0, 'L'); put(g, 8, 1, 'L'); }, { L: P.brass, g: '#fff3a0', r: '#e8604c' }),
  clover: I(16, 16, g => { for (const [x, y] of [[4, 4], [11, 4], [4, 11], [11, 11]]) { heartMask(g, x + .5, y + .5, 3.1, 'C'); } line(g, 0, 7, 15, 7, '.'); line(g, 7, 0, 7, 15, '.'); line(g, 0, 8, 15, 8, '.'); line(g, 8, 0, 8, 15, '.'); ell(g, 8, 8, 1.6, 1.6, 'C'); line(g, 9, 9, 14, 15, 's'); }, { C: P.green, s: '#22622e' }),
  headStart: I(16, 16, g => { polyFill(g, [[8, 0], [15, 7], [11, 7], [11, 15], [5, 15], [5, 7], [1, 7]], 'G'); put(g, 7, 3, 'w'); }, { G: P.green, w: '#e8ffe0' }),
  brightTrail: I(16, 16, g => { for (const [x, y, r] of [[3, 12, 2.4], [8, 8, 2.8], [13, 3, 3.2]]) ell(g, x, y, r, r, 'G'); }, { G: ['#8a6a10', '#d8a820', '#ffe066', '#fff3a0', '#ffffe0'] }),
  quickDash: I(16, 16, g => { bolt(g, 'Y'); for (const y of [5, 9]) line(g, 0, y, 2, y, 's'); }, { Y: ['#6a4a08', '#b88a18', '#ffd84a', '#fff0a0', '#ffffff'], s: '#fff0a0' }),
  amberNose: I(16, 16, g => { polyFill(g, [[6, 1], [11, 5], [10, 12], [6, 14], [2, 12], [1, 5]], 'A'); rect(g, 12, 9, 12, 15, 'p'); rect(g, 9, 12, 15, 12, 'p'); }, { A: P.amber, p: '#7fd6c2' }),
  carapace: I(16, 16, g => { polyFill(g, [[8, 0], [15, 3], [14, 10], [8, 15], [2, 10], [1, 3]], 'S'); line(g, 8, 1, 8, 14, 'd'); for (const [x, y] of [[4, 5], [11, 5], [5, 9], [10, 9]]) put(g, x, y, 'k'); }, { S: P.violet, d: '#1e1040', k: '#c8b0ff' }),
  dew: I(16, 16, g => { polyFill(g, [[7, 0], [12, 8], [12, 11], [9, 15], [5, 15], [2, 11], [2, 8]], 'W'); put(g, 5, 9, 'w'); put(g, 5, 10, 'w'); rect(g, 12, 2, 12, 6, 'p'); rect(g, 10, 4, 14, 4, 'p'); }, { W: P.glass, w: '#ffffff', p: '#7fd6c2' }),
};
const UPGRADES = [
  ['shell', 'Thick Shell', '+10 max health', 5, [20, 40, 70, 110, 160]], ['sting', 'Sharp Sting', '+5% damage', 5, [25, 50, 90, 140, 200]],
  ['wings', 'Swift Wings', '+4% move speed', 3, [30, 70, 120]], ['lure', 'Honey Lure', 'Pull sparks from 15% farther', 3, [20, 45, 80]],
  ['lastLight', 'Last Light', 'Get back up once a run with half health', 1, [400]], ['clover', 'Four-Leaf', '+1 reroll each run', 3, [60, 120, 200]],
  ['headStart', 'Head Start', 'Begin runs at level 2, then 3', 2, [80, 180]], ['brightTrail', 'Bright Trail', 'Start with 1 more firefly', 3, [40, 90, 150]],
  ['quickDash', 'Quick Dash', 'Dash recharges 6% faster', 3, [35, 80, 140]], ['amberNose', 'Amber Nose', '+10% amber from runs', 3, [50, 110, 190]],
  ['carapace', 'Carapace', 'Take 1 less damage from every hit', 2, [90, 200]], ['dew', 'Morning Dew', 'Heal 1 health every 4 seconds', 3, [45, 100, 170]],
];

// ---- weapons and their evolved forms ----
const WEAPON_ICONS = {
  bolt: I(16, 16, g => { polyFill(g, [[1, 12], [10, 5], [9, 3], [15, 1], [13, 7], [11, 6], [3, 14]], 'Y'); }, { Y: ['#6a4a08', '#b88a18', '#ffe066', '#fff3a0', '#ffffff'] }),
  orbit: I(16, 16, g => { ell(g, 8, 8, 7.5, 7.5, 'M'); ell(g, 10.5, 6.5, 6.2, 6.2, '.'); }, { M: P.ice }),
  nova: I(16, 16, g => { polyFill(g, starPts(8, 8, 8, 3.4, 8), 'P'); ell(g, 8, 8, 2.4, 2.4, 'w'); }, { P: P.pink, w: '#fff0fa' }),
  zap: I(16, 16, g => bolt(g, 'V'), { V: P.violet }),
  fly: I(16, 16, g => { ell(g, 6, 10, 4.5, 3.6, 'G'); ell(g, 11.5, 7.5, 2.8, 2.8, 'B'); ell(g, 7, 4, 3.4, 2.4, 'W'); put(g, 12, 7, 'e'); line(g, 13, 5, 15, 2, 'B'); }, { G: P.green, B: P.violet, W: WINGS, e: '#ffffff' }),
  frost: I(16, 16, g => { for (const a of [0, 1, 2]) { const an = a * Math.PI / 3; line(g, Math.round(8 - Math.cos(an) * 7), Math.round(8 - Math.sin(an) * 7), Math.round(8 + Math.cos(an) * 7), Math.round(8 + Math.sin(an) * 7), 'I'); } ell(g, 8, 8, 2, 2, 'I'); for (const [x, y] of [[3, 2], [13, 2], [3, 14], [13, 14], [1, 8], [15, 8]]) put(g, x, y, 'w'); }, { I: P.ice, w: '#e8fbff' }),
  thorn: I(16, 16, g => { for (let t = 0; t < 2.5; t += .05) { const r = 7 - t * 1.8; put(g, Math.round(8 + Math.cos(t * 2.4) * r), Math.round(8 + Math.sin(t * 2.4) * r), 'T'); put(g, Math.round(8 + Math.cos(t * 2.4) * (r - 1)), Math.round(8 + Math.sin(t * 2.4) * (r - 1)), 'T'); } }, { T: P.cloth }),
  spore: I(16, 16, g => { for (const [x, y, r] of [[5, 10, 4], [11, 10, 4], [8, 6, 4.5]]) ell(g, x, y, r, r * .9, 'S'); for (const [x, y] of [[6, 5], [10, 8], [4, 11]]) put(g, x, y, 'd'); }, { S: ['#3a4a10', '#6a8a1a', '#b8d84a', '#d6ff5c', '#f4ffc0'], d: '#3a4a10' }),
};
const EVOLVED_ICONS = {}; for (const k in WEAPON_ICONS) EVOLVED_ICONS[k] = px(20, 20, (c, dot) => { c.drawImage(halo(10, [242, 193, 78]), 0, 0); c.drawImage(WEAPON_ICONS[k], 1, 1); for (const [x, y] of [[1, 1], [18, 1], [1, 18], [18, 18]]) { dot(x, y, '#f2c14e'); } });
const WEAPON_NAMES = { bolt: ['Spark Shot', 'Starstorm'], orbit: ['Moon Guard', 'Harvest Moon'], nova: ['Pulse', 'Supernova'], zap: ['Chain Zap', 'Thunderhead'], fly: ['Fireflies', 'The Swarm'], frost: ['Chill Aura', 'Deep Freeze'], thorn: ['Boomerang Thorn', 'Razor Wind'], spore: ['Spore Trail', 'Full Bloom'] };

// ---- run boosts (the passives you pick on level up) ----
const PASSIVE_ICONS = {
  vigor: I(14, 13, g => heartMask(g, 7, 7.4, 5.4, 'R'), { R: P.red }), swift: UPGRADE_ICONS.wings, magnet: UPGRADE_ICONS.lure,
  power: I(14, 14, g => { polyFill(g, [[7, 0], [14, 7], [10, 7], [10, 14], [4, 14], [4, 7], [0, 7]], 'O'); }, { O: P.cloth }),
  haste: I(14, 14, g => { ell(g, 7, 7, 6.6, 6.6, 'C'); ell(g, 7, 7, 5, 5, 'w'); line(g, 7, 7, 7, 3, 'k'); line(g, 7, 7, 10, 7, 'k'); }, { C: P.brass, w: '#fff4d8', k: '#3a2208' }),
  reach: I(14, 14, g => { polyFill(g, Array.from({ length: 6 }, (_, i) => [7 + Math.cos(i * TAU / 6) * 7, 7 + Math.sin(i * TAU / 6) * 7]), 'V'); polyFill(g, Array.from({ length: 6 }, (_, i) => [7 + Math.cos(i * TAU / 6) * 3.5, 7 + Math.sin(i * TAU / 6) * 3.5]), '.'); }, { V: P.violet }),
  crit: I(15, 15, g => polyFill(g, starPts(7.5, 8, 7.5, 3), 'Y'), { Y: ['#6a5a10', '#b8a020', '#fff2a8', '#ffffe0', '#ffffff'] }),
  regen: I(14, 14, g => { line(g, 7, 13, 7, 5, 's'); ell(g, 4, 5, 3.4, 2.2, 'L'); ell(g, 10, 4, 3.4, 2.2, 'L'); }, { s: '#22622e', L: P.green }),
  wise: I(14, 14, g => { ell(g, 7, 7, 6.6, 4, 'E'); ell(g, 7, 7, 2.6, 2.6, 'p'); put(g, 6, 6, 'w'); }, { E: P.blue, p: '#0e1430', w: '#ffffff' }),
};
const PASSIVE_NAMES = { vigor: 'Big Heart', swift: 'Quick Wings', magnet: 'Magnet', power: 'Power', haste: 'Haste', reach: 'Reach', crit: 'Lucky Star', regen: 'Regrowth', wise: 'Bright Mind' };

// ---- pickups dropped in a run: a little glass bead around the icon ----
const bead = (icon, col) => px(18, 18, (c, dot) => { const g = pg(18, 18); ell(g, 9, 9, 8.6, 8.6, 'B'); c.drawImage(bake({ B: [shade(col, .15), shade(col, .25), shade(col, .32), shade(col, .45), shade(col, .7)] }, g), -1, -1); c.drawImage(icon, Math.round(9 - icon.width / 2), Math.round(9 - icon.height / 2)); dot(4, 4, 'rgba(255,255,255,.6)'); });
const PICKUPS = {
  heart: bead(PASSIVE_ICONS.vigor, '#e8604c'), magnet: bead(I(12, 12, g => { rect(g, 1, 1, 4, 10, 'R'); rect(g, 7, 1, 10, 10, 'R'); rect(g, 1, 8, 10, 10, 'R'); rect(g, 1, 1, 4, 2, 'w'); rect(g, 7, 1, 10, 2, 'w'); }, { R: P.red, w: P.stone }), '#6fd3ff'),
  zap: bead(I(11, 13, g => polyFill(g, [[7, 0], [2, 7], [5, 7], [3, 13], [10, 5], [7, 5], [9, 0]], 'V'), { V: P.violet }), '#b69cff'),
  blast: bead(I(12, 12, g => polyFill(g, starPts(6, 6, 6, 2.6, 7), 'F'), { F: P.cloth }), '#ff9a4d'),
  freeze: bead(I(12, 12, g => { line(g, 6, 0, 6, 11, 'I'); line(g, 0, 6, 11, 6, 'I'); line(g, 2, 2, 10, 10, 'I'); line(g, 10, 2, 2, 10, 'I'); }, { I: P.ice }), '#9ff0ff'),
  frenzy: bead(I(12, 10, g => { polyFill(g, [[0, 0], [5, 5], [0, 10], [2, 10], [7, 5], [2, 0]], 'Y'); polyFill(g, [[5, 0], [10, 5], [5, 10], [7, 10], [12, 5], [7, 0]], 'Y'); }, { Y: ['#6a4a08', '#b88a18', '#ffd84a', '#fff0a0', '#ffffff'] }), '#ffe066'),
};
const PICKUP_NAMES = { heart: 'Heart', magnet: 'Magnet', zap: 'Thunderclap', blast: 'Fire ring', freeze: 'Cold snap', frenzy: 'Frenzy' };
// XP sparks in three sizes
const SPARKS = [['#6fd3ff', '#d8f4ff', 5], ['#7dff9a', '#e0ffe8', 6], ['#ffd34d', '#fff6c8', 7]].map(([a, b, s]) => I(s, s, g => { const m = Math.floor((s - 1) / 2); for (let i = 0; i < s; i++) { put(g, i, m, 'a'); put(g, m, i, 'a'); } put(g, m, m, 'b'); if (s > 5) { put(g, m - 1, m - 1, 'a'); put(g, m + 1, m + 1, 'a'); put(g, m - 1, m + 1, 'a'); put(g, m + 1, m - 1, 'a'); } }, { a, b }, null));

// ---- HUD and menu icons (11x11) ----
const S = (fn, pal, w = 11, h = 11) => I(w, h, fn, pal, null);
const ICO = {
  health: S(g => heartMask(g, 5.5, 6.4, 4.4, 'R'), { R: '#e8604c' }),
  squash: S(g => { ell(g, 5.5, 6.5, 5, 3.5, 'k'); for (const [x, y] of [[1, 2], [9, 1], [5, 1], [10, 8], [0, 9]]) put(g, x, y, 'k'); put(g, 4, 6, 'w'); put(g, 7, 6, 'w'); }, { k: '#c8385e', w: '#fff2e0' }),
  firefly: S(g => { ell(g, 4, 7, 3.4, 2.6, 'g'); ell(g, 8, 5, 2, 2, 'b'); ell(g, 5, 3, 2.6, 1.6, 'w'); }, { g: '#ffe066', b: '#56447a', w: 'rgba(220,240,255,.8)' }),
  clock: S(g => { ell(g, 5.5, 5.5, 5, 5, 'c'); ell(g, 5.5, 5.5, 3.8, 3.8, 'w'); line(g, 5, 5, 5, 2, 'k'); line(g, 5, 5, 7, 5, 'k'); }, { c: '#8d9491', w: '#e9e4d6', k: '#0a0c0d' }),
  pause: S(g => { rect(g, 2, 1, 4, 9, 'w'); rect(g, 6, 1, 8, 9, 'w'); }, { w: '#e9e4d6' }),
  play: S(g => polyFill(g, [[2, 0], [10, 5.5], [2, 11]], 'w'), { w: '#e9e4d6' }),
  soundOn: S(g => { rect(g, 0, 3, 2, 7, 'w'); polyFill(g, [[2, 3], [6, 0], [6, 11], [2, 7]], 'w'); line(g, 8, 3, 8, 7, 'w'); line(g, 10, 1, 10, 9, 'w'); }, { w: '#e9e4d6' }),
  soundOff: S(g => { rect(g, 0, 3, 2, 7, 'w'); polyFill(g, [[2, 3], [6, 0], [6, 11], [2, 7]], 'w'); line(g, 7, 3, 10, 7, 'r'); line(g, 10, 3, 7, 7, 'r'); }, { w: '#e9e4d6', r: '#e8604c' }),
  music: S(g => { rect(g, 4, 0, 10, 1, 'w'); rect(g, 4, 0, 4, 8, 'w'); rect(g, 10, 0, 10, 7, 'w'); ell(g, 3, 9, 2, 1.6, 'w'); ell(g, 9, 8, 2, 1.6, 'w'); }, { w: '#e9e4d6' }),
  gear: S(g => { polyFill(g, starPts(5.5, 5.5, 5.5, 4, 8, 0), 'w'); ell(g, 5.5, 5.5, 1.8, 1.8, '.'); }, { w: '#e9e4d6' }),
  lock: S(g => { rect(g, 3, 0, 7, 0, 'l'); rect(g, 2, 1, 2, 4, 'l'); rect(g, 8, 1, 8, 4, 'l'); rect(g, 1, 4, 9, 10, 'L'); put(g, 5, 7, 'k'); put(g, 5, 8, 'k'); }, { l: '#a8701c', L: '#d8a03a', k: '#1a1208' }),
  unlock: S(g => { rect(g, 6, 0, 10, 0, 'l'); rect(g, 10, 1, 10, 3, 'l'); rect(g, 6, 1, 6, 4, 'l'); rect(g, 1, 4, 9, 10, 'L'); put(g, 5, 7, 'k'); }, { l: '#a8701c', L: '#d8a03a', k: '#1a1208' }),
  check: S(g => { line(g, 1, 5, 4, 8, 'm'); line(g, 4, 8, 10, 1, 'm'); line(g, 1, 6, 4, 9, 'm'); line(g, 4, 9, 10, 2, 'm'); }, { m: '#7fd6c2' }),
  cross: S(g => { line(g, 1, 1, 9, 9, 'r'); line(g, 9, 1, 1, 9, 'r'); line(g, 2, 1, 10, 9, 'r'); line(g, 10, 1, 2, 9, 'r'); }, { r: '#e8604c' }),
  star: S(g => polyFill(g, starPts(5.5, 6, 5.6, 2.3), 'y'), { y: '#f2c14e' }),
  crown: S(g => { polyFill(g, [[0, 2], [3, 5], [5.5, 0], [8, 5], [11, 2], [10, 9], [1, 9]], 'y'); put(g, 5, 6, 'r'); }, { y: '#f2c14e', r: '#e8604c' }),
  moon: S(g => { ell(g, 5.5, 5.5, 5, 5, 'm'); ell(g, 7.5, 4, 4, 4, '.'); }, { m: '#7fd6c2' }),
  nightmare: S(g => { ell(g, 5.5, 4.5, 5, 4.5, 'r'); rect(g, 2, 8, 9, 10, 'r'); put(g, 3, 4, 'k'); put(g, 4, 4, 'k'); put(g, 7, 4, 'k'); put(g, 8, 4, 'k'); for (const x of [3, 5, 7]) put(g, x, 9, 'k'); }, { r: '#e8604c', k: '#0a0c0d' }),
  back: S(g => { polyFill(g, [[0, 5.5], [5, 1], [5, 4], [11, 4], [11, 7], [5, 7], [5, 10]], 'w'); }, { w: '#e9e4d6' }),
  close: S(g => { line(g, 1, 1, 9, 9, 'w'); line(g, 9, 1, 1, 9, 'w'); }, { w: '#e9e4d6' }),
  amber: AMBER_SMALL,
};
