// ---------- the walkable Hollow ----------
function makeHollow() {
  const TW = 52, TH = 34, W = TW * 16, H = TH * 16;
  reseed(4242);
  const T = Array.from({ length: TH }, () => Array(TW).fill('g'));
  const fill = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (T[y] && T[y][x] !== undefined) T[y][x] = t; };
  const disc = (cx, cy, r, t) => { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) if ((x + .5 - cx) ** 2 + ((y + .5 - cy) * 1.15) ** 2 < r * r) T[y][x] = t; };
  // paths are dirt with a stepping stone every other tile; the plaza is dirt ringed with stones
  const path = (x0, y0, x1, y1) => { fill(x0, y0, x1, y1, 'd'); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0 && (x0 === x1 || y0 === y1 || (x - x0 + y - y0) % 3 === 0)) T[y][x] = 's'; };
  path(12, 18, 20, 19); path(31, 18, 39, 19); path(25, 24, 26, 26); path(9, 26, 26, 27); path(9, 20, 10, 26); path(32, 22, 35, 23); path(38, 13, 39, 18); path(38, 24, 39, 29);
  disc(26, 19, 6.2, 'd'); for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const d = Math.hypot(x + .5 - 26, (y + .5 - 19) * 1.15); if (d > 4.2 && d < 5.2) T[y][x] = 's'; }
  disc(9, 16.5, 5, 'd'); disc(10, 28.5, 6.4, 'd'); disc(40, 15.5, 3.6, 'd'); disc(41, 28, 5, 'd');
  fill(36, 3, 49, 9, 'w'); fill(36, 10, 49, 10, 'S');
  fill(0, 0, TW - 1, 1, 'R'); fill(0, 2, TW - 1, 2, 'F'); fill(0, 0, 1, TH - 1, 'R'); fill(TW - 2, 0, TW - 1, TH - 1, 'R'); fill(0, TH - 2, TW - 1, TH - 1, 'R');
  const tiles = { g: HUB_TILES.grass, d: HUB_TILES.dirt, s: HUB_TILES.slab, w: HUB_TILES.water, S: HUB_TILES.shore, R: HUB_TILES.rootTop, F: HUB_TILES.rootFace };
  const ground = px(W, H, c => { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const set = tiles[T[y][x]], v = T[y][x] === 'w' || T[y][x] === 'S' ? set[0] : set[(rnd() * set.length) | 0]; c.drawImage(v, x * 16, y * 16); } });
  // flat ground details: flowers, glow mushrooms, lily pads
  const gc = ground.getContext('2d');
  for (let i = 0; i < 70; i++) { const x = 40 + rnd() * (W - 80), y = 56 + rnd() * (H - 100), t = T[(y / 16) | 0][(x / 16) | 0]; if (t === 'g') gc.drawImage(rnd() < .75 ? FLOWERS[(rnd() * 3) | 0] : GLOW_SHROOMS[(rnd() * 3) | 0], x | 0, y | 0); }
  for (const [x, y] of [[38, 5], [41, 7], [45, 4], [47, 8], [43, 9]]) gc.drawImage(LILY, x * 16, y * 16);
  // things that stand up: each has a picture, a position (its feet), an optional solid footprint and an optional station
  const props = [];
  const add = (frames, fx, fy, o = {}) => { frames = Array.isArray(frames) ? frames : [frames]; const w = frames[0].width, h = frames[0].height; const p = { frames, x: Math.round(fx * 16 - w / 2), y: Math.round(fy * 16 - h), w, h, foot: fy * 16, ms: o.ms || 400, ...o }; if (o.solid !== false) p.box = o.box || [p.x + w * .2, p.foot - 7, w * .6, 7]; props.push(p); return p; };
  add(BIG_GATE, 26, 15.4, { ms: 140, station: 'gate', label: 'Fly out', light: [26 * 16, 12.2 * 16, 70] });
  add(ELDER, 9, 16, { ms: 900, station: 'tree', label: 'The Root Tree', box: [9 * 16 - 40, 16 * 16 - 10, 80, 10], light: [9 * 16, 13 * 16, 60] });
  add(GLIM, 13.3, 16.4, { ms: 500, station: 'tree', label: 'The Root Tree', anim: [0, 1, 0, 0] });
  for (const [i, x] of [[0, 6.5], [1, 10.5], [2, 14.5]]) add(BIG_SHROOMS[i], x, 29.6, { station: 'roost', label: 'Choose your bug', light: i === 1 ? [10.5 * 16, 28 * 16, 56] : null });
  add(MOONSTONE, 40, 16.6, { ms: 900, station: 'daily', label: 'Daily challenge', light: [40 * 16, 14 * 16, 40] });
  add(RECORDS, 34, 23.8, { station: 'records', label: 'Records' });
  add(POND_GATE, 42.5, 13.6, { station: 'locked', label: 'Locked', box: [36 * 16, 12.6 * 16, 14 * 16, 16] });
  add(MARKET, 41, 31.6, { station: 'locked', label: 'Locked' });
  for (const [x, y] of [[21, 21.8], [31, 21.8], [21, 15.6], [31, 15.6], [16, 25.6], [36, 26.6], [12.5, 21.2]]) add(BIG_LAMP, x, y, { ms: 300, light: [x * 16, y * 16 - 34, 34], box: [x * 16 - 3, y * 16 - 4, 6, 4] });
  for (const [i, x, y] of [[0, 4.6, 8.4], [1, 17, 7.6], [2, 31.5, 8], [0, 48.8, 15.6], [1, 48.6, 24], [2, 3.8, 22.6], [0, 23.4, 32.4], [1, 31.8, 32.6], [2, 48.6, 32]]) add(TREES[i], x, y, { box: [x * 16 - 9, y * 16 - 8, 18, 8] });
  for (const [x, y] of [[19.2, 9.4], [34, 9.6], [3.6, 12.4], [30.2, 28.6], [21.8, 30.4], [46.6, 20.4], [15, 22.5], [44, 22]]) add(FERN, x, y, { solid: false });
  for (const [x, y] of [[18, 29], [35.5, 17.2], [6, 20.6]]) add(SHROOM_PATCH, x, y, { solid: false });
  for (const [x, y] of [[29.5, 24.4]]) add(BENCH, x, y);
  // where you can't walk: walls, water, prop footprints
  const solidTile = (tx, ty) => { const t = T[ty] && T[ty][tx]; return t === undefined || t === 'R' || t === 'F' || t === 'w'; };
  const blocked = (x, y) => { if (solidTile(Math.floor(x / 16), Math.floor(y / 16))) return true; for (const p of props) if (p.box) { const [bx, by, bw, bh] = p.box; if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) return true; } return false; };
  const fog = [[35, 3, 50, 13], [34, 25, 50, 33]].map(([x0, y0, x1, y1]) => [x0 * 16, y0 * 16, (x1 - x0) * 16, (y1 - y0) * 16]);
  return { W, H, ground, props, blocked, fog, spawn: [26 * 16, 18.4 * 16] };
}

