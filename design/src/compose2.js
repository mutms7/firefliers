// ---------- page assembly ----------
document.getElementById('kit').textContent = kitCSS();
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
function view(frames, scale, ms = 420) {
  frames = Array.isArray(frames) ? frames : [frames]; const f0 = frames[0], cv = document.createElement('canvas');
  cv.width = f0.width * scale; cv.height = f0.height * scale; cv.className = 'px'; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false;
  let i = 0; const draw = () => { c.clearRect(0, 0, cv.width, cv.height); const f = frames[i % frames.length]; c.drawImage(f, 0, 0, f.width * scale, f.height * scale); };
  draw(); if (frames.length > 1 && !still) setInterval(() => { i++; draw(); }, ms);
  return cv;
}
function card(parent, frames, scale, name, note, opt = {}) {
  const f = el('figure', 'card' + (opt.big ? ' big' : '')); const stage = el('div', 'stage'); stage.appendChild(view(frames, scale, opt.ms)); f.appendChild(stage);
  const cap = el('figcaption'); cap.appendChild(el('b', '', name)); if (note) cap.appendChild(el('span', '', note)); f.appendChild(cap); parent.appendChild(f); return f;
}
const grid = (id, cls) => { const g = el('div', 'grid' + (cls ? ' ' + cls : '')); $(id).appendChild(g); return g; };
const img = (cv, s = 2, alt = '') => '<img class="pxi" alt="' + alt + '" width="' + cv.width * s + '" height="' + cv.height * s + '" src="' + uri(cv) + '">';
const amberTag = n => '<span class="price">' + img(AMBER_SMALL, 3) + ' ' + n + '</span>';

// ---- shared demo state: your amber and what you've grown ----
const ST = { amber: 420, owned: new Set(['first', 'bright', 'wings', 'shell']), bug: 'firefly', views: [] };
const nodeState = n => ST.owned.has(n.id) ? 'owned' : n.req.every(r => ST.owned.has(r)) ? 'open' : 'locked';
const changed = () => ST.views.forEach(v => v());

