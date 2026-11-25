// ---------- the walkable Haven ----------
// Stations sit on their own clearings around a central plaza, each with its own light. Everything to do with playing
// (the Lantern Gate and the Moonstone) shares the plaza, so there's one obvious place to go to fly out.
// Places that aren't built yet are paths fading into soft mist at the edges of the map.
const WARM = [255, 200, 110], AMBERL = [255, 170, 60], MINT = [127, 214, 194], ROSE = [255, 150, 170];
function makeHaven() {
  const TW = 52, TH = 34, W = TW * 16, H = TH * 16;
  reseed(4242);
  const T = Array.from({ length: TH }, () => Array(TW).fill('g'));
  const fill = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (T[y] && T[y][x] !== undefined) T[y][x] = t; };
  const disc = (cx, cy, r, t) => { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) if ((x + .5 - cx) ** 2 + ((y + .5 - cy) * 1.15) ** 2 < r * r) T[y][x] = t; };
  // paths are dirt with a stepping stone every other tile; the plaza is dirt ringed with stones
  const path = (x0, y0, x1, y1) => { fill(x0, y0, x1, y1, 'd'); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 && (x0 === x1 || y0 === y1 || (x - x0 + y - y0) % 3 === 0)) T[y][x] = 's'; };
  path(12, 18, 20, 19); path(31, 18, 39, 19); path(25, 24, 26, 33); path(9, 26, 26, 27); path(9, 20, 10, 26); path(32, 22, 35, 23); path(38, 13, 39, 18); path(38, 24, 39, 29);
  disc(26, 19, 6.2, 'd'); for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const d = Math.hypot(x + .5 - 26, (y + .5 - 19) * 1.15); if (d > 4.2 && d < 5.2) T[y][x] = 's'; }
  disc(9, 16.5, 5, 'd'); disc(10, 28.5, 6.4, 'd'); disc(40, 15.5, 3.6, 'd'); disc(41, 28, 5, 'd'); disc(35, 24, 3.4, 'd');
  fill(36, 3, 49, 9, 'w'); fill(36, 10, 49, 10, 'S');
  fill(0, 0, TW - 1, 1, 'R'); fill(0, 2, TW - 1, 2, 'F'); fill(0, 0, 1, TH - 1, 'R'); fill(TW - 2, 0, TW - 1, TH - 1, 'R'); fill(0, TH - 2, 23, TH - 1, 'R'); fill(28, TH - 2, TW - 1, TH - 1, 'R');
  const tiles = { g: HUB_TILES.grass, d: HUB_TILES.dirt, s: HUB_TILES.slab, w: HUB_TILES.water, S: HUB_TILES.shore, R: HUB_TILES.rootTop, F: HUB_TILES.rootFace };
  const ground = px(W, H, c => { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const set = tiles[T[y][x]], v = T[y][x] === 'w' || T[y][x] === 'S' ? set[0] : set[(rnd() * set.length) | 0]; c.drawImage(v, x * 16, y * 16); } });
  const gc = ground.getContext('2d');
  for (let i = 0; i < 70; i++) { const x = 40 + rnd() * (W - 80), y = 56 + rnd() * (H - 100), t = T[(y / 16) | 0][(x / 16) | 0]; if (t === 'g') gc.drawImage(rnd() < .75 ? FLOWERS[(rnd() * 3) | 0] : GLOW_SHROOMS[(rnd() * 3) | 0], x | 0, y | 0); }
  for (const [x, y] of [[38, 5], [41, 7], [45, 4], [47, 8], [43, 9]]) gc.drawImage(LILY, x * 16, y * 16);
  // things that stand up: a picture, a position (its feet), an optional solid footprint, station and light
  const props = [];
  const add = (frames, fx, fy, o = {}) => { frames = Array.isArray(frames) ? frames : [frames]; const w = frames[0].width, h = frames[0].height; const p = { frames, x: Math.round(fx * 16 - w / 2), y: Math.round(fy * 16 - h), w, h, foot: fy * 16, ms: o.ms || 400, ...o }; if (o.solid !== false) p.box = o.box || [p.x + w * .2, p.foot - 7, w * .6, 7]; props.push(p); return p; };
  // the plaza: everything to do with playing
  add(BIG_GATE, 26, 15.4, { ms: 140, station: 'gate', label: 'Fly out', light: [26 * 16, 12.2 * 16, 80, WARM], beacon: true });
  add(MOONSTONE, 31.6, 16.4, { ms: 900, station: 'daily', label: 'Daily run', light: [31.6 * 16, 13.6 * 16, 46, MINT] });
  add(SIGNPOST, 22.4, 22.6, { station: 'gate', label: 'Fly out' });
  // the Root Tree and its keeper
  add(ELDER, 9, 16, { ms: 900, station: 'tree', label: 'The Root Tree', box: [9 * 16 - 40, 16 * 16 - 10, 80, 10], light: [9 * 16, 13 * 16, 72, AMBERL] });
  add(GLIM, 14, 17, { ms: 500, station: 'npc', npc: 'glim', label: 'Talk to Glim', anim: [0, 1, 0, 0] });
  // the Roost: one mushroom per bug, each with its bug perched on top
  for (const [i, x, bug] of [[0, 6.4, 'firefly'], [1, 10.4, 'moth'], [2, 14.4, 'beetle']]) add(BIG_SHROOMS[i], x, 29.4, { station: 'roost', label: 'Choose your bug', perch: bug, light: [x * 16, 28.2 * 16, 30, ROSE] });
  // the Records board and Wick
  add(RECORDS, 34, 23.8, { station: 'records', label: 'Records', light: [34 * 16, 21.8 * 16, 50, WARM] });
  add(WICK, 37, 24.6, { ms: 260, station: 'npc', npc: 'wick', label: 'Talk to Wick' });
  // the places that aren't built yet, with their neighbours waiting outside
  add(POND_GATE, 42.5, 13.6, { station: 'locked', label: 'The Pond', box: [38 * 16, 12.6 * 16, 12 * 16, 16] });
  add(PELL, 35.2, 11.2, { ms: 700, station: 'npc', npc: 'pell', label: 'Talk to Pell', light: [35.6 * 16, 9.6 * 16, 30, MINT] });
  add(MARKET, 42, 31.6, { station: 'locked', label: 'The Market' });
  add(SHELLBY, 36.4, 30.4, { ms: 600, station: 'npc', npc: 'shellby', label: 'Talk to Shellby', light: [36.4 * 16, 28.6 * 16, 34, WARM] });
  add(SOON_BOARD, 25.5, 31.8, { station: 'locked', label: 'The Old Road', box: [24 * 16, 32 * 16, 4 * 16, 32] });
  for (const [x, y] of [[21, 21.8], [31, 21.8], [21, 15.6], [31, 15.6], [16, 25.6], [30, 26.6], [12.5, 21.2]]) add(BIG_LAMP, x, y, { ms: 300, light: [x * 16, y * 16 - 34, 38, WARM], box: [x * 16 - 3, y * 16 - 4, 6, 4] });
  for (const [i, x, y] of [[0, 4.6, 8.4], [1, 17, 7.6], [2, 31.5, 8], [0, 48.8, 15.6], [1, 48.6, 24], [2, 3.8, 22.6], [0, 20.6, 32.4], [1, 31.8, 32.6], [2, 48.6, 32]]) add(TREES[i], x, y, { box: [x * 16 - 9, y * 16 - 8, 18, 8] });
  for (const [x, y] of [[19.2, 9.4], [34, 9.6], [3.6, 12.4], [21.8, 30.4], [46.6, 20.4], [15, 22.5], [44, 22]]) add(FERN, x, y, { solid: false });
  for (const [x, y] of [[18, 29], [35.5, 17.2], [6, 20.6]]) add(SHROOM_PATCH, x, y, { solid: false });
  add(BENCH, 29.5, 24.4);
  const solidTile = (tx, ty) => { const t = T[ty] && T[ty][tx]; return t === undefined || t === 'R' || t === 'F' || t === 'w'; };
  const blocked = (x, y) => { if (y > (TH - 2.4) * 16 || solidTile(Math.floor(x / 16), Math.floor(y / 16))) return true; for (const p of props) if (p.box) { const [bx, by, bw, bh] = p.box; if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) return true; } return false; };
  // mist over the unbuilt places: [x, y, w, h] in tiles
  const mist = [[39, 2, 13, 11], [38, 26, 14, 8], [22, 31, 8, 3]].map(([x, y, w, h]) => [x * 16, y * 16, w * 16, h * 16]);
  return { W, H, ground, props, blocked, mist, spawn: [26 * 16, 19.6 * 16] };
}