const FLIPPED = {}; for (const k in BUGS) FLIPPED[k] = BUGS[k].map(flipX);
function mountHollow(root, ui) {
  const world = makeHollow();
  const cv = document.createElement('canvas'); cv.className = 'px hollow-cv'; root.appendChild(cv);
  const ctx = cv.getContext('2d');
  let S = 3, VW = 0, VH = 0, buf = null, bc = null;
  const resize = () => { const r = root.getBoundingClientRect(); S = r.width < 600 ? 2 : 3; VW = Math.ceil(r.width / S); VH = Math.ceil(r.height / S); cv.width = VW * S; cv.height = VH * S; cv.style.width = VW * S + 'px'; cv.style.height = VH * S + 'px'; buf = px(VW, VH, () => {}); bc = buf.getContext('2d'); };
  new ResizeObserver(resize).observe(root); resize();
  const me = { x: world.spawn[0], y: world.spawn[1], face: 1, moving: false, trail: [], bug: 'firefly' };
  const keys = {}; let joy = null, near = null, paused = false, t0 = performance.now();
  root.tabIndex = 0;
  root.addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault(); keys[e.code] = true; if ((e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') && near && !paused) ui.open(near); });
  root.addEventListener('keyup', e => { keys[e.code] = false; });
  root.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  cv.addEventListener('pointerdown', e => { root.focus(); joy = { x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (joy) { joy.x = e.clientX; joy.y = e.clientY; } });
  cv.addEventListener('pointerup', () => { joy = null; });
  const lights = world.props.filter(p => p.light).map(p => p.light);
  const motes = Array.from({ length: 40 }, () => ({ x: rnd() * world.W, y: rnd() * world.H, p: rnd() * TAU, s: .3 + rnd() * .6 }));
  const darkness = px(1, 1, () => {});
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; const T = (now - t0) / 1000;
    // move
    let ix = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0), iy = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
    if (joy) { const dx = joy.x - joy.x0, dy = joy.y - joy.y0, d = Math.hypot(dx, dy); if (d > 8) { ix = dx / d; iy = dy / d; } }
    const m = Math.hypot(ix, iy); me.moving = m > 0 && !paused;
    if (me.moving) { ix /= m; iy /= m; const sp = 78 * dt; const nx = me.x + ix * sp, ny = me.y + iy * sp; if (!world.blocked(nx, me.y)) me.x = nx; if (!world.blocked(me.x, ny)) me.y = ny; if (ix) me.face = ix > 0 ? 1 : -1; me.trail.unshift([me.x, me.y]); if (me.trail.length > 60) me.trail.pop(); }
    // what's close
    near = null; let bd = 34;
    for (const p of world.props) if (p.station) { const cx = p.x + p.w / 2, d = Math.hypot(me.x - cx, me.y - p.foot); if (d < bd + p.w * .35) { bd = d - p.w * .35; near = p; } }
    ui.prompt(near && !paused ? near : null);
    // camera
    const cx = Math.round(Math.max(0, Math.min(world.W - VW, me.x - VW / 2))), cy = Math.round(Math.max(0, Math.min(world.H - VH, me.y - 10 - VH / 2)));
    bc.setTransform(1, 0, 0, 1, 0, 0); bc.fillStyle = '#06090a'; bc.fillRect(0, 0, VW, VH);
    bc.drawImage(world.ground, -cx, -cy);
    // things, sorted by their feet so you can walk behind them
    const list = world.props.map(p => ({ p, foot: p.foot })); list.push({ me: true, foot: me.y });
    list.sort((a, b) => a.foot - b.foot);
    for (const it of list) {
      if (it.me) {
        bc.fillStyle = 'rgba(0,0,0,.35)'; bc.fillRect(Math.round(me.x - 6 - cx), Math.round(me.y - 1 - cy), 12, 2);
        const fi = me.moving ? Math.floor(T * 10) % 2 : Math.floor(T * 2) % 2, img = me.face < 0 ? FLIPPED[me.bug][fi] : BUGS[me.bug][fi], fr = img, bob = me.moving ? 0 : Math.round(Math.sin(T * 3));
        bc.drawImage(img, Math.round(me.x - img.width / 2 - cx), Math.round(me.y - img.height - 4 + bob - cy));
        continue;
      }
      const p = it.p; if (p.x - cx > VW || p.x + p.w - cx < 0 || p.y - cy > VH || p.foot - cy < -10) continue;
      if (p.solid !== false) { bc.fillStyle = 'rgba(0,0,0,.3)'; bc.beginPath(); bc.ellipse(Math.round(p.x + p.w / 2 - cx), Math.round(p.foot - 2 - cy), Math.round(p.w * .4), 4, 0, 0, TAU); bc.fill(); }
      const seq = p.anim || p.frames.map((_, i) => i), f = p.frames[seq[Math.floor(now / p.ms) % seq.length]] || p.frames[0];
      bc.drawImage(f, p.x - cx, p.y - cy);
      if (p === near) { bc.fillStyle = '#f2c14e'; const ax = Math.round(p.x + p.w / 2 - cx), ay = Math.round(p.y - 6 - cy + Math.sin(T * 5) * 1.5); bc.fillRect(ax - 2, ay, 5, 1); bc.fillRect(ax - 1, ay + 1, 3, 1); bc.fillRect(ax, ay + 2, 1, 1); }
    }
    // your fireflies, trailing behind
    for (let i = 0; i < 3; i++) { const q = me.trail[(i + 1) * 9] || [me.x - me.face * (8 + i * 7), me.y + 2]; bc.drawImage(FIREFLY[Math.floor(T * 8 + i) % 2], Math.round(q[0] - 2 - cx), Math.round(q[1] - 12 - cy + Math.sin(T * 4 + i) * 2)); }
    // locked corners sit in fog
    for (const [x, y, w, h] of world.fog) { bc.fillStyle = 'rgba(10,14,20,.5)'; bc.fillRect(x - cx, y - cy, w, h); }
    // dusk, with warm holes around the lights and you
    if (darkness.width !== VW || darkness.height !== VH) { darkness.width = VW; darkness.height = VH; }
    const dc = darkness.getContext('2d'); dc.globalCompositeOperation = 'source-over'; dc.clearRect(0, 0, VW, VH); dc.fillStyle = 'rgba(4,8,14,.42)'; dc.fillRect(0, 0, VW, VH); dc.globalCompositeOperation = 'destination-out';
    for (const [lx, ly, r] of [...lights, [me.x, me.y - 8, 46]]) dc.drawImage(haloOf(r), Math.round(lx - r - cx), Math.round(ly - r - cy));
    bc.drawImage(darkness, 0, 0);
    bc.globalCompositeOperation = 'lighter';
    for (const [lx, ly, r] of lights) { const k = .75 + Math.sin(T * 6 + lx) * .08; bc.globalAlpha = k; bc.drawImage(warmOf(r >> 1), Math.round(lx - (r >> 1) - cx), Math.round(ly - (r >> 1) - cy)); }
    bc.globalAlpha = 1;
    for (const mo of motes) { const x = Math.round((mo.x + Math.sin(T * mo.s + mo.p) * 12) - cx), y = Math.round((mo.y + Math.cos(T * mo.s * .8 + mo.p) * 8) - cy); if (x < -4 || y < -4 || x > VW + 4 || y > VH + 4) continue; const b = .5 + .5 * Math.sin(T * 2 + mo.p); if (b > .25) { bc.globalAlpha = b; bc.drawImage(warmOf(3), x - 3, y - 3); bc.fillStyle = '#fff3a0'; bc.fillRect(x, y, 1, 1); } }
    bc.globalAlpha = 1; bc.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = false; ctx.drawImage(buf, 0, 0, VW * S, VH * S);
    requestAnimationFrame(frame);
  }
  const hc = {}, wc = {}; const haloOf = r => hc[r] || (hc[r] = px(r * 2, r * 2, (c, dot) => { for (let y = 0; y < r * 2; y++) for (let x = 0; x < r * 2; x++) { const d = Math.hypot(x + .5 - r, y + .5 - r) / r; if (d < 1) dot(x, y, 'rgba(0,0,0,' + (Math.ceil((1 - d) * 5) / 5).toFixed(2) + ')'); } }));
  // (stepped holes in the dusk, above)
  const warmOf = r => wc[r] || (wc[r] = halo(r, [255, 200, 110], 4));
  requestAnimationFrame(frame);
  return { goto: (tx, ty) => { me.x = tx * 16; me.y = ty * 16; }, setBug: b => { me.bug = b; }, pause: v => { paused = v; for (const k in keys) keys[k] = false; }, get near() { return near; } };
}
