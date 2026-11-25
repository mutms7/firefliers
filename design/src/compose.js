// ---------- page assembly ----------
document.getElementById('kit').textContent = kitCSS();
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
// a crisp, integer-scaled view of a canvas (or a cycling set of frames)
function view(frames, scale, ms = 420) {
  frames = Array.isArray(frames) ? frames : [frames]; const f0 = frames[0], cv = document.createElement('canvas');
  cv.width = f0.width * scale; cv.height = f0.height * scale; cv.className = 'px'; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
  let i = 0; const draw = () => { c.clearRect(0, 0, cv.width, cv.height); const f = frames[i % frames.length]; c.drawImage(f, 0, 0, f.width * scale, f.height * scale); };
  draw(); if (frames.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => { i++; draw(); }, ms);
  return cv;
}
function card(parent, frames, scale, name, note, opt = {}) {
  const f = el('figure', 'card' + (opt.wide ? ' wide' : '')); const stage = el('div', 'stage' + (opt.light ? ' light' : '')); stage.appendChild(view(frames, scale, opt.ms)); f.appendChild(stage);
  const cap = el('figcaption'); cap.appendChild(el('b', '', name)); if (note) cap.appendChild(el('span', '', note)); f.appendChild(cap); parent.appendChild(f); return f;
}
const grid = id => { const g = el('div', 'grid'); $(id).appendChild(g); return g; };