// soft mist: a feathered patch whose edge fades out over a couple of tiles, in a few pixel steps
function mistPatch(w, h) {
  return px(w, h, c => {
    reseed(w * 7 + h);
    const blobs = Array.from({ length: Math.round(w * h / 1400) + 4 }, () => [rnd() * w, rnd() * h, 18 + rnd() * 30]);
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
      let k = Math.min(1, Math.min(x, y, w - x, h - y) / 34), n = 0;
      for (const [bx, by, r] of blobs) { const d = Math.hypot(x - bx, y - by) / r; if (d < 1) n = Math.max(n, 1 - d); }
      k *= .55 + .45 * n; k = Math.round(k * 5) / 5; if (k > 0) { c.fillStyle = 'rgba(16,22,30,' + (k * .82).toFixed(2) + ')'; c.fillRect(x, y, 2, 2); }
    }
  });
}

const FLIPPED = {}; for (const k in BUGS) FLIPPED[k] = BUGS[k].map(flipX);
const SILHOUETTE = {}; for (const k in BUGS) SILHOUETTE[k] = BUGS[k].map(f => px(f.width, f.height, c => { c.drawImage(f, 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = '#0e1414'; c.fillRect(0, 0, 99, 99); }));
// opt.keys: where to listen for keys (default: the root). opt.lit(p): is a station open yet. opt.bugOpen(bug): is that bug unlocked.
function mountHaven(root, ui, opt = {}) {
  const world = makeHaven(), lit = opt.lit || (() => true), bugOpen = opt.bugOpen || (() => true);
  const cv = document.createElement('canvas'); cv.className = 'px hollow-cv'; root.appendChild(cv);
  const ctx = cv.getContext('2d');
  let S = 3, VW = 0, VH = 0, buf = null, bc = null;
  const resize = () => { const r = root.getBoundingClientRect(); S = r.width < 600 ? 2 : 3; VW = Math.ceil(r.width / S); VH = Math.ceil(r.height / S); cv.width = VW * S; cv.height = VH * S; cv.style.width = VW * S + 'px'; cv.style.height = VH * S + 'px'; buf = px(Math.max(1, VW), Math.max(1, VH), () => {}); bc = buf.getContext('2d'); };
  new ResizeObserver(resize).observe(root); resize();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const me = { x: world.spawn[0], y: world.spawn[1], face: 1, moving: false, trail: [], bug: 'firefly', dash: 0, dvx: 0, dvy: 0, cd: 0, ghosts: [] };
  const keys = {}; let joy = null, near = null, paused = false, t0 = performance.now(), iris = 1, focus = null, cam = null;
  root.tabIndex = 0; const kt = opt.keys || root; let on = true, raf = 0;
  const dash = () => {
    if (paused || me.cd > 0) return;
    let dx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0), dy = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
    if (joy) { dx = joy.x - joy.x0; dy = joy.y - joy.y0; }
    const d = Math.hypot(dx, dy); if (d < .1) { dx = me.face; dy = 0; } else { dx /= d; dy /= d; }
    me.dvx = dx; me.dvy = dy; me.dash = .16; me.cd = .45; if (ui.dash) ui.dash();
  };
  kt.addEventListener('keydown', e => {
    if (!on || (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'))) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault(); keys[e.code] = true;
    if ((e.code === 'KeyE' || e.code === 'Enter') && near && !paused && !e.repeat) ui.open(near);
    else if ((e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.repeat) dash();
  });
  kt.addEventListener('keyup', e => { keys[e.code] = false; });
  root.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointerdown', e => { root.focus(); if (e.button === 2 || (joy && e.pointerType === 'touch')) { dash(); return; } joy = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (joy && e.pointerId === joy.id) { joy.x = e.clientX; joy.y = e.clientY; } });
  const endJoy = e => { if (joy && e.pointerId === joy.id) joy = null; }; cv.addEventListener('pointerup', endJoy); cv.addEventListener('pointercancel', endJoy);
  const motes = Array.from({ length: 50 }, () => ({ x: rnd() * world.W, y: rnd() * world.H, p: rnd() * TAU, s: .3 + rnd() * .6 }));
  const mists = world.mist.map(([x, y, w, h]) => ({ x, y, w, h, img: mistPatch(w, h), wisps: Array.from({ length: 5 }, () => ({ x: x + rnd() * w, y: y + rnd() * h, p: rnd() * TAU, r: 20 + (rnd() * 14 | 0) })) }));
  const darkness = px(1, 1, () => {});
  let last = performance.now();
  function frame(now) {
    if (!on) { raf = 0; return; }
    if (!VW || !VH) { raf = requestAnimationFrame(frame); return; } // not laid out yet
    const dt = Math.min(.05, (now - last) / 1000); last = now; const T = (now - t0) / 1000;
    // move (dashing is quick and does no harm here)
    let ix = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0), iy = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
    if (joy) { const dx = joy.x - joy.x0, dy = joy.y - joy.y0, d = Math.hypot(dx, dy); if (d > 8) { ix = dx / d; iy = dy / d; } }
    const m = Math.hypot(ix, iy); me.moving = (m > 0 || me.dash > 0) && !paused; me.cd -= dt;
    const step = (vx, vy) => { const nx = me.x + vx, ny = me.y + vy; if (!world.blocked(nx, me.y)) me.x = nx; if (!world.blocked(me.x, ny)) me.y = ny; };
    if (me.dash > 0 && !paused) { me.dash -= dt; for (let k = 0; k < 3; k++) step(me.dvx * 300 * dt / 3, me.dvy * 300 * dt / 3); if (me.dvx) me.face = me.dvx > 0 ? 1 : -1; me.ghosts.push({ x: me.x, y: me.y, f: me.face, t: .22 }); me.trail.unshift([me.x, me.y]); }
    else if (m > 0 && !paused) { ix /= m; iy /= m; step(ix * 78 * dt, iy * 78 * dt); if (ix) me.face = ix > 0 ? 1 : -1; me.trail.unshift([me.x, me.y]); }
    if (me.trail.length > 60) me.trail.length = 60;
    for (const g of me.ghosts) g.t -= dt; me.ghosts = me.ghosts.filter(g => g.t > 0);
    // what's close
    near = null; let bd = 34;
    for (const p of world.props) if (p.station) { const cx = p.x + p.w / 2, d = Math.hypot(me.x - cx, me.y - p.foot); if (d < bd + p.w * .35) { bd = d - p.w * .35; near = p; } }
    ui.prompt(near && !paused ? near : null);
    // camera: follows you, or glides to whatever Glim is pointing at
    const tx = Math.max(0, Math.min(world.W - VW, (focus ? focus[0] : me.x) - VW / 2)), ty = Math.max(0, Math.min(world.H - VH, (focus ? focus[1] : me.y - 10) - VH / 2));
    if (!cam || still) cam = [tx, ty]; else { const k = 1 - Math.exp(-dt * (focus ? 3 : 10)); cam[0] += (tx - cam[0]) * k; cam[1] += (ty - cam[1]) * k; }
    const cx = Math.round(cam[0]), cy = Math.round(cam[1]);
    bc.setTransform(1, 0, 0, 1, 0, 0); bc.fillStyle = '#06090a'; bc.fillRect(0, 0, VW, VH);
    bc.drawImage(world.ground, -cx, -cy);
    for (const g of me.ghosts) { const img = g.f < 0 ? FLIPPED[me.bug][0] : BUGS[me.bug][0]; bc.globalAlpha = g.t / .22 * .4; bc.drawImage(img, Math.round(g.x - img.width / 2 - cx), Math.round(g.y - img.height - 4 - cy)); } bc.globalAlpha = 1;
    // things, sorted by their feet so you can walk behind them
    const list = world.props.map(p => ({ p, foot: p.foot })); list.push({ me: true, foot: me.y });
    list.sort((a, b) => a.foot - b.foot);
    for (const it of list) {
      if (it.me) {
        bc.fillStyle = 'rgba(0,0,0,.35)'; bc.fillRect(Math.round(me.x - 6 - cx), Math.round(me.y - 1 - cy), 12, 2);
        const fi = me.moving ? Math.floor(T * 10) % 2 : Math.floor(T * 2) % 2, img = me.face < 0 ? FLIPPED[me.bug][fi] : BUGS[me.bug][fi], bob = me.moving ? 0 : Math.round(Math.sin(T * 3));
        bc.drawImage(img, Math.round(me.x - img.width / 2 - cx), Math.round(me.y - img.height - 4 + bob - cy));
        continue;
      }
      const p = it.p; if (p.x - cx > VW || p.x + p.w - cx < 0 || p.y - cy > VH + 20 || p.foot - cy < -10) continue;
      const open = lit(p);
      if (p.solid !== false) { bc.fillStyle = 'rgba(0,0,0,.3)'; bc.beginPath(); bc.ellipse(Math.round(p.x + p.w / 2 - cx), Math.round(p.foot - 2 - cy), Math.round(p.w * .4), 4, 0, 0, TAU); bc.fill(); }
      const seq = p.anim || p.frames.map((_, i) => i), f = p.frames[still ? 0 : seq[Math.floor(now / p.ms) % seq.length]] || p.frames[0];
      if (!open) bc.globalAlpha = .55;
      bc.drawImage(f, p.x - cx, p.y - cy); bc.globalAlpha = 1;
      if (p.perch) { const b = p.perch, ok = bugOpen(b), fr = ok && !still ? Math.floor(T * 3 + p.x) % 2 : 0, img = ok ? BUGS[b][fr] : SILHOUETTE[b][0]; bc.drawImage(img, Math.round(p.x + p.w / 2 - img.width / 2 - cx), Math.round(p.y - img.height + 5 - cy)); }
      const arrow = (p === near && open) || (p.beacon && open && !near), ax = Math.round(p.x + p.w / 2 - cx), ay = Math.round(p.y - (p.beacon ? 10 : 6) - cy + Math.sin(T * 5) * 1.5);
      if (arrow) { bc.fillStyle = p.beacon ? '#ffe066' : '#f2c14e'; bc.fillRect(ax - 3, ay, 7, 1); bc.fillRect(ax - 2, ay + 1, 5, 1); bc.fillRect(ax - 1, ay + 2, 3, 1); bc.fillRect(ax, ay + 3, 1, 1); }
    }
    // your fireflies, trailing behind
    for (let i = 0; i < 3; i++) { const q = me.trail[(i + 1) * 9] || [me.x - me.face * (8 + i * 7), me.y + 2]; bc.drawImage(FIREFLY[Math.floor(T * 8 + i) % 2], Math.round(q[0] - 2 - cx), Math.round(q[1] - 12 - cy + Math.sin(T * 4 + i) * 2)); }
    // the unbuilt places sit in slow, soft mist
    for (const mi of mists) {
      if (mi.x - cx > VW || mi.x + mi.w - cx < 0 || mi.y - cy > VH || mi.y + mi.h - cy < 0) continue;
      bc.drawImage(mi.img, mi.x - cx, mi.y - cy);
      bc.globalAlpha = .5; for (const w of mi.wisps) { const x = Math.round(w.x + Math.sin(T * .2 + w.p) * 26 - cx), y = Math.round(w.y + Math.cos(T * .15 + w.p) * 10 - cy); bc.drawImage(mistWisp(w.r), x - w.r, y - w.r); }
      bc.globalAlpha = 1;
    }
    // dusk, with warm holes around the open stations and you
    if (darkness.width !== VW || darkness.height !== VH) { darkness.width = VW; darkness.height = VH; }
    const lights = world.props.filter(p => p.light && lit(p)).map(p => p.light);
    const dc = darkness.getContext('2d'); dc.globalCompositeOperation = 'source-over'; dc.clearRect(0, 0, VW, VH); dc.fillStyle = 'rgba(4,8,14,.5)';
    // darker between features, so the lit stations stand out
    dc.fillRect(0, 0, VW, VH); dc.globalCompositeOperation = 'destination-out';
    for (const [lx, ly, r] of [...lights, [me.x, me.y - 8, 50]]) dc.drawImage(haloOf(r), Math.round(lx - r - cx), Math.round(ly - r - cy));
    bc.drawImage(darkness, 0, 0);
    bc.globalCompositeOperation = 'lighter';
    for (const [lx, ly, r, col] of lights) { const k = .9 + Math.sin(T * 5 + lx) * .08, rr = Math.round(r * .62); bc.globalAlpha = k; bc.drawImage(warmOf(rr, col), Math.round(lx - rr - cx), Math.round(ly - rr - cy)); }
    bc.globalAlpha = 1;
    for (const mo of motes) { const x = Math.round((mo.x + Math.sin(T * mo.s + mo.p) * 12) - cx), y = Math.round((mo.y + Math.cos(T * mo.s * .8 + mo.p) * 8) - cy); if (x < -4 || y < -4 || x > VW + 4 || y > VH + 4) continue; const b = .5 + .5 * Math.sin(T * 2 + mo.p); if (b > .25) { bc.globalAlpha = b; bc.drawImage(warmOf(3), x - 3, y - 3); bc.fillStyle = '#fff3a0'; bc.fillRect(x, y, 1, 1); } }
    bc.globalAlpha = 1; bc.globalCompositeOperation = 'source-over';
    // coming in: a circle of light opens out from your bug
    if (iris < 1) {
      iris = Math.min(1, iris + dt / (still ? .25 : .75)); const e = 1 - Math.pow(1 - iris, 3), R = e * Math.hypot(VW, VH);
      bc.fillStyle = '#030405'; bc.beginPath(); bc.rect(0, 0, VW, VH); bc.arc(Math.round(me.x - cx), Math.round(me.y - 10 - cy), R, 0, TAU, true); bc.fill('evenodd');
      if (iris < .35) { bc.globalAlpha = 1 - iris / .35; bc.fillRect(0, 0, VW, VH); bc.globalAlpha = 1; }
    }
    ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, 0, 0, VW * S, VH * S);
    raf = requestAnimationFrame(frame);
  }
  const hc = {}, wc = {}, mc = {}; const haloOf = r => hc[r] || (hc[r] = px(r * 2, r * 2, (c, dot) => { for (let y = 0; y < r * 2; y++) for (let x = 0; x < r * 2; x++) { const d = Math.hypot(x + .5 - r, y + .5 - r) / r; if (d < 1) dot(x, y, 'rgba(0,0,0,' + (Math.ceil((1 - d) * 5) / 5).toFixed(2) + ')'); } }));
  const mistWisp = r => mc[r] || (mc[r] = px(r * 2, r * 2, c => { for (let y = 0; y < r * 2; y += 2) for (let x = 0; x < r * 2; x += 2) { const d = Math.hypot(x + 1 - r, y + 1 - r) / r; if (d < 1) { c.fillStyle = 'rgba(70,86,100,' + (Math.ceil((1 - d) * 3) / 3 * .22).toFixed(3) + ')'; c.fillRect(x, y, 2, 2); } } }));
  const warmOf = (r, col = WARM) => wc[r + '' + col] || (wc[r + '' + col] = halo(r, col, 4));
  raf = requestAnimationFrame(frame);
  const stationAt = s => world.props.find(p => p.npc === s) || world.props.find(p => p.station === s);
  return {
    active: v => { on = v; if (!v) { for (const k in keys) keys[k] = false; joy = null; } else if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } },
    enter: at => { iris = 0; focus = null; cam = null; me.ghosts = []; me.trail = []; const p = at && stationAt(at); if (p) { me.x = p.x + p.w / 2 - 14; me.y = p.foot + 16; } else { me.x = world.spawn[0]; me.y = world.spawn[1]; } },
    focusOn: s => { if (!s) { focus = null; return; } const p = stationAt(s); focus = p ? [p.x + p.w / 2, p.y + p.h / 2] : null; },
    goto: (tx, ty) => { me.x = tx * 16; me.y = ty * 16; }, setBug: b => { me.bug = b; },
    pause: v => { paused = v; for (const k in keys) keys[k] = false; joy = null; }, get near() { return near; }, get me() { return me; }, get irisDone() { return iris >= 1; },
  };
}
// the names the design page still uses
const makeHollow = makeHaven, mountHollow = mountHaven;

