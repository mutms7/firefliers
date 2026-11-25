// ---------- pitch-only sections ----------
// hero: the whole Hollow
(() => { const v = view(hollowOverview(), 2); v.classList.add('map'); $('heroart').appendChild(v); })();

// bestiary: every creature and boss from the game, animated, plus one creature's four looks
(() => {
  const CRE = [['tick', 'Blood tick', 'Slow chaser'], ['gnat', 'Gnat', 'Fast, weaving'], ['toad', 'Toad', 'Tough'], ['beetle', 'Bombardier beetle', 'Shoots from its tail'], ['brood', 'Brood jelly', 'Bursts into grubs'], ['grub', 'Grub', 'Fast and small'],
    ['puff', 'Puffcap', 'Swells, then bursts'], ['moth', 'Wraith moth', 'Lunges'], ['jar', 'Nightjar', 'Steals your fireflies'], ['gloomling', 'Gloomling', "The Gloom's drip"], ['drone', 'Hive wasp', 'Guards the Hive']];
  const BOS = [['gloom', 'The Gloom', 'Shockwaves'], ['maw', 'The Maw', 'Inhales, eats fireflies'], ['eclipse', 'The Eclipse', 'Beams. Break its corona'], ['weaver', 'The Weaver', 'Webs, then pounces'], ['shade', 'The Shade', 'Walks your trail'], ['hive', 'The Hive', 'Hides behind wasps']];
  const c = grid('creatures'); for (const [k, n, d] of CRE) card(c, enemyFrames(k), 5, n, d, { ms: k === 'gnat' || k === 'drone' ? 120 : 260 });
  const b = grid('bosses', 'wide'); for (const [k, n, d] of BOS) card(b, enemyFrames(k), 3, n, d, { ms: k === 'maw' ? 600 : 500 });
  // the four looks the game bakes for every creature
  const d = SPRITES.toad, recol = (fn) => { const p = {}; for (const k in d.pal) p[k] = Array.isArray(d.pal[k]) ? d.pal[k].map(fn) : fn(d.pal[k]); return p; };
  const frost = col => { const v = hexRgb2(col); return v ? 'rgb(' + v.map((x, i) => Math.round(x * .35 + [200, 246, 255][i] * .65)).join(',') + ')' : col; };
  const looks = [['Normal', bake(d.pal, d.frames[0], d.ol)], ['Hit', bake(recol(() => '#ffffff'), d.frames[0], d.ol)], ['Elite', px(d.frames[0][0].length + 4, d.frames[0].length + 4, cc => { cc.drawImage(bake(d.pal, d.frames[0], '#f2c14e'), 1, 1); })], ['Frozen', bake(recol(frost), d.frames[0], '#3a6a80')]];
  for (const [n, cv] of looks) card($('variants'), [cv], 5, n, '');
})();
function hexRgb2(c) { if (typeof c !== 'string' || c[0] !== '#' || c.length !== 7) return null; const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }

// palette swatches and a shading demo
(() => {
  const rows = [['Amber', P.amber], ['Gold light', GOLD], ['Mossy stone', P.mossStone], ['Stone', P.stone], ['Bark', P.bark], ['Leaf', P.leaf], ['Teal (Glim)', P.teal], ['Night ground', ['#0a0c0d', '#0d1715', '#132320', '#1a2f29', '#244034']], ['UI', ['#0e1213', '#283030', '#465150', '#8d9491', '#e9e4d6']], ['Accents', ['#f2c14e', '#7fd6c2', '#e8604c', '#c8b0ff', '#ff9ac8']]];
  $('swatches').innerHTML = rows.map(([n, r]) => '<div class="sw"><span>' + n + '</span><div class="ramp" role="img" aria-label="' + n + ' colours">' + r.map(c => '<i style="background:' + c + '" title="' + c + '"></i>').join('') + '</div></div>').join('');
  const g = pg(20, 20); ell(g, 10, 10, 9.5, 9.5, 'B');
  const flat = bake({ B: P.green[2] }, g, null), ramp = bake({ B: P.green }, g, null), out = bake({ B: P.green }, g);
  $('shading').innerHTML = ['Flat', 'Five-step ramp', 'Plus outline'].map((n, i) => '<figure class="card" style="width:150px"><div class="stage">' + img([flat, ramp, out][i], 5) + '</div><figcaption><b>' + n + '</b></figcaption></figure>').join('');
})();