// ---- 1. the Hollow, laid out ----
function hubMap() {
  const W = 34, H = 22, M = px(W * 16, H * 16, () => {}), c = M.getContext('2d'); reseed(77);
  const pick = a => a[(rnd() * a.length) | 0];
  const T = Array.from({ length: H }, () => Array(W).fill('g'));
  const fill = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) T[y][x] = t; };
  fill(13, 9, 20, 13, 'd'); fill(13, 3, 19, 6, 'd'); fill(3, 8, 10, 13, 'p'); fill(2, 15, 13, 19, 'd');
  fill(11, 11, 13, 11, 's'); fill(14, 12, 19, 12, 's'); fill(14, 9, 14, 12, 's'); fill(19, 9, 19, 12, 's'); fill(5, 11, 11, 11, 'p'); fill(16, 7, 17, 8, 's'); fill(16, 14, 17, 15, 's'); fill(10, 14, 16, 14, 's'); fill(9, 14, 9, 15, 's'); fill(21, 11, 24, 11, 's'); fill(21, 6, 26, 6, 's');
  fill(25, 12, 31, 19, 'w'); fill(25, 11, 31, 11, 'S'); fill(17, 17, 23, 20, 'd'); fill(25, 2, 31, 8, 'd');
  fill(0, 0, W - 1, 1, 'R'); fill(0, 2, W - 1, 2, 'F'); fill(0, 0, 1, H - 1, 'R'); fill(W - 2, 0, W - 1, H - 1, 'R'); fill(0, H - 1, W - 1, H - 1, 'R');
  const tiles = { g: HUB_TILES.grass, d: HUB_TILES.dirt, p: HUB_TILES.plank, s: HUB_TILES.slab, w: HUB_TILES.water, S: HUB_TILES.shore, R: HUB_TILES.rootTop, F: HUB_TILES.rootFace };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.drawImage(pick(tiles[T[y][x]]), x * 16, y * 16);
  // props sorted by their feet, with a soft pixel shadow under each
  const props = [];
  const at = (img, tx, ty, shadow = true) => props.push({ img, x: tx * 16, y: ty * 16, shadow });
  at(LANTERN_GATE[0], 15.2, 9); at(SHRINE[0], 20.6, 8); at(TABLET, 14.6, 4.3); at(CART[0], 3.2, 8.4); at(flipX(GLIM[0]), 8.6, 10.2);
  at(CRATE, 2.3, 11.8); at(JAR[0], 3.4, 12.3); at(BENCH, 18.5, 12.6); at(SIGNPOST, 11.8, 13.4); at(REED_GATE, 22.6, 9.6); at(SOON_BOARD, 27.4, 9.9); at(LOG, 16.4, 15.7); at(SOON_BOARD, 21.2, 16.2);
  at(RUBBLE, 24.8, 7.2); at(PILLAR, 27, 4.5); at(TELESCOPE, 28.5, 4); at(SOON_BOARD, 25, 2.4);
  for (const [i, x] of [[0, 2.6], [1, 4.6], [2, 6.6], [3, 8.6], [4, 10.6]]) { at(PERCH[i], x, 16.2); props.push({ img: i > 2 ? px(18, 14, cc => { cc.drawImage(bake({ B: '#1a2020' }, bugRows[Object.keys(BUGS)[i]][0].map(r => r.replace(/[^.]/g, 'B'))), 0, 0); }) : BUGS[Object.keys(BUGS)[i]][0], x: x * 16 - 1, y: 16.2 * 16 - 9, shadow: false, z: 1 }); }
  for (const [x, y] of [[12.2, 8.6], [21.4, 12.2], [12.2, 2.8], [2.4, 14], [20.5, 3]]) at(LAMP_POST[0], x, y);
  for (const [i, x, y] of [[0, 5.6, 6.8], [1, 30.6, 9.8], [2, 13.6, 19.6], [0, 22.6, 4.4], [1, 2.4, 19.4], [2, 31.4, 2.6]]) at(GLOW_SHROOMS[i], x, y, false);
  for (const [x, y] of [[6.6, 2.6], [23.4, 13.6], [12, 20.2], [31, 20.1], [2, 5.4]]) at(BUSH, x, y);
  for (const [x, y] of [[26, 13], [28.4, 15.4], [30, 17.6], [26.6, 18]]) at(LILY, x, y, false);
  for (const [x, y] of [[24.6, 12.4], [31.2, 12.6], [24.7, 17.6]]) at(REEDS, x, y, false);
  for (const [i, x, y] of [[0, 6.3, 5], [1, 21.3, 14.3], [2, 9.4, 20.3], [0, 18.5, 2.9], [1, 3.2, 3.4]]) at(FLOWERS[i], x, y, false);
  at(SHELLBY[0], 19, 18.2);
  props.sort((a, b) => (a.y + a.img.height + (a.z || 0)) - (b.y + b.img.height + (b.z || 0)));
  for (const p of props) { if (p.shadow) { c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(Math.round(p.x + p.img.width / 2), Math.round(p.y + p.img.height - 1), Math.round(p.img.width * .42), 3, 0, 0, TAU); c.fill(); } c.drawImage(p.img, Math.round(p.x), Math.round(p.y)); }
  // lighting: a dusky wash with warm holes where the lanterns are, then the locked corners sink into fog
  const dark = px(M.width, M.height, (dc) => { dc.fillStyle = 'rgba(6,10,14,.32)'; dc.fillRect(0, 0, M.width, M.height); dc.globalCompositeOperation = 'destination-out'; for (const [x, y, r] of [[16.5, 11, 70], [4 * 16 + 40, 9 * 16 + 30, 64], [21.5, 9.5, 34], [12.6, 9.4, 30], [21.8, 13, 30], [12.6, 3.6, 30], [2.8, 14.8, 30], [20.9, 3.8, 30], [7, 17.5, 50], [15.5, 5.5, 34]]) { const X = x > 40 ? x : x * 16, Y = y > 40 ? y : y * 16; dc.drawImage(halo(r, [255, 255, 255], 5), X - r, Y - r); } });
  c.drawImage(dark, 0, 0);
  c.globalCompositeOperation = 'lighter'; for (const [x, y, r] of [[16.5, 11, 46], [5.5, 10, 40], [21.5, 9.5, 20], [12.6, 9.3, 18], [21.8, 12.9, 18], [12.6, 3.5, 18], [2.8, 14.7, 18], [20.9, 3.7, 18]]) c.drawImage(halo(r, [255, 200, 110], 4), x * 16 - r, y * 16 - r); c.globalCompositeOperation = 'source-over';
  const fog = (x0, y0, x1, y1) => { c.fillStyle = 'rgba(8,12,18,.55)'; c.fillRect(x0 * 16, y0 * 16, (x1 - x0 + 1) * 16, (y1 - y0 + 1) * 16); for (let y = y0 * 16; y < (y1 + 1) * 16; y += 2) for (let x = x0 * 16 + (y % 4 ? 1 : 0); x < (x1 + 1) * 16; x += 4) { c.fillStyle = 'rgba(30,40,50,.25)'; c.fillRect(x, y, 1, 1); } };
  fog(24, 9, 31, 20); fog(17, 16, 23, 20); fog(24, 2, 31, 8);
  for (const [x, y] of [[27.6, 14.5], [19.9, 18.3], [28, 5]]) c.drawImage(PADLOCK, Math.round(x * 16), Math.round(y * 16));
  // ambient fireflies
  reseed(5); for (let i = 0; i < 26; i++) { const x = 40 + rnd() * (M.width - 80), y = 50 + rnd() * (M.height - 90); c.globalCompositeOperation = 'lighter'; c.drawImage(halo(6, [255, 230, 140], 3), x - 6, y - 6); c.globalCompositeOperation = 'source-over'; c.fillStyle = '#fff3a0'; c.fillRect(Math.round(x), Math.round(y), 1, 1); }
  // you, standing in the plaza
  c.drawImage(BUGS.firefly[0], 16 * 16, 12 * 16 + 2); for (let i = 0; i < 3; i++) c.drawImage(FIREFLY[0], 16 * 16 - 10 - i * 8, 12 * 16 + 8 + (i % 2) * 3);
  return M;
}
(() => {
  const wrap = $('map'), M = hubMap(), cv = view(M, 2); window.__hubMap = M; cv.classList.add('map'); wrap.appendChild(cv);
  const pins = [[1, 16.6, 8.4, 'The Lantern Gate', 'Walk into the light to fly out on a run. Your amber is counted when you come back.', 'open'], [2, 5.6, 8, "Old Glim's Wares", 'The permanent upgrades merchant. Talk to him to open the shop.', 'open'], [3, 21.5, 7.4, 'The Daily Moonstone', "Today's challenge, the same run for everyone.", 'open'], [4, 16.2, 3.8, 'The Wall of Glows', 'Your stats, run history and achievements.', 'open'], [5, 7, 15.6, 'The Roost', 'Your bugs rest on these mushrooms. Walk up to one to fly as it. Locked bugs are shadows.', 'open'], [6, 28, 12, 'The Moonlit Pond', 'Locked. New game modes will open here.', 'locked'], [7, 20.5, 16.6, 'The Mushroom Market', 'Locked. Shellby will sell weapons and looks here.', 'locked'], [8, 28.5, 3, 'The Old Observatory', 'Locked. Future challenges and trials.', 'locked']];
  const legend = $('legend');
  for (const [n, x, y, name, note, st] of pins) {
    const p = el('span', 'pin ' + st, n); p.style.left = (x / 34 * 100) + '%'; p.style.top = (y / 22 * 100) + '%'; p.title = name; wrap.appendChild(p);
    const li = el('li', st); li.innerHTML = '<span class="pin ' + st + '">' + n + '</span><div><b>' + name + '</b><span>' + note + '</span></div>'; legend.appendChild(li);
  }
})();