// ---- the Root Tree viewer: drag (or use the arrow keys) to look around, tap a node to see it ----
function TreeView(host) {
  const wrap = el('div', 'tree'); host.appendChild(wrap);
  const cv = document.createElement('canvas'); cv.className = 'px'; wrap.appendChild(cv);
  const bal = el('div', 'tree-bal'); wrap.appendChild(bal);
  const cardEl = el('div', 'k-panel tree-card'); wrap.appendChild(cardEl);
  const U2 = 58, X0 = -4.6, Y0 = .9, LW = Math.round(10.6 * U2), LH = Math.round(6.6 * U2), S = 2;
  const at = n => [Math.round((n.x - X0) * U2), Math.round((n.y + 5.5) * U2)]; // first light sits at the bottom, the tree grows up
  let lowres = null, sel = null, pan = [0, 0], drag = null;
  const badgeCache = {}; const badgeOf = (n, s) => badgeCache[n.id + s] || (badgeCache[n.id + s] = badge(n, s));
  function paint() {
    lowres = px(LW, LH, (c, dot) => {
      c.fillStyle = '#080b0c'; c.fillRect(0, 0, LW, LH); reseed(64);
      for (let i = 0; i < 900; i++) { c.fillStyle = rnd() < .5 ? '#0c1012' : '#06090a'; c.fillRect((rnd() * LW) | 0, (rnd() * LH) | 0, 2, 1); }
      const [rx, ry] = at(NODE.first); const g = pg(LW, LH); blob(g, bez([rx, LH], [rx - 4, ry + 40], [rx, ry]), 9, 5, 'B'); for (const [a, b] of [[[rx - 6, LH], [rx - 40, LH - 6]], [[rx + 6, LH], [rx + 44, LH - 4]]]) blob(g, [a, b], 4, 1.5, 'B');
      for (const n of TREE.map(t => NODE[t[0]])) for (const r of n.req) { const [x0, y0] = at(NODE[r]), [x1, y1] = at(n); blob(g, bez([x0, y0], [(x0 + x1) / 2 + (x1 - x0) * .1, (y0 + y1) / 2 + 6], [x1, y1], 14), 3.4, 2.6, 'B'); }
      c.drawImage(bake({ B: P.bark }, g, '#030405'), -1, -1);
      for (const n of TREE.map(t => NODE[t[0]])) for (const r of n.req) { const [x0, y0] = at(NODE[r]), [x1, y1] = at(n), lit = ST.owned.has(r) && ST.owned.has(n.id), open = ST.owned.has(r); const pts = bez([x0, y0], [(x0 + x1) / 2 + (x1 - x0) * .1, (y0 + y1) / 2 + 6], [x1, y1], 40); c.fillStyle = lit ? BR[n.br].col : open ? BR[n.br].dark : '#2a1c14'; for (const [x, y] of pts) c.fillRect(Math.round(x), Math.round(y), 1, 1); }
      for (const n of TREE.map(t => NODE[t[0]])) { const [x, y] = at(n), s = nodeState(n); if (s === 'owned') c.drawImage(halo(24, n.br === 'wing' ? [127, 214, 194] : n.br === 'root' ? [143, 208, 106] : [242, 193, 78], 4), x - 24, y - 24); c.drawImage(badgeOf(n, s), x - 17, y - 17); }
    });
  }
  function fit() { const r = wrap.getBoundingClientRect(); cv.width = Math.round(r.width); cv.height = Math.round(r.height); clampPan(); draw(); }
  function clampPan() { pan[0] = Math.min(40, Math.max(cv.width - LW * S - 40, pan[0])); pan[1] = Math.min(40, Math.max(cv.height - LH * S - 40, pan[1])); }
  function draw() {
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.fillStyle = '#06090a'; c.fillRect(0, 0, cv.width, cv.height);
    c.drawImage(lowres, Math.round(pan[0]), Math.round(pan[1]), LW * S, LH * S);
    c.font = '20px "Jersey 20", monospace'; c.textAlign = 'center'; c.textBaseline = 'top';
    for (const t of TREE) { const n = NODE[t[0]], [x, y] = at(n), s = nodeState(n), sx = pan[0] + x * S, sy = pan[1] + y * S + 36; c.fillStyle = '#000c'; c.fillText(n.name, sx, sy + 2); c.fillStyle = s === 'owned' ? '#e9e4d6' : s === 'open' ? BR[n.br].col : '#5d6563'; c.fillText(n.name, sx, sy); }
    if (sel) { const [x, y] = at(sel), sx = pan[0] + x * S, sy = pan[1] + y * S; c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.setLineDash([6, 6]); c.lineDashOffset = -(performance.now() / 60); c.beginPath(); c.arc(sx, sy, 42, 0, TAU); c.stroke(); c.setLineDash([]); }
  }
  function showCard() {
    bal.innerHTML = amberTag(ST.amber);
    if (!sel) { cardEl.innerHTML = '<p class="tc-hint">Tap a node. Drag to look around.</p>'; return; }
    const s = nodeState(sel), poor = sel.cost > ST.amber;
    cardEl.innerHTML = '<div class="tc">' + img(badge(sel, s), 2) + '<div><b>' + sel.name + '</b><span>' + sel.desc + '</span></div></div>' +
      (s === 'owned' ? '<div class="tc-own">' + img(ICO.check, 2) + ' Grown</div>' : s === 'locked' ? '<div class="tc-need">Grow ' + sel.req.filter(r => !ST.owned.has(r)).map(r => NODE[r].name).join(' and ') + ' first</div>' :
        '<button class="k-btn"' + (poor ? ' disabled' : '') + '>Grow ' + img(AMBER_SMALL, 3) + ' ' + sel.cost + '</button>');
    const b = cardEl.querySelector('button'); if (b) b.onclick = () => { if (ST.amber < sel.cost) return; ST.amber -= sel.cost; ST.owned.add(sel.id); changed(); };
  }
  const refresh = () => { paint(); draw(); showCard(); }; ST.views.push(refresh);
  cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, px: pan[0], py: pan[1], moved: 0 }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!drag) return; drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x, e.clientY - drag.y)); pan = [drag.px + e.clientX - drag.x, drag.py + e.clientY - drag.y]; clampPan(); draw(); });
  cv.addEventListener('pointerup', e => { if (drag && drag.moved < 6) { const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top; sel = null; for (const t of TREE) { const n = NODE[t[0]], [x, y] = at(n); if (Math.hypot(pan[0] + x * S - mx, pan[1] + y * S - my) < 36) sel = n; } showCard(); draw(); } drag = null; });
  wrap.tabIndex = 0; wrap.setAttribute('aria-label', 'Root Tree. Arrow keys look around.');
  wrap.addEventListener('keydown', e => { const d = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }[e.key]; if (d) { e.preventDefault(); pan[0] += d[0]; pan[1] += d[1]; clampPan(); draw(); } });
  if (!still) setInterval(() => { if (sel) draw(); }, 60);
  paint(); new ResizeObserver(() => { const first = !cv.width; fit(); if (first || !wrap.dataset.placed) { const [x, y] = at(NODE.first); pan = [cv.width / 2 - x * S, cv.height - y * S - 70]; clampPan(); draw(); wrap.dataset.placed = 1; } }).observe(wrap);
  sel = NODE.twin; showCard();
  return { redraw: refresh };
}