// the whole Haven in one still picture, lit the same way as the walkable version
function hollowOverview() {
  const w = makeHaven(), M = px(w.W, w.H, () => {}), c = M.getContext('2d');
  c.drawImage(w.ground, 0, 0);
  for (const p of [...w.props].sort((a, b) => a.foot - b.foot)) { if (p.solid !== false) { c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(Math.round(p.x + p.w / 2), Math.round(p.foot - 2), Math.round(p.w * .4), 4, 0, 0, TAU); c.fill(); } c.drawImage(p.frames[0], p.x, p.y); if (p.perch) { const im = BUGS[p.perch][0]; c.drawImage(im, Math.round(p.x + p.w / 2 - im.width / 2), p.y - im.height + 5); } }
  c.drawImage(BUGS.firefly[0], w.spawn[0] - 8, w.spawn[1] - 16);
  for (const [x, y, ww, hh] of w.mist) c.drawImage(mistPatch(ww, hh), x, y);
  const lights = w.props.filter(p => p.light).map(p => p.light);
  const dark = px(w.W, w.H, dc => { dc.fillStyle = 'rgba(4,8,14,.5)'; dc.fillRect(0, 0, w.W, w.H); dc.globalCompositeOperation = 'destination-out'; for (const [lx, ly, r] of lights) dc.drawImage(px(r * 2, r * 2, (hc, dot) => { for (let y = 0; y < r * 2; y++) for (let x = 0; x < r * 2; x++) { const d = Math.hypot(x + .5 - r, y + .5 - r) / r; if (d < 1) dot(x, y, 'rgba(0,0,0,' + (Math.ceil((1 - d) * 5) / 5).toFixed(2) + ')'); } }), lx - r, ly - r); });
  c.drawImage(dark, 0, 0); c.globalCompositeOperation = 'lighter';
  for (const [lx, ly, r, col] of lights) { const rr = Math.round(r * .62); c.globalAlpha = .9; c.drawImage(halo(rr, col || WARM, 4), lx - rr, ly - rr); }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  return M;
}
// the Haven's residents, for the dialogue box portraits
const NPC_ART = { glim: GLIM, shellby: SHELLBY, wick: WICK, pell: PELL };
