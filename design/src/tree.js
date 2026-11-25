// ---------- the Root Tree: one skill tree instead of separate upgrades ----------
// Three branches grow from First Light: Light (your attacks), Wing (dashing and your fireflies), Root (staying alive and amber).
// Bridges between neighbouring branches unlock new weapons. Descriptions are a few words; trying things teaches the rest.
const BR = { light: { col: '#f2c14e', dark: '#5a4210', name: 'Light' }, wing: { col: '#7fd6c2', dark: '#1e4a40', name: 'Wing' }, root: { col: '#8fd06a', dark: '#24481e', name: 'Root' }, core: { col: '#fff3a0', dark: '#5a4a10', name: '' } };
const ICON24 = (fn, pal) => { const g = pg(24, 24); fn(g); return bake(pal, g); };
const GOLD = ['#6a4a08', '#b88a18', '#ffd84a', '#fff0a0', '#ffffff'];
const TREE_ICONS = {
  first: ICON24(g => { polyFill(g, starPts(12, 12, 11, 4, 8), 'Y'); ell(g, 12, 12, 4.4, 4.4, 'W'); }, { Y: GOLD, W: '#ffffff' }),
  bright: ICON24(g => { for (let i = 0; i < 8; i++) { const a = i * TAU / 8; line(g, Math.round(12 + Math.cos(a) * 7), Math.round(12 + Math.sin(a) * 7), Math.round(12 + Math.cos(a) * 11), Math.round(12 + Math.sin(a) * 11), 'y'); } ell(g, 12, 12, 6, 6, 'Y'); }, { Y: GOLD, y: '#ffd84a' }),
  twin: ICON24(g => { for (const dy of [-5, 5]) polyFill(g, [[2, 12 + dy], [14, 9 + dy], [13, 7 + dy], [22, 12 + dy], [13, 17 + dy], [14, 15 + dy]], 'Y'); }, { Y: GOLD }),
  chain: ICON24(g => { polyFill(g, [[14, 0], [4, 13], [10, 13], [7, 24], [20, 9], [13, 9], [17, 0]], 'V'); }, { V: P.violet }),
  thorn: ICON24(g => { for (let t = 0; t < 2.7; t += .03) { const r = 10.5 - t * 2.6; for (const d of [0, 1, 2]) put(g, Math.round(12 + Math.cos(t * 2.4) * (r - d)), Math.round(12 + Math.sin(t * 2.4) * (r - d)), 'T'); } polyFill(g, [[20, 9], [23, 13], [18, 13]], 'T'); }, { T: P.cloth }),
  overflow: ICON24(g => { for (const y0 of [2, 10]) polyFill(g, [[12, y0], [21, y0 + 9], [16, y0 + 9], [12, y0 + 5], [8, y0 + 9], [3, y0 + 9]], 'Y'); rect(g, 10, 19, 13, 23, 'Y'); }, { Y: GOLD }),
  wings: ICON24(g => { ell(g, 14, 9, 9, 6.4, 'W'); ell(g, 13, 16, 7, 4.4, 'W'); line(g, 6, 12, 20, 6, 'w'); for (const y of [5, 11, 17]) line(g, 0, y, 3, y, 's'); }, { W: P.ice, w: '#2e6a80', s: '#e8fbff' }),
  trail: ICON24(g => { for (const [x, y, r] of [[4, 19, 3], [11, 13, 3.6], [19, 5, 4.2]]) { ell(g, x, y, r, r, 'G'); put(g, x - 1, y - 1, 'w'); } for (const [x, y] of [[7, 17], [15, 9]]) put(g, x, y, 'g'); }, { G: GOLD, w: '#ffffff', g: '#ffd84a' }),
  ember: ICON24(g => { polyFill(g, [[0, 20], [14, 8], [12, 4], [23, 2], [20, 13], [17, 11], [3, 23]], 'F'); polyFill(g, [[6, 18], [15, 10], [18, 6], [19, 9]], 'y'); }, { F: P.cloth, y: '#ffe066' }),
  double: ICON24(g => { for (const x0 of [1, 10]) polyFill(g, [[x0, 2], [x0 + 6, 2], [x0 + 13, 12], [x0 + 6, 22], [x0, 22], [x0 + 7, 12]], 'M'); }, { M: P.teal }),
  swarm: ICON24(g => { for (const [x, y, r] of [[7, 8, 3.4], [16, 6, 3], [12, 15, 4], [19, 15, 2.6], [5, 17, 2.4]]) ell(g, x, y, r, r, 'G'); for (const [x, y] of [[22, 4], [23, 3], [1, 2], [2, 3]]) put(g, x, y, 'w'); }, { G: GOLD, w: '#ffffff' }),
  shell: ICON24(g => { ell(g, 12, 12, 11, 11, 'S'); line(g, 12, 1, 12, 23, 'd'); heartMask(g, 12, 13, 5, 'R'); }, { S: P.violet, d: '#1e1040', R: P.red }),
  amber: ICON24(g => { polyFill(g, [[11, 1], [20, 7], [18, 19], [11, 23], [4, 19], [2, 7]], 'A'); put(g, 7, 6, 'w'); put(g, 8, 7, 'w'); put(g, 7, 7, 'w'); polyFill(g, starPts(19, 4, 4, 1.4, 4), 's'); }, { A: P.amber, w: '#fff6d8', s: '#ffffff' }),
  fourth: ICON24(g => { for (const [x, y] of [[1, 4], [6, 3], [11, 3], [16, 4]]) rect(g, x, y, x + 6, y + 15, 'C'); for (const [x, y] of [[1, 4], [6, 3], [11, 3], [16, 4]]) { rect(g, x, y, x, y + 15, 'd'); } rect(g, 18, 8, 20, 13, 'y'); }, { C: P.cream, d: '#4a3a2a', y: '#ffd84a' }),
  secondWind: ICON24(g => { heartMask(g, 12, 13, 7.4, 'R'); for (const s of [-1, 1]) { polyFill(g, [[12 + s * 6, 10], [12 + s * 12, 4], [12 + s * 11, 9], [12 + s * 12, 13], [12 + s * 7, 14]], 'W'); } }, { R: P.red, W: ['#6a6a7a', '#a0a0b0', '#d8d8e6', '#f4f4ff', '#ffffff'] }),
  deepRoots: ICON24(g => { ell(g, 12, 7, 6, 6, 'H'); for (const [a, c] of [[[12, 12], [4, 23]], [[12, 12], [12, 23]], [[12, 12], [20, 23]], [[12, 14], [1, 17]], [[12, 14], [23, 17]]]) blob(g, bez(a, [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2 + 2], c, 8), 1.6, .6, 'B'); }, { H: P.red, B: P.bark }),
  spores: ICON24(g => { for (const [x, y, r] of [[7, 15, 6], [16, 15, 6], [12, 8, 6.5]]) ell(g, x, y, r, r * .9, 'S'); for (const [x, y] of [[9, 7], [15, 13], [6, 16], [2, 3], [21, 4]]) put(g, x, y, 'd'); }, { S: ['#3a4a10', '#6a8a1a', '#b8d84a', '#d6ff5c', '#f4ffc0'], d: '#3a4a10' }),
  chill: ICON24(g => { for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3; for (const o of [0, 1]) line(g, Math.round(12 - Math.cos(an) * 11 + o * Math.sin(an)), Math.round(12 - Math.sin(an) * 11), Math.round(12 + Math.cos(an) * 11 + o * Math.sin(an)), Math.round(12 + Math.sin(an) * 11), 'I'); } ell(g, 12, 12, 3, 3, 'I'); }, { I: P.ice }),
  rerolls: ICON24(g => { for (let t = .4; t < 5.6; t += .04) for (const d of [0, 1, 2]) put(g, Math.round(12 + Math.cos(t) * (9 - d)), Math.round(12 + Math.sin(t) * (9 - d)), 'G'); polyFill(g, [[18, 0], [23, 6], [16, 8]], 'G'); }, { G: P.green }),
};
// moth and beetle unlock nodes show the bug itself
TREE_ICONS.moth = px(24, 24, c => { c.drawImage(BUGS.moth[0], 4, 6); });
TREE_ICONS.beetle = px(24, 24, c => { c.drawImage(BUGS.beetle[0], 4, 6); });

