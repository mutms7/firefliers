// ---------- tiles (16x16), painted pixel by pixel. Clusters wrap across edges so the grid doesn't show. ----------
const T16 = 16;
function tile(fn, seed) { reseed(seed); return px(T16, T16, (c, dot, box) => fn(c, dot, box)); }
const wrap = v => ((v % 16) + 16) % 16;
// a tuft: a little two- or three-blade "v" of lighter pixels with a dark root
function tuft(dot, x, y, light, dark) { dot(wrap(x), wrap(y), dark); dot(wrap(x - 1), wrap(y - 1), light); dot(wrap(x + 1), wrap(y - 1), light); if (rnd() < .5) dot(wrap(x), wrap(y - 2), light); }
const HUB = { grass: ['#0d1715', '#132320', '#1a2f29', '#244034', '#335440'], dirt: ['#15110f', '#211a15', '#2e241c', '#3e3226', '#544434'], water: ['#071420', '#0b2030', '#11304a', '#1b4866', '#3a7090'] };
function grassTile(seed, flowers, pal = HUB.grass) {
  return tile((c, dot, box) => {
    box(0, 0, 16, 16, pal[2]);
    for (let i = 0; i < 26; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, rnd() < .5 ? pal[1] : pal[3]); // speckle
    for (let i = 0; i < 4; i++) tuft(dot, (rnd() * 16) | 0, (rnd() * 16) | 0, pal[4], pal[1]);
    if (flowers) for (let i = 0; i < 2; i++) { const x = (rnd() * 14 + 1) | 0, y = (rnd() * 14 + 1) | 0, col = ['#ff9ac8', '#a8c8ff', '#ffe066', '#c8b0ff'][(rnd() * 4) | 0]; dot(x, y, col); dot(wrap(x + 1), y, col); dot(x, wrap(y + 1), pal[1]); }
  }, seed);
}
function dirtTile(seed) { return tile((c, dot, box) => { box(0, 0, 16, 16, HUB.dirt[2]); for (let i = 0; i < 30; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, rnd() < .6 ? HUB.dirt[1] : HUB.dirt[3]); for (let i = 0; i < 3; i++) { const x = (rnd() * 15) | 0, y = (rnd() * 15) | 0; dot(x, y, HUB.dirt[4]); dot(x + 1, y, HUB.dirt[3]); dot(x, y + 1, HUB.dirt[0]); dot(x + 1, y + 1, HUB.dirt[1]); } }, seed); }
// stepping slabs set into dirt: lit top-left edge, shadow bottom-right, mortar in between
function slabTile(seed) {
  return tile((c, dot, box) => {
    box(0, 0, 16, 16, HUB.dirt[1]);
    for (const [x0, y0, w, h] of [[1, 1, 7, 6], [9, 1, 6, 7], [1, 8, 6, 7], [8, 9, 7, 6]]) {
      box(x0, y0, w, h, P.stone[2]); box(x0, y0, w, 1, P.stone[3]); box(x0, y0, 1, h, P.stone[3]); box(x0, y0 + h - 1, w, 1, P.stone[1]); box(x0 + w - 1, y0, 1, h, P.stone[1]);
      if (rnd() < .6) dot(x0 + 2 + ((rnd() * (w - 3)) | 0), y0 + 2 + ((rnd() * (h - 3)) | 0), P.stone[1]);
      if (rnd() < .5) dot(x0 + 1, y0 + 1, P.stone[4]);
    }
    for (let i = 0; i < 4; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, '#3a6040');
  }, seed);
}
function waterTile(f) {
  return tile((c, dot, box) => {
    box(0, 0, 16, 16, HUB.water[2]);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (((x + y * 3 + f * 2) % 11) === 0 && y % 4 === 1) { dot(x, y, HUB.water[4]); dot(wrap(x + 1), y, HUB.water[3]); dot(x, wrap(y + 2), HUB.water[1]); }
    for (let i = 0; i < 10; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, HUB.water[1]);
  }, 5);
}
// grass meeting water: a lip of grass, a one-pixel dark shadow, then water
function shoreTile(f) { const w = waterTile(f), gr = grassTile(3); return px(16, 16, (c, dot) => { c.drawImage(w, 0, 0); c.drawImage(gr, 0, 0, 16, 5, 0, 0, 16, 5); for (let x = 0; x < 16; x++) { const lip = 4 + ((x * 5) % 3 === 0 ? 1 : 0); dot(x, lip, HUB.grass[1]); dot(x, lip + 1, HUB.water[0]); if (x % 5 === 2) dot(x, lip + 3, HUB.water[4]); } }); }
// the root walls around the Hollow: a gnarled top face, then a bark face with a shadow under it
function rootTop(seed) { return tile((c, dot, box) => { box(0, 0, 16, 16, P.bark[2]); for (let y = 1; y < 16; y += 4) for (let x = 0; x < 16; x++) if ((x + y + ((rnd() * 3) | 0)) % 5) dot(x, wrap(y + ((x >> 2) % 2)), P.bark[3]); for (let i = 0; i < 12; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, P.bark[1]); for (let i = 0; i < 5; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, '#3a6a3a'); }, seed); }
function rootFace(seed) { return tile((c, dot, box) => { box(0, 0, 16, 16, P.bark[1]); for (let x = 0; x < 16; x += 3) for (let y = 0; y < 16; y++) if (rnd() < .8) dot(wrap(x + ((y >> 2) % 2)), y, P.bark[2]); box(0, 0, 16, 1, P.bark[3]); box(0, 14, 16, 2, P.bark[0]); for (let i = 0; i < 3; i++) { const x = (rnd() * 14) | 0; dot(x, 1, '#4a7a46'); dot(x + 1, 1, '#4a7a46'); dot(x, 2, '#2e5a32'); } }, seed); }
function plankTile(seed) { return tile((c, dot, box) => { for (let y = 0; y < 16; y += 4) { box(0, y, 16, 4, P.wood[2]); box(0, y, 16, 1, P.wood[3]); box(0, y + 3, 16, 1, P.wood[1]); const cut = (y * 5 + 3) % 16; box(cut, y, 1, 4, P.wood[0]); } for (let i = 0; i < 6; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, P.wood[1]); }, seed); }
function mossTile(seed) { return tile((c, dot, box) => { box(0, 0, 16, 16, '#1e3a24'); for (let i = 0; i < 60; i++) dot((rnd() * 16) | 0, (rnd() * 16) | 0, ['#2e5a32', '#173020', '#3a6a3a'][(rnd() * 3) | 0]); }, seed); }