// ---- 1. the walkable Hollow ----
(() => {
  const box = $('hollow'), overlay = el('div', 'hollow-ov'), hint = el('div', 'hollow-hint'), toast = el('div', 'hollow-toast'), start = el('button', 'hollow-start', 'Click to walk around');
  box.append(overlay, hint, toast, start); overlay.hidden = true; toast.hidden = true;
  let game;
  const say = msg => { toast.innerHTML = msg; toast.hidden = false; clearTimeout(say.t); say.t = setTimeout(() => toast.hidden = true, 2200); };
  const close = () => { overlay.hidden = true; overlay.innerHTML = ''; game.pause(false); box.focus(); };
  const panel = (title, inner) => { overlay.innerHTML = '<div class="k-panel gold ov-panel"><div class="ov-head"><h3>' + title + '</h3><button class="k-btn stone icon" aria-label="Close">' + img(ICO.close) + '</button></div>' + inner + '</div>'; overlay.querySelector('.ov-head button').onclick = close; overlay.hidden = false; game.pause(true); };
  const ui = {
    prompt(p) { if (!p) { hint.hidden = true; return; } hint.hidden = false; hint.innerHTML = '<button class="hint-btn"><span class="k-key">E</span> ' + p.label + '</button>'; hint.querySelector('button').onclick = () => ui.open(p); },
    open(p) {
      if (p.station === 'gate') { say('Off into the night! (Starts a run.)'); return; }
      if (p.station === 'locked') { say(img(ICO.lock) + ' Soon'); return; }
      if (p.station === 'tree') { panel('The Root Tree', '<div class="ov-tree"></div>'); TreeView(overlay.querySelector('.ov-tree')); return; }
      if (p.station === 'roost') { panel('Choose your bug', '<div class="pick">' + ['firefly', 'moth', 'beetle'].map(b => { const ok = b === 'firefly' || ST.owned.has(b); return '<button class="pick-b' + (ST.bug === b ? ' on' : '') + '"' + (ok ? '' : ' disabled') + ' data-b="' + b + '">' + img(ok ? BUGS[b][0] : SILHOUETTE[b], 4) + '<b>' + (ok ? BUG_NAMES[b] : 'Locked') + '</b><span>' + (ok ? BUG_ROLE[b] : 'Grow it in the Root Tree') + '</span></button>'; }).join('') + '</div>'); overlay.querySelectorAll('.pick-b').forEach(b => b.onclick = () => { ST.bug = b.dataset.b; game.setBug(ST.bug); close(); }); return; }
      if (p.station === 'daily') { panel('Daily #17', '<div class="daily">' + img(BUGS.moth[0], 4) + '<div><b>Today: Moth</b><span>Same run for everyone.</span><span>Your best: 2,140</span></div></div><div class="row end"><button class="k-btn mint">Play today</button></div>'); return; }
      if (p.station === 'records') { panel('Records', '<div class="stats rec"><div><b>4,094</b>best</div><div><b>9:12</b>longest</div><div><b>31</b>runs</div><div><b>7/18</b>badges</div></div>'); return; }
    },
  };
  start.onclick = () => { start.remove(); box.focus(); };
  game = mountHollow(box, ui); hint.hidden = true; window.__hollow = { game, ui }; // a hook for testing
})();