// [id, branch, icon, name, short description, cost, x, y, requires]
const TREE = [
  ['first', 'core', 'first', 'First Light', 'Where it starts', 0, 0, 0, []],
  ['bright', 'light', 'bright', 'Brighter', '+10% damage', 50, -2, -1, ['first']],
  ['twin', 'light', 'twin', 'Twin Spark', 'Spark Shot fires two', 110, -3.2, -2, ['bright']],
  ['chain', 'light', 'chain', 'Chain Zap', 'New weapon', 85, -1.9, -2.3, ['bright']],
  ['thorn', 'light', 'thorn', 'Boomerang Thorn', 'New weapon', 130, -3.6, -3.2, ['twin']],
  ['overflow', 'light', 'overflow', 'Overflow', 'Evolve a level sooner', 360, -3, -4.6, ['thorn', 'chain']],
  ['wings', 'wing', 'wings', 'Quick Wings', 'Dash recharges faster', 50, 0, -1.3, ['first']],
  ['ember', 'wing', 'ember', 'Ember Dash', 'Dashes leave fire', 145, -.6, -2.5, ['wings']],
  ['trail', 'wing', 'trail', 'Long Trail', 'Start with 2 more fireflies', 85, .7, -2.5, ['wings']],
  ['moth', 'wing', 'moth', 'Moth', 'Joins the Roost', 120, .1, -3.6, ['ember', 'trail']],
  ['double', 'wing', 'double', 'Double Dash', 'Two dash charges', 240, -.8, -4.6, ['moth']],
  ['swarm', 'wing', 'swarm', 'Swarm', 'Your fireflies shoot', 380, .8, -4.8, ['moth']],
  ['shell', 'root', 'shell', 'Thick Shell', '+15 max health', 50, 2, -1, ['first']],
  ['amber', 'root', 'amber', 'Amber Sense', '+15% amber', 70, 3.2, -2, ['shell']],
  ['beetle', 'root', 'beetle', 'Beetle', 'Joins the Roost', 120, 1.9, -2.3, ['shell']],
  ['fourth', 'root', 'fourth', 'Fourth Card', 'Level ups offer four', 205, 3.6, -3.2, ['amber']],
  ['rerolls', 'root', 'rerolls', 'Second Look', '+2 rerolls', 110, 2.2, -3.5, ['beetle']],
  ['wind', 'root', 'secondWind', 'Second Wind', 'Get up once per run', 290, 3, -4.6, ['fourth', 'rerolls']],
  ['roots', 'root', 'deepRoots', 'Deep Roots', 'Bosses heal you halfway', 335, 4.4, -4.4, ['fourth']],
  ['spores', 'light', 'spores', 'Spore Trail', 'New weapon', 95, -1, -1.6, ['bright', 'wings']],
  ['chill', 'root', 'chill', 'Chill Aura', 'New weapon', 95, 1, -1.6, ['wings', 'shell']],
];
const NODE = {}; for (const n of TREE) NODE[n[0]] = { id: n[0], br: n[1], icon: TREE_ICONS[n[2]], name: n[3], desc: n[4], cost: n[5], x: n[6], y: n[7], req: n[8] };
// a node badge: a round frame in its branch colour around the icon. owned = lit, open = ring, locked = dim.
function badge(node, state) {
  const b = BR[node.br];
  return px(34, 34, (c, dot) => {
    const g = pg(34, 34); ell(g, 17, 17, 16.6, 16.6, 'O'); ell(g, 17, 17, 14.6, 14.6, 'I');
    c.drawImage(bake({ O: state === 'locked' ? '#283030' : state === 'open' ? b.col : state === 'off' ? b.dark : '#ffffff', I: state === 'owned' ? '#1a1a14' : '#0a0e10' }, g, '#030405'), -1, -1);
    if (state === 'owned') { const r = pg(34, 34); ell(r, 17, 17, 14.6, 14.6, 'x'); ell(r, 17, 17, 13.4, 13.4, '.'); c.drawImage(bake({ x: b.col }, r, null), 0, 0); }
    c.drawImage(state === 'locked' || state === 'off' ? px(24, 24, ic => { ic.drawImage(node.icon, 0, 0); ic.globalCompositeOperation = 'source-atop'; ic.fillStyle = 'rgba(8,12,14,.72)'; ic.fillRect(0, 0, 24, 24); }) : node.icon, 5, 5);
  });
}
// the whole tree as one picture in art pixels: bark, branch veins (lit once both ends are grown) and the badges.
// state(n) is 'owned', 'open' or 'locked'. treeAt(n) is a node's centre on that picture; First Light sits at the bottom.
const TREE_U = 58, TREE_W = Math.round(10.6 * TREE_U), TREE_H = Math.round(6.6 * TREE_U);
const treeAt = n => [Math.round((n.x + 4.6) * TREE_U), Math.round((n.y + 5.5) * TREE_U)];
const BR_RGB = { light: [242, 193, 78], wing: [127, 214, 194], root: [143, 208, 106], core: [242, 193, 78] };
const badgeMemo = {}, haloMemo = {};
let treeBark = null;
const treeCurve = (a, b, n) => { const [x0, y0] = treeAt(a), [x1, y1] = treeAt(b); return bez([x0, y0], [(x0 + x1) / 2 + (x1 - x0) * .1, (y0 + y1) / 2 + 6], [x1, y1], n); };
function barkLayer() {
  if (treeBark) return treeBark;
  const nodes = TREE.map(t => NODE[t[0]]);
  return treeBark = px(TREE_W, TREE_H, c => {
    c.fillStyle = '#080b0c'; c.fillRect(0, 0, TREE_W, TREE_H); reseed(64);
    for (let i = 0; i < 900; i++) { c.fillStyle = rnd() < .5 ? '#0c1012' : '#06090a'; c.fillRect((rnd() * TREE_W) | 0, (rnd() * TREE_H) | 0, 2, 1); }
    // only the part of the grid each branch touches gets filled, so this stays quick
    const [rx, ry] = treeAt(NODE.first), g = pg(TREE_W, TREE_H);
    const fat = (pts, r0, r1) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; for (let t = 0; t <= 1; t += .1) { const k = (i + t) / (pts.length - 1), r = r0 + (r1 - r0) * k, cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t; for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(TREE_H - 1, Math.ceil(cy + r)); y++) for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(TREE_W - 1, Math.ceil(cx + r)); x++) if ((x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r) g[y][x] = 'B'; } } };
    fat(bez([rx, TREE_H], [rx - 4, ry + 40], [rx, ry]), 9, 5);
    for (const [a, b] of [[[rx - 6, TREE_H], [rx - 40, TREE_H - 6]], [[rx + 6, TREE_H], [rx + 44, TREE_H - 4]]]) fat([a, b], 4, 1.5);
    for (const n of nodes) for (const r of n.req) fat(treeCurve(NODE[r], n, 14), 3.4, 2.6);
    c.drawImage(bake({ B: P.bark }, g, '#030405'), -1, -1);
  });
}
function treeArt(state) {
  const nodes = TREE.map(t => NODE[t[0]]), grownish = s => s === 'owned' || s === 'off';
  return px(TREE_W, TREE_H, c => {
    c.drawImage(barkLayer(), 0, 0);
    for (const n of nodes) for (const r of n.req) { const a = state(NODE[r]), b = state(n), lit = a === 'owned' && b === 'owned', open = grownish(a); c.fillStyle = lit ? BR[n.br].col : open ? BR[n.br].dark : '#2a1c14'; for (const [x, y] of treeCurve(NODE[r], n, 40)) c.fillRect(Math.round(x), Math.round(y), 1, 1); }
    for (const n of nodes) { const [x, y] = treeAt(n), s = state(n); if (s === 'owned') c.drawImage(haloMemo[n.br] || (haloMemo[n.br] = halo(24, BR_RGB[n.br], 4)), x - 24, y - 24); c.drawImage(badgeMemo[n.id + s] || (badgeMemo[n.id + s] = badge(n, s)), x - 17, y - 17); }
  });
}
