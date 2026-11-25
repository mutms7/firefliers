// ---------- core: grids, shading, baking (same rules as the game's creatures) ----------
const TAU = Math.PI * 2;
const pg = (w, h) => Array.from({ length: h }, () => Array(w).fill('.'));
const rows = g => g.map(r => r.join(''));
const put = (g, x, y, ch) => { if (g[y] && x >= 0 && x < g[0].length) g[y][x] = ch; };
const rect = (g, x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(g, x, y, ch); };
const ell = (g, cx, cy, rx, ry, ch, test) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) if (((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1 && (!test || test(x, y))) g[y][x] = ch; };
const line = (g, x0, y0, x1, y1, ch) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1; for (let i = 0; i <= n; i++) put(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), ch); };
const polyFill = (g, pts, ch) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) { let inside = false; const px = x + .5, py = y + .5; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside; } if (inside) g[y][x] = ch; } };
const mirror = g => { const w = g[0].length; for (const r of g) for (let x = 0; x < w / 2; x++) if (r[x] !== '.') r[w - 1 - x] = r[x]; return g; };
const replace = (g, from, to, test) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) if (g[y][x] === from && (!test || test(x, y))) g[y][x] = to; return g; };
const copy = g => g.map(r => r.slice());
const fromRows = rs => { const w = Math.max(...rs.map(r => r.length)); return rs.map(r => (r + '.'.repeat(w)).slice(0, w).split('')); };
let seedN = 7; const rnd = () => (seedN = (seedN * 16807) % 2147483647) / 2147483647; const reseed = s => { seedN = s; };

// bake a grid into a canvas. Upper-case letters are shaded materials (lit from the top left, five-step hue-shifted ramp,
// a dithered band into shadow); other characters are flat colours; '.' is empty. ol: outline colour or null.
function bake(pal, g, ol = '#050608', opt = {}) {
  const r = Array.isArray(g[0]) ? g : fromRows(g), W = r[0].length, H = r.length, pad = ol ? 1 : 0;
  const cv = document.createElement('canvas'); cv.width = W + pad * 2; cv.height = H + pad * 2; const c = cv.getContext('2d');
  const at = (x, y) => (y >= 0 && y < H && x >= 0 && x < W) ? r[y][x] : '.';
  const bb = {};
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const ch = at(x, y); if (ch === '.') continue; const b = bb[ch] || (bb[ch] = { x0: x, x1: x, y0: y, y1: y }); b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.y0 = Math.min(b.y0, y); b.y1 = Math.max(b.y1, y); }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = at(x, y); if (ch === '.') continue; const p = pal[ch]; let col;
    if (Array.isArray(p)) {
      const b = bb[ch], rx = (x - b.x0 + .5) / (b.x1 - b.x0 + 1), ry = (y - b.y0 + .5) / (b.y1 - b.y0 + 1), out = (dx, dy) => at(x + dx, y + dy) !== ch;
      const lit = out(0, -1) || out(-1, 0), sh = out(0, 1) || out(1, 0); let t = 2;
      if (lit && !sh) t = 3; else if (sh && !lit) t = 1;
      if (!opt.flat) { if (ry > .68 || (ry > .56 && (x + y) % 2)) t--; if (ry > .86 && sh) t = 0; if (Math.hypot(rx - .32, ry - .28) < .16 && !sh) t = 4; }
      col = p[Math.max(0, Math.min(4, t))];
    } else col = p || '#ff00ff';
    c.fillStyle = col; c.fillRect(x + pad, y + pad, 1, 1);
  }
  if (ol) { c.fillStyle = ol; for (let y = -1; y <= H; y++) for (let x = -1; x <= W; x++) if (at(x, y) === '.' && (at(x - 1, y) !== '.' || at(x + 1, y) !== '.' || at(x, y - 1) !== '.' || at(x, y + 1) !== '.')) c.fillRect(x + pad, y + pad, 1, 1); }
  return cv;
}
// a blank pixel canvas to paint directly (tiles, UI pieces)
function px(w, h, fn) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'); const dot = (x, y, col) => { c.fillStyle = col; c.fillRect(x, y, 1, 1); }; const box = (x, y, w2, h2, col) => { c.fillStyle = col; c.fillRect(x, y, w2, h2); }; fn(c, dot, box); return cv; }
const flipX = cv => px(cv.width, cv.height, c => { c.translate(cv.width, 0); c.scale(-1, 1); c.drawImage(cv, 0, 0); });
const rot90 = cv => px(cv.height, cv.width, c => { c.translate(cv.height, 0); c.rotate(Math.PI / 2); c.drawImage(cv, 0, 0); });
// glow halo for warm lights, in pixel steps rather than a smooth gradient
function halo(r, col, steps = 4) { return px(r * 2, r * 2, (c, dot) => { const [R, G, B] = col; for (let y = 0; y < r * 2; y++) for (let x = 0; x < r * 2; x++) { const d = Math.hypot(x + .5 - r, y + .5 - r) / r; if (d < 1) { const k = Math.ceil((1 - d) * steps) / steps; dot(x, y, 'rgba(' + R + ',' + G + ',' + B + ',' + (k * k * .34).toFixed(3) + ')'); } } }); }

// shared palette (matches the game's HUD and world)
const P = {
  ink: '#e9e4d6', dim: '#8d9491', line: '#283030', line2: '#465150', gold: '#f2c14e', mint: '#7fd6c2', red: '#e8604c', night: '#0a0c0d',
  amber: ['#5a2408', '#9a4a10', '#e08a1c', '#ffb83a', '#ffe7a0'],
  stone: ['#16181e', '#262a32', '#3a3f48', '#565c66', '#7e848c'], mossStone: ['#121a18', '#1e2c26', '#2e4234', '#466048', '#6a8a62'],
  wood: ['#24140c', '#43271a', '#6a4026', '#8f5c36', '#b88452'], bark: ['#120b09', '#22150f', '#352318', '#4c3424', '#684a34'],
  brass: ['#3a2208', '#6a420e', '#a8701c', '#d8a03a', '#ffd27a'], leaf: ['#0c2018', '#173a26', '#245834', '#3a7e44', '#64ae5e'],
  teal: ['#0e2a2a', '#1a4a48', '#2a6e68', '#46a090', '#7ad0b8'], cream: ['#4a3a2a', '#8a7050', '#c8aa7a', '#ecd6a8', '#fff4d8'],
  glass: ['#142232', '#22405a', '#3a6a88', '#6a9cba', '#bfe2f4'], red: ['#3a0614', '#7a1024', '#c8283c', '#f05a5a', '#ff9e88'],
  pink: ['#4a0f3a', '#8a1f6a', '#d84aa8', '#ff7ad9', '#ffd0f0'], blue: ['#1a2a5a', '#2e4a8a', '#4f7ac8', '#86b0f0', '#d0e4ff'],
  violet: ['#1e1040', '#3a2070', '#6040b0', '#9070e0', '#c8b0ff'], green: ['#12381e', '#22622e', '#3c9a44', '#7cd06a', '#c8f8a8'],
  ice: ['#1a3a4a', '#2e6a80', '#5aaac0', '#9ad8e8', '#e8fbff'], cloth: ['#3a1a10', '#6e2e18', '#b0522a', '#e08040', '#ffc080'],
};