// ---- 2. characters ----
(() => {
  const g = grid('chars');
  for (const k in BUGS) card(g, BUGS[k], 5, BUG_NAMES[k], 'Two-frame flight. Flips to face where you fly.');
  card(g, [GLIM[0], GLIM[1], GLIM[0], GLIM[2]], 5, 'Old Glim', 'Moth peddler. Idle, lantern flicker, talking.', { ms: 380 });
  card(g, [GLIM_PORTRAIT], 6, 'Glim, portrait', 'Used in his dialogue box.');
  card(g, SHELLBY, 4, 'Shellby', 'Snail who runs a shop from her shell. Mushroom Market, locked for now.', { ms: 600 });
  card(g, FIREFLY, 8, 'Trail firefly', 'Follows you in a line.', { ms: 260 });
  card(g, STRAY, 7, 'Lost firefly', 'Waiting to be rescued, blinking.', { ms: 400 });
})();
// ---- 3. hub props and tiles ----
(() => {
  const g = grid('props');
  card(g, LANTERN_GATE, 4, 'The Lantern Gate', 'Starts a run. Its light flickers.', { ms: 300 });
  card(g, CART, 3, "Glim's cart", 'Striped canopy, hanging jars, his wares.', { ms: 500 });
  card(g, SHRINE, 4, 'Daily Moonstone', 'The moon glows brighter when today is unplayed.', { ms: 700 });
  card(g, [TABLET], 3, 'Wall of Glows', 'Stats and achievements, carved in stone.');
  card(g, PERCH, 4, 'Roost perches', 'One per bug, in its colour.', { ms: 700 });
  card(g, [REED_GATE], 3, 'Pond gate', 'Locked: reeds, a chained gate and a padlock.');
  card(g, [LOG], 3, 'Fallen log', 'Blocks the Mushroom Market for now.');
  card(g, [RUBBLE], 4, 'Rubble', 'Blocks the Observatory path.');
  card(g, [PILLAR], 4, 'Broken pillar', '');
  card(g, [TELESCOPE], 3, 'Old telescope', 'Waiting in the Observatory.');
  card(g, [SOON_BOARD], 4, 'Coming-soon board', 'Stands at every locked area.');
  card(g, [SIGNPOST], 4, 'Signpost', '');
  card(g, LAMP_POST, 4, 'Lamp post', '', { ms: 300 });
  card(g, JAR, 5, 'Firefly jar', '', { ms: 400 });
  card(g, [CRATE], 5, 'Crate', ''); card(g, [BENCH], 4, 'Bench', '');
  card(g, GLOW_SHROOMS, 5, 'Glow mushrooms', 'Three colours.', { ms: 700 });
  card(g, [BUSH], 4, 'Bush', ''); card(g, [LILY], 5, 'Lily pad', ''); card(g, [REEDS], 5, 'Reeds', ''); card(g, FLOWERS, 7, 'Flowers', '', { ms: 600 }); card(g, [PADLOCK], 5, 'Padlock', '');
  const t = grid('tiles');
  const patch = arr => [0, 1].map(f => px(48, 48, pc => { reseed(13 + f); for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pc.drawImage(arr.length > 1 && arr === HUB_TILES.water || arr === HUB_TILES.shore ? arr[f] : arr[(rnd() * arr.length) | 0], x * 16, y * 16); }));
  const tileCard = (name, arr, note) => card(t, patch(arr), 3, name, note, { ms: 700 });
  tileCard('Grass', HUB_TILES.grass, 'Four variants, one with flowers.'); tileCard('Dirt', HUB_TILES.dirt, ''); tileCard('Stepping slabs', HUB_TILES.slab, ''); tileCard('Moss', HUB_TILES.moss, '');
  tileCard('Water', HUB_TILES.water, 'Two-frame ripple.'); tileCard('Shore', HUB_TILES.shore, 'Grass lip, shadow, water.'); tileCard('Root wall, top', HUB_TILES.rootTop, ''); tileCard('Root wall, face', HUB_TILES.rootFace, ''); tileCard('Deck planks', HUB_TILES.plank, '');
})();
// ---- 4. upgrades shop data and icons ----
(() => {
  const g = grid('upgrades');
  for (const [k, name, eff, max, costs] of UPGRADES) card(g, [UPGRADE_ICONS[k]], 5, name, eff + ' · ' + max + (max > 1 ? ' levels' : ' level') + ' · ' + costs.join(' / ') + ' amber');
  const c = grid('currency');
  card(c, [AMBER], 6, 'Amber', 'Earned every run. Spent at Old Glim.'); card(c, [AMBER_SMALL], 8, 'Amber, small', 'For prices and the counter.'); card(c, [AMBER_PILE], 5, 'Amber pile', 'Run summary reward.');
  const w = grid('weapons');
  for (const k in WEAPON_ICONS) { card(w, [WEAPON_ICONS[k]], 5, WEAPON_NAMES[k][0], ''); card(w, [EVOLVED_ICONS[k]], 4, WEAPON_NAMES[k][1], 'Evolved'); }
  const p = grid('passives'); for (const k in PASSIVE_ICONS) card(p, [PASSIVE_ICONS[k]], 5, PASSIVE_NAMES[k], '');
  const pk = grid('pickups'); for (const k in PICKUPS) card(pk, [PICKUPS[k]], 5, PICKUP_NAMES[k], ''); SPARKS.forEach((s, i) => card(pk, [s], 8, ['Spark', 'Bright spark', 'Gold spark'][i], ['1 XP', '4 XP', '15 XP'][i]));
  const ic = grid('hudicons'); const names = { health: 'Health', squash: 'Squashed', firefly: 'Fireflies', clock: 'Time', pause: 'Pause', play: 'Resume', soundOn: 'Sound on', soundOff: 'Sound off', music: 'Music', gear: 'Settings', lock: 'Locked', unlock: 'Unlocked', check: 'Done', cross: 'Close or no', star: 'Achievement', crown: 'Best', moon: 'Daily', nightmare: 'Nightmare', back: 'Back', close: 'Close', amber: 'Amber' };
  for (const k in ICO) card(ic, [ICO[k]], 5, names[k], '');
})();
// ---- 5. projectiles and effects ----
(() => {
  const g = grid('shots'); for (const k in PLAYER_SHOTS) card(g, PLAYER_SHOTS[k], 6, k, 'Yours', { ms: 160 });
  const e = grid('eshots'); for (const k in ENEMY_SHOTS) card(e, [ENEMY_SHOTS[k]], 7, k, 'Enemy'); card(e, SHOCKWAVE, 4, 'Gloom shockwave', 'Enemy', { ms: 300 }); card(e, [WEB], 4, 'Weaver web', 'Enemy');
  const f = grid('effects'); card(f, HIT, 7, 'Hit spark', '', { ms: 120 }); card(f, POOF, 5, 'Death puff', '', { ms: 140 }); card(f, LEVEL_BURST, 4, 'Level-up burst', '', { ms: 220 }); card(f, [HEAL], 7, 'Heal', '');
})();
// ---- 6. the run's level ----
function enemyFrames(name) { const d = SPRITES[name]; return d.frames.map(fr => bake(d.pal, fr, d.ol)); }
(() => {
  const W = 30, H = 17, M = px(W * 16, H * 16, () => {}), c = M.getContext('2d'); reseed(303);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const r = rnd(); const set = r < .07 ? RUN_TILES.slab : r < .1 ? RUN_TILES.spores : r < .12 ? RUN_TILES.rebar : RUN_TILES.grass; c.drawImage(set[(rnd() * set.length) | 0], x * 16, y * 16); }
  for (const [x, y] of [[6, 4], [7, 4], [6, 5], [22, 11], [23, 11]]) c.drawImage(RUN_TILES.slab[0], x * 16, y * 16); for (const [x, y] of [[12, 12], [25, 3]]) c.drawImage(RUN_TILES.puddle[0], x * 16, y * 16);
  for (const [img, x, y] of [[STUMP, 4, 9], [STANDING, 20, 2], [STANDING, 22, 2.6], [DEAD_LAMP, 26, 9], [STUMP, 15, 1.5], [STANDING, 2, 13]]) { c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x * 16 + img.width / 2, y * 16 + img.height - 1, img.width * .42, 3, 0, 0, TAU); c.fill(); c.drawImage(img, x * 16, y * 16); }
  const put2 = (img, x, y, flip) => c.drawImage(flip ? flipX(img) : img, Math.round(x - img.width / 2), Math.round(y - img.height / 2));
  const P0 = [15 * 16, 9 * 16];
  c.globalCompositeOperation = 'lighter'; c.drawImage(halo(80, [255, 210, 120], 5), P0[0] - 80, P0[1] - 80); c.globalCompositeOperation = 'source-over';
  for (const [n, x, y] of [['tick', 9, 5], ['tick', 10.5, 6.5], ['gnat', 20, 6], ['toad', 23, 13.5], ['beetle', 7, 12], ['brood', 21, 9], ['puff', 11, 12.5], ['moth', 18, 3.5], ['jar', 12, 3], ['tick', 24, 7], ['grub', 19.2, 10.5]]) put2(enemyFrames(n)[0], x * 16, y * 16, x * 16 > P0[0]);
  put2(BUGS.firefly[0], P0[0], P0[1]); for (let i = 0; i < 5; i++) put2(FIREFLY[0], P0[0] - 14 - i * 9, P0[1] + 4 + Math.sin(i) * 4);
  put2(PLAYER_SHOTS['Spark Shot'][0], P0[0] + 40, P0[1] - 14); put2(PLAYER_SHOTS['Spark Shot'][1], P0[0] + 72, P0[1] - 30); put2(PLAYER_SHOTS['Thorn'][1], P0[0] - 50, P0[1] + 36);
  put2(PLAYER_SHOTS['Moon scythe'][0], P0[0] + 2, P0[1] - 30); put2(PLAYER_SHOTS['Spore cloud'][0], P0[0] - 60, P0[1] + 10);
  for (const [k, x, y] of [['Beetle spit', 8.6, 11.2], ['Beetle spit', 10.2, 10.6], ['Eclipse ember', 19.6, 8.4], ['Generic shot', 17.8, 11.6], ['Hive sting', 13.2, 5]]) put2(ENEMY_SHOTS[k], x * 16, y * 16);
  put2(SPARKS[0], 13 * 16, 8 * 16); put2(SPARKS[1], 17 * 16, 12 * 16); put2(SPARKS[2], 14 * 16, 13 * 16); put2(PICKUPS.heart, 6 * 16, 7 * 16); put2(HIT[2], 20 * 16 - 8, 6 * 16 - 2); put2(POOF[1], 11 * 16, 9.4 * 16);
  const v = view(M, 2); v.classList.add('map'); $('level').appendChild(v);
  const t = grid('runtiles'); const tc = (n, a, note) => card(t, [0, 1].map(f => px(48, 48, pc => { reseed(17 + f); for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pc.drawImage(a === RUN_TILES.puddle ? a[f] : a[(rnd() * a.length) | 0], x * 16, y * 16); })), 3, n, note, { ms: 700 });
  tc('Meadow grass', RUN_TILES.grass, 'Colder and darker than the hub.'); tc('Buried slabs', RUN_TILES.slab, 'Whole and cracked.'); tc('Puddle', RUN_TILES.puddle, ''); tc('Rebar', RUN_TILES.rebar, ''); tc('Spore caps', RUN_TILES.spores, '');
  card(t, [STUMP], 4, 'Pillar stump', ''); card(t, [STANDING], 4, 'Standing stone', ''); card(t, [DEAD_LAMP], 4, 'Dead lamp post', 'The run is past the Hollow’s light.');
})();
// ---- 7. UI kit, live ----
(() => {
  const amberImg = '<img class="pxi" alt="" width="18" height="21" src="' + uri(AMBER_SMALL) + '">';
  const icon = (cv, s = 2) => '<img class="pxi" alt="" width="' + cv.width * s + '" height="' + cv.height * s + '" src="' + uri(cv) + '">';
  $('k-buttons').innerHTML = `
    <div class="row"><button class="k-btn">Fly out</button><button class="k-btn is-hover" tabindex="-1">Hover</button><button class="k-btn is-down" tabindex="-1">Pressed</button><button class="k-btn" disabled>Disabled</button></div>
    <div class="row"><button class="k-btn stone">Back</button><button class="k-btn stone is-hover" tabindex="-1">Hover</button><button class="k-btn stone is-down" tabindex="-1">Pressed</button><button class="k-btn mint">Daily #17</button><button class="k-btn danger">Reset progress</button></div>
    <div class="row"><button class="k-btn stone icon" aria-label="Pause">${icon(ICO.pause)}</button><button class="k-btn stone icon" aria-label="Sound">${icon(ICO.soundOn)}</button><button class="k-btn stone icon" aria-label="Music">${icon(ICO.music)}</button><button class="k-btn stone icon" aria-label="Settings">${icon(ICO.gear)}</button><button class="k-btn stone icon" aria-label="Close">${icon(ICO.close)}</button></div>`;
  $('k-inputs').innerHTML = `
    <label class="field"><span>Music</span><div class="k-slider" data-v="70"><div class="tr"></div><div class="fi"></div><div class="kn"></div><input id="s1" type="range" min="0" max="100" value="70" aria-label="Music volume"></div><output>70</output></label>
    <label class="field"><span>Sound effects</span><div class="k-slider" data-v="45"><div class="tr"></div><div class="fi"></div><div class="kn"></div><input id="s2" type="range" min="0" max="100" value="45" aria-label="Sound effects volume"></div><output>45</output></label>
    <div class="row"><label class="opt"><input id="t1" class="k-toggle" type="checkbox" checked> Screen shake</label><label class="opt"><input id="t2" class="k-toggle" type="checkbox"> Reduce motion</label></div>
    <div class="row"><label class="opt"><input id="c1" class="k-check" type="checkbox" checked> Damage numbers</label><label class="opt"><input id="c2" class="k-check" type="checkbox"> Show FPS</label></div>
    <div class="row"><label class="opt"><input class="k-radio" type="radio" name="sz" id="r1"> Small text</label><label class="opt"><input class="k-radio" type="radio" name="sz" id="r2" checked> Normal</label><label class="opt"><input class="k-radio" type="radio" name="sz" id="r3"> Large</label></div>
    <label class="field"><span>Dash key</span><span class="k-selwrap"><select id="d1" class="k-select"><option>Space</option><option>Shift</option><option>Right click</option></select></span></label>`;
  $('k-misc').innerHTML = `
    <div class="row"><div class="k-tabs" role="tablist"><button class="k-tab" role="tab" aria-selected="true">Upgrades</button><button class="k-tab" role="tab" aria-selected="false">Looks</button><button class="k-tab" role="tab" aria-selected="false" disabled>${icon(ICO.lock)} Soon</button></div></div>
    <div class="k-panel" style="margin-top:0">Tab panel. The active tab joins the slab.</div>
    <div class="bars"><div><small>XP</small><div class="k-bar"><i style="width:62%;background:repeating-linear-gradient(90deg,#4f8fe0 0 9px,#3d79c9 9px 12px)"></i></div></div>
    <div><small>Health</small><div class="k-bar"><i style="width:74%;background:repeating-linear-gradient(90deg,#d9574a 0 9px,#b8443a 9px 12px)"></i></div></div>
    <div><small>Boss</small><div class="k-bar boss"><i style="width:48%;background:repeating-linear-gradient(90deg,#c23b3b 0 9px,#9a2a2a 9px 12px)"></i></div></div></div>
    <div class="row"><span class="k-pips" aria-label="Level 3 of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="price">${amberImg} 140</span><span class="price poor">${amberImg} 400</span></div>
    <div class="row" style="align-items:flex-end;min-height:84px"><span class="k-tip">+10 max health per level</span></div>
    <div class="row"><span class="k-toast">${icon(ICO.star)} Achievement: Dawnbringer</span></div>
    <div class="row"><span class="prompt"><span class="k-key">E</span> Talk to Old Glim</span><span class="prompt"><span class="k-key">Space</span> Dash</span><span class="prompt"><span class="k-key">Esc</span> Pause</span></div>
    <div class="k-panel k-scroll" tabindex="0" aria-label="Scrolling list">${Array.from({ length: 12 }, (_, i) => '<p style="margin:6px 0">Run ' + (12 - i) + ' · ' + ['Firefly', 'Moth', 'Wasp'][i % 3] + ' · ' + (3 + i) + ':' + String((i * 17) % 60).padStart(2, '0') + '</p>').join('')}</div>
    <div class="row"><span class="k-cursor curs">Hover here for the pixel cursor ${icon(IMG.cursor, 3)}</span></div>`;
  document.querySelectorAll('.k-slider').forEach(s => { const inp = s.querySelector('input'), out = s.parentElement.querySelector('output'); const set = () => { const v = +inp.value; s.querySelector('.fi').style.width = 'calc(' + v + '% - ' + (v / 100 * 6) + 'px)'; s.querySelector('.kn').style.left = 'calc(' + (v) + '% + ' + (3.5 - v / 100 * 7) * 3 + 'px)'; if (out) out.textContent = v; }; inp.addEventListener('input', set); set(); });
  document.querySelectorAll('.k-tab').forEach(t => t.addEventListener('click', () => { if (t.disabled) return; t.parentElement.querySelectorAll('.k-tab').forEach(o => o.setAttribute('aria-selected', o === t)); }));

  // ---- 8. screens ----
  const shop = $('shop');
  shop.innerHTML = `<div class="k-panel gold screen-shop">
    <div class="shop-head"><img class="pxi" alt="" width="${13 * 5}" height="${GLIM_PORTRAIT.height * 5}" src="${uri(GLIM_PORTRAIT)}"><div><h3>Old Glim's Wares</h3><p class="say">"Light doesn't keep, little one. Amber does. What'll it be?"</p></div><span class="balance">${amberImg} 312</span></div>
    <div class="k-tabs" role="tablist"><button class="k-tab" role="tab" aria-selected="true">Upgrades</button><button class="k-tab" role="tab" aria-selected="false" disabled>${icon(ICO.lock)} Looks</button></div>
    <div class="k-panel shop-list">${UPGRADES.map(([k, name, eff, max, costs], i) => { const have = [2, 1, 0, 3, 0, 1, 0, 2, 3, 0, 0, 1][i], maxed = have >= max, cost = maxed ? 0 : costs[have], poor = cost > 312; return `<div class="shop-row"><img class="pxi" alt="" width="48" height="48" src="${uri(UPGRADE_ICONS[k])}"><div class="sr-t"><b>${name}</b><span>${eff}</span><span class="k-pips">${Array.from({ length: max }, (_, j) => '<i' + (j < have ? ' class="on"' : '') + '></i>').join('')}</span></div>${maxed ? '<span class="maxed">' + icon(ICO.check) + ' Maxed</span>' : '<button class="k-btn' + (poor ? '" disabled' : '"') + '>' + amberImg + ' ' + cost + '</button>'}</div>`; }).join('')}</div></div>`;
  $('settings').innerHTML = `<div class="k-panel screen-set"><h3>${icon(ICO.gear)} Settings</h3>
    <div class="set-grid"><div><h4>Sound</h4>${$('k-inputs').querySelectorAll('.field')[0].outerHTML.replace('id="s1"', 'id="s3"')}${$('k-inputs').querySelectorAll('.field')[1].outerHTML.replace('id="s2"', 'id="s4"')}</div>
    <div><h4>Screen</h4><label class="opt"><input id="t3" class="k-toggle" type="checkbox" checked> Screen shake</label><label class="opt"><input id="t4" class="k-toggle" type="checkbox"> Reduce motion</label><label class="opt"><input id="c3" class="k-check" type="checkbox" checked> Damage numbers</label></div>
    <div><h4>Controls</h4><label class="field"><span>Dash key</span><span class="k-selwrap"><select id="d2" class="k-select"><option>Space</option><option>Shift</option></select></span></label><p class="note">Move with WASD or the arrow keys, or drag on a phone.</p></div>
    <div><h4>Save</h4><p class="note">Progress, amber and upgrades are saved in this browser.</p><button class="k-btn danger">Reset progress</button></div></div>
    <div class="row end"><button class="k-btn stone">${icon(ICO.back)} Back</button><button class="k-btn">Done</button></div></div>`;
  document.querySelectorAll('#settings .k-slider').forEach(s => { const inp = s.querySelector('input'), out = s.parentElement.querySelector('output'); const set = () => { const v = +inp.value; s.querySelector('.fi').style.width = 'calc(' + v + '% - ' + (v / 100 * 6) + 'px)'; s.querySelector('.kn').style.left = 'calc(' + v + '% + ' + (3.5 - v / 100 * 7) * 3 + 'px)'; if (out) out.textContent = v; }; inp.addEventListener('input', set); set(); });
  $('locked').innerHTML = `<div class="k-panel screen-lock"><img class="pxi" alt="" width="60" height="75" src="${uri(PADLOCK)}"><div><h3>The Moonlit Pond</h3><p>New ways to play will open here. The gate stays chained for now.</p><button class="k-btn stone">${icon(ICO.back)} Back to the Hollow</button></div></div>`;
  $('dialog').innerHTML = `<div class="k-panel screen-dialog"><div class="portrait"><img class="pxi" alt="" width="${13 * 6}" height="${GLIM_PORTRAIT.height * 6}" src="${uri(GLIM_PORTRAIT)}"></div><div><span class="nameplate">Old Glim</span><p>"Back again? Every run you fly, you bring a little amber home. Bring me enough and I'll make you tougher for the next one."</p><div class="row"><button class="k-btn">Show me your wares</button><button class="k-btn stone">Maybe later</button></div></div></div>`;
  const crop = px(240, 75, cc => cc.drawImage(window.__hubMap, 150, 120, 240, 75, 0, 0, 240, 75));
  $('hubhud').innerHTML = `<div class="hudmock" style="background:url(${uri(crop)}) center/cover;image-rendering:pixelated"><span class="amt">${amberImg} 312</span><span class="right"><button class="k-btn stone icon" aria-label="Settings">${icon(ICO.gear)}</button></span><span class="hint"><span class="k-key">E</span> Fly out</span></div>`;
  $('summary').innerHTML = `<div class="k-panel gold screen-sum"><h3>Back in the Hollow</h3><div class="sum-amber"><img class="pxi" alt="" width="100" height="70" src="${uri(AMBER_PILE)}"><div><b>+ 84 amber</b><span>62 from your score · 12 for the Maw · 10 for 5 fireflies home</span></div></div><div class="row end"><button class="k-btn">Back to the Hollow</button></div></div>`;
})();