const HUB_TILES = {
  grass: [grassTile(1), grassTile(2), grassTile(3), grassTile(4, true)], dirt: [dirtTile(11), dirtTile(12)], slab: [slabTile(21), slabTile(22)], moss: [mossTile(41)],
  water: [waterTile(0), waterTile(1)], shore: [shoreTile(0), shoreTile(1)], rootTop: [rootTop(51), rootTop(52)], rootFace: [rootFace(61), rootFace(62)], plank: [plankTile(71)],
};

// the run's meadow: the same ruin as now, but as 16x16 tiles. Darker and colder than the hub, so the creatures pop.
const RUN = { grass: ['#0a1112', '#0f1918', '#152220', '#1d2e29', '#2a4036'] };
function runSlab(seed, cracked) { return tile((c, dot, box) => { box(0, 0, 16, 16, RUN.grass[2]); box(1, 1, 14, 14, '#1c2426'); box(1, 1, 14, 1, '#28322f'); box(1, 1, 1, 14, '#28322f'); box(1, 14, 14, 1, '#111819'); box(14, 1, 1, 14, '#111819'); if (cracked) { let x = 5, y = 1; while (y < 15) { dot(x, y, '#0a0f10'); y++; if (rnd() < .4) x += rnd() < .5 ? -1 : 1; } } for (let i = 0; i < 10; i++) dot(1 + ((rnd() * 14) | 0), 1 + ((rnd() * 14) | 0), rnd() < .5 ? '#2e4a34' : '#161e20'); }, seed); }
function puddle(f) { return tile((c, dot, box) => { box(0, 0, 16, 16, RUN.grass[2]); for (let y = 3; y < 13; y++) for (let x = 2; x < 14; x++) if (((x - 7.5) / 6) ** 2 + ((y - 7.5) / 4.6) ** 2 < 1) dot(x, y, y < 5 ? '#0b1a24' : '#0e2230'); for (let x = 4; x < 12; x++) dot(x, 4, '#05101a'); dot(6 + f, 7, '#3a6a88'); dot(7 + f, 7, '#2a5070'); dot(9 - f, 10, '#2a5070'); }, 81); }
function rebarTile(seed) { return tile((c, dot, box) => { c.drawImage(grassTile(seed, false, RUN.grass), 0, 0); let x = 2, y = 13; for (let i = 0; i < 12; i++) { dot(x, y, '#4a2c1e'); dot(x, y - 1, '#8a5232'); x++; if (i % 3 === 0) y--; } }, seed); }
function sporeTile(seed) { return tile((c, dot) => { c.drawImage(grassTile(seed, false, RUN.grass), 0, 0); for (const [x, y, col] of [[4, 5, '#7fb9b0'], [10, 11, '#a99cc4'], [12, 3, '#c2b48a']]) { dot(x, y, col); dot(x + 1, y + 1, col); dot(x - 1, y + 2, col); } }, seed); }
const RUN_TILES = { grass: [grassTile(91, false, RUN.grass), grassTile(92, false, RUN.grass), grassTile(93, false, RUN.grass), grassTile(94, false, RUN.grass)], slab: [runSlab(101), runSlab(102, true)], puddle: [puddle(0), puddle(1)], rebar: [rebarTile(111)], spores: [sporeTile(121)] };
// run props, top-down-ish: a broken pillar stump, a ring of standing stones, a dead lamp post, a mushroom cluster, a root arch
const STUMP = bake({ S: P.stone, d: '#16181e', m: '#3a6a3a' }, (() => { const g = pg(18, 14); ell(g, 9, 9, 8.5, 5, 'S'); ell(g, 9, 6, 8.5, 5, 'S'); ell(g, 9, 6, 6, 3.4, 'd'); for (let x = 3; x < 15; x += 3) put(g, x, 4 - (x % 2), 'S'); put(g, 4, 9, 'm'); put(g, 13, 10, 'm'); return g; })());
const STANDING = bake({ S: P.mossStone, m: '#4a7a46' }, (() => { const g = pg(10, 18); polyFill(g, [[2, 17], [1, 5], [4, 0], [8, 3], [9, 17]], 'S'); put(g, 3, 6, 'm'); put(g, 4, 7, 'm'); return g; })());
const DEAD_LAMP = bake({ t: '#2a2420', L: ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a'], g: '#2a3a4a' }, (() => { const g = pg(9, 24); rect(g, 4, 6, 4, 23, 't'); rect(g, 1, 1, 7, 1, 'L'); rect(g, 2, 2, 6, 5, 'L'); rect(g, 3, 2, 5, 4, 'g'); put(g, 6, 7, 't'); put(g, 7, 8, 't'); return g; })());