// ---- 2. stations ----
(() => {
  { const m = el('div', 'mapwrap'), inner = el('div', 'mapin'); const v = view(hollowOverview(), 2); v.classList.add('map'); inner.appendChild(v); m.appendChild(inner); $('stations').appendChild(m); $('stations').appendChild(el('h3', '', 'Each station')); }
  const g = grid('stations', 'wide');
  card(g, BIG_GATE, 4, 'Lantern Gate', 'Fly out.', { ms: 140, big: 1 });
  card(g, ELDER, 3, 'Elder Root', 'The Root Tree.', { ms: 900, big: 1 });
  card(g, [GLIM[0], GLIM[1], GLIM[0], GLIM[2]], 5, 'Old Glim', 'Tends the tree.', { ms: 380 });
  card(g, BIG_SHROOMS, 4, 'The Roost', 'Choose your bug.', { ms: 900 });
  card(g, MOONSTONE, 4, 'Moonstone', 'Daily run.', { ms: 900 });
  card(g, [RECORDS], 4, 'Records', 'Your best runs.');
  card(g, [POND_GATE], 3, 'Pond gate', 'Locked: new modes.');
  card(g, [MARKET], 3, 'Market', 'Locked: a second shop.');
  const s = grid('scenery'); card(s, TREES, 3, 'Trees', '', { ms: 900 }); card(s, BIG_LAMP, 4, 'Lamp', '', { ms: 300 }); card(s, [FERN], 4, 'Fern', ''); card(s, [SHROOM_PATCH], 4, 'Glow mushrooms', '');
  const patch = arr => [0, 1].map(f => px(48, 48, pc => { reseed(13 + f); for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pc.drawImage(arr === HUB_TILES.water || arr === HUB_TILES.shore ? arr[f] : arr[(rnd() * arr.length) | 0], x * 16, y * 16); }));
  const t = grid('tiles'); for (const [n, a] of [['Grass', HUB_TILES.grass], ['Dirt', HUB_TILES.dirt], ['Stepping slabs', HUB_TILES.slab], ['Water', HUB_TILES.water], ['Shore', HUB_TILES.shore], ['Root wall', HUB_TILES.rootTop], ['Root wall face', HUB_TILES.rootFace]]) card(t, patch(a), 3, n, '', { ms: 700 });
})();

// ---- 3. the Root Tree ----
TreeView($('tree'));

// ---- 4. characters ----
const BUG_ROLE = { firefly: 'Steady all-rounder', moth: 'Fast, fragile', beetle: 'Slow, tough' };
const SILHOUETTE = {}; for (const b of ['moth', 'beetle']) SILHOUETTE[b] = px(BUGS[b][0].width, BUGS[b][0].height, c => { c.drawImage(BUGS[b][0], 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = '#1e2626'; c.fillRect(0, 0, 99, 99); });
(() => { const g = grid('chars'); for (const k of ['firefly', 'moth', 'beetle']) card(g, BUGS[k], 6, BUG_NAMES[k], BUG_ROLE[k], { ms: 160 }); card(g, FIREFLY, 8, 'Trail firefly', '', { ms: 260 }); card(g, STRAY, 7, 'Lost firefly', '', { ms: 400 }); })();

// ---- 5. icons ----
(() => {
  const w = grid('weapons'); for (const k in WEAPON_ICONS) { card(w, [WEAPON_ICONS[k]], 5, WEAPON_NAMES[k][0], ''); card(w, [EVOLVED_ICONS[k]], 4, WEAPON_NAMES[k][1], 'Evolved'); }
  const p = grid('passives'); for (const k in PASSIVE_ICONS) card(p, [PASSIVE_ICONS[k]], 5, PASSIVE_NAMES[k], '');
  const pk = grid('pickups'); for (const k in PICKUPS) card(pk, [PICKUPS[k]], 5, PICKUP_NAMES[k], ''); SPARKS.forEach((s, i) => card(pk, [s], 8, ['Spark', 'Bright spark', 'Gold spark'][i], '')); card(pk, [AMBER], 6, 'Amber', 'Spent on the tree.');
  const ic = grid('hudicons'); const names = { health: 'Health', squash: 'Squashed', firefly: 'Fireflies', clock: 'Time', pause: 'Pause', soundOn: 'Sound', music: 'Music', gear: 'Settings', lock: 'Locked', check: 'Done', star: 'Badge', moon: 'Daily', back: 'Back', close: 'Close' };
  for (const k in names) card(ic, [ICO[k]], 5, names[k], '');
})();
// ---- 6. projectiles ----
(() => {
  const g = grid('shots'); for (const k in PLAYER_SHOTS) card(g, PLAYER_SHOTS[k], 6, k, '', { ms: 160 });
  const e = grid('eshots'); for (const k in ENEMY_SHOTS) card(e, [ENEMY_SHOTS[k]], 7, k, ''); card(e, SHOCKWAVE, 4, 'Shockwave', '', { ms: 300 }); card(e, [WEB], 4, 'Web', '');
  const f = grid('effects'); card(f, HIT, 7, 'Hit', '', { ms: 120 }); card(f, POOF, 5, 'Poof', '', { ms: 140 }); card(f, LEVEL_BURST, 4, 'Level up', '', { ms: 220 }); card(f, [HEAL], 7, 'Heal', '');
})();
// ---- 7. the run ----
function enemyFrames(name) { const d = SPRITES[name]; return d.frames.map(fr => bake(d.pal, fr, d.ol)); }
(() => {
  const W = 30, H = 17, M = px(W * 16, H * 16, () => {}), c = M.getContext('2d'); reseed(303);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const r = rnd(); const set = r < .07 ? RUN_TILES.slab : r < .1 ? RUN_TILES.spores : r < .12 ? RUN_TILES.rebar : RUN_TILES.grass; c.drawImage(set[(rnd() * set.length) | 0], x * 16, y * 16); }
  for (const [x, y] of [[6, 4], [7, 4], [6, 5], [22, 11], [23, 11]]) c.drawImage(RUN_TILES.slab[0], x * 16, y * 16); for (const [x, y] of [[12, 12], [25, 3]]) c.drawImage(RUN_TILES.puddle[0], x * 16, y * 16);
  for (const [im, x, y] of [[STUMP, 4, 9], [STANDING, 20, 2], [STANDING, 22, 2.6], [DEAD_LAMP, 26, 9], [STUMP, 15, 1.5], [STANDING, 2, 13]]) { c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x * 16 + im.width / 2, y * 16 + im.height - 1, im.width * .42, 3, 0, 0, TAU); c.fill(); c.drawImage(im, x * 16, y * 16); }
  const put2 = (im, x, y, flip) => c.drawImage(flip ? flipX(im) : im, Math.round(x - im.width / 2), Math.round(y - im.height / 2));
  const P0 = [15 * 16, 9 * 16];
  c.globalCompositeOperation = 'lighter'; c.drawImage(halo(80, [255, 210, 120], 5), P0[0] - 80, P0[1] - 80); c.globalCompositeOperation = 'source-over';
  for (const [n, x, y] of [['tick', 9, 5], ['tick', 10.5, 6.5], ['gnat', 20, 6], ['toad', 23, 13.5], ['beetle', 7, 12], ['brood', 21, 9], ['puff', 11, 12.5], ['moth', 18, 3.5], ['jar', 12, 3], ['tick', 24, 7], ['grub', 19.2, 10.5]]) put2(enemyFrames(n)[0], x * 16, y * 16, x * 16 > P0[0]);
  put2(BUGS.firefly[0], P0[0], P0[1]); for (let i = 0; i < 5; i++) put2(FIREFLY[0], P0[0] - 14 - i * 9, P0[1] + 4 + Math.sin(i) * 4);
  put2(PLAYER_SHOTS['Spark Shot'][0], P0[0] + 40, P0[1] - 14); put2(PLAYER_SHOTS['Spark Shot'][1], P0[0] + 72, P0[1] - 30); put2(PLAYER_SHOTS['Thorn'][1], P0[0] - 50, P0[1] + 36);
  put2(PLAYER_SHOTS['Moon scythe'][0], P0[0] + 2, P0[1] - 30); put2(PLAYER_SHOTS['Spore cloud'][0], P0[0] - 60, P0[1] + 10);
  for (const [k, x, y] of [['Beetle spit', 8.6, 11.2], ['Beetle spit', 10.2, 10.6], ['Eclipse ember', 19.6, 8.4], ['Generic shot', 17.8, 11.6], ['Hive sting', 13.2, 5]]) put2(ENEMY_SHOTS[k], x * 16, y * 16);
  put2(SPARKS[0], 13 * 16, 8 * 16); put2(SPARKS[1], 17 * 16, 12 * 16); put2(SPARKS[2], 14 * 16, 13 * 16); put2(PICKUPS.heart, 6 * 16, 7 * 16); put2(HIT[2], 20 * 16 - 8, 6 * 16 - 2); put2(POOF[1], 11 * 16, 9.4 * 16);
  const v = view(M, 2); v.classList.add('map'); $('level').appendChild(v);
  const t = grid('runtiles'); const tc = (n, a) => card(t, [0, 1].map(f => px(48, 48, pc => { reseed(17 + f); for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) pc.drawImage(a === RUN_TILES.puddle ? a[f] : a[(rnd() * a.length) | 0], x * 16, y * 16); })), 3, n, '', { ms: 700 });
  tc('Meadow', RUN_TILES.grass); tc('Slabs', RUN_TILES.slab); tc('Puddle', RUN_TILES.puddle); tc('Rebar', RUN_TILES.rebar); tc('Spores', RUN_TILES.spores);
  card(t, [STUMP], 4, 'Stump', ''); card(t, [STANDING], 4, 'Standing stone', ''); card(t, [DEAD_LAMP], 4, 'Dead lamp', '');
})();
// ---- 8. UI kit and screens ----
(() => {
  const slider = (id, label, v) => `<label class="field"><span>${label}</span><div class="k-slider"><div class="tr"></div><div class="fi"></div><div class="kn"></div><input id="${id}" type="range" min="0" max="100" value="${v}" aria-label="${label}"></div><output>${v}</output></label>`;
  $('kit-a').innerHTML = `<div class="row"><button class="k-btn">Fly out</button><button class="k-btn is-hover" tabindex="-1">Hover</button><button class="k-btn is-down" tabindex="-1">Pressed</button><button class="k-btn" disabled>Can't afford</button></div>
    <div class="row"><button class="k-btn stone">Back</button><button class="k-btn mint">Play today</button><button class="k-btn stone icon" aria-label="Pause">${img(ICO.pause)}</button><button class="k-btn stone icon" aria-label="Settings">${img(ICO.gear)}</button><button class="k-btn stone icon" aria-label="Close">${img(ICO.close)}</button></div>`;
  $('kit-b').innerHTML = `${slider('s1', 'Music', 70)}<label class="opt"><input id="t1" class="k-toggle" type="checkbox" checked> Screen shake</label>
    <div class="bars"><div class="k-bar"><i style="width:62%;background:repeating-linear-gradient(90deg,#4f8fe0 0 9px,#3d79c9 9px 12px)"></i></div><div class="k-bar"><i style="width:74%;background:repeating-linear-gradient(90deg,#d9574a 0 9px,#b8443a 9px 12px)"></i></div></div>
    <div class="row">${amberTag(312)}<span class="prompt"><span class="k-key">E</span> The Root Tree</span><span class="k-toast">${img(ICO.star)} Badge: Dawnbringer</span></div>`;
  $('settings').innerHTML = `<div class="k-panel set-min"><h3>${img(ICO.gear)} Settings</h3>${slider('s3', 'Music', 70)}${slider('s4', 'Sounds', 45)}<label class="opt"><input id="t3" class="k-toggle" type="checkbox" checked> Screen shake</label><div class="row end"><button class="k-btn">Done</button></div></div>`;
  $('summary').innerHTML = `<div class="k-panel gold sum"><h3>Home again</h3><div class="sum-amber">${img(AMBER_PILE, 5)}<b>+84</b></div><div class="row end"><button class="k-btn">Continue</button></div></div>`;
  $('levelup').innerHTML = `<div class="k-panel lu"><h3>Level 7</h3>${[['bolt', 'Spark Shot', 'Lv 3'], ['zap', 'Chain Zap', 'New'], ['vigor', 'Big Heart', 'Lv 2']].map(([k, n, l]) => `<button class="lu-row">${img(WEAPON_ICONS[k] || PASSIVE_ICONS[k], 3)}<b>${n}</b><span class="tag">${l}</span></button>`).join('')}</div>`;
  document.querySelectorAll('.k-slider').forEach(s => { const inp = s.querySelector('input'), out = s.parentElement.querySelector('output'); const set = () => { const v = +inp.value; s.querySelector('.fi').style.width = 'calc(' + v + '% - ' + (v / 100 * 6) + 'px)'; s.querySelector('.kn').style.left = 'calc(' + v + '% + ' + (3.5 - v / 100 * 7) * 3 + 'px)'; if (out) out.textContent = v; }; inp.addEventListener('input', set); set(); });
})();
