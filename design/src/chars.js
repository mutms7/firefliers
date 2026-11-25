// ---------- characters ----------
const WING = 'rgba(220,240,255,.55)', WINGS = ['#3a4a5e', '#6a8098', '#a8bfd4', '#d4e4f0', '#f6fbff']; // pale, opaque wings read better than see-through ones on a dark floor
const bugPal = {
  firefly: { W: WINGS, G: ['#8a6a10', '#d8a820', '#ffe066', '#fff3a0', '#ffffe0'], B: ['#1a1028', '#2b2140', '#3d2f5a', '#56447a', '#7a68a0'], H: ['#120a1e', '#20163a', '#2b2140', '#3d2f5a', '#56447a'], e: '#ffffff', w: WING, a: '#4a3a6a', l: '#2b2140' },
  moth: { W: ['#2a3466', '#4a6aa0', '#8fb0e0', '#c4dcff', '#eef6ff'], B: ['#3a4a7a', '#6a84b8', '#a6c4ec', '#d6e8ff', '#ffffff'], H: ['#1e2a50', '#2e3e70', '#4a5e98', '#6a84b8', '#a6c4ec'], e: '#0e1430', a: '#8fb0e0', l: '#2e3e70' },
  beetle: { S: ['#4a0f3a', '#8a1f6a', '#d84aa8', '#ff7ad9', '#ffd0f0'], B: ['#2a0a22', '#4a1a3e', '#6a2a5a', '#8a4a7a', '#b07aa0'], H: ['#1e0818', '#36122c', '#4a1a3e', '#6a2a5a', '#8a4a7a'], e: '#ffffff', k: '#ffd0f0', a: '#6a2a5a', l: '#36122c' },
  lantern: { W: WINGS, G: ['#1e5a20', '#3a9a3a', '#9dff8a', '#d4ffc8', '#ffffff'], B: ['#0e1e14', '#1a3424', '#264a32', '#3a6a48', '#5a9068'], H: ['#0a160e', '#14281a', '#1a3424', '#264a32', '#3a6a48'], d: '#1e5a20', e: '#ffffff', w: WING, a: '#3a6a48', l: '#14281a' },
  wasp: { W: WINGS, A: ['#5a2a08', '#a8501a', '#ff9a4d', '#ffc890', '#fff0d8'], B: ['#1e1208', '#3a2410', '#5a3a1a', '#7a5228', '#a07040'], H: ['#140c06', '#2a1a0c', '#3a2410', '#5a3a1a', '#7a5228'], d: '#2a1208', s: '#2a1208', e: '#ffffff', w: WING, a: '#5a3a1a', l: '#2a1a0c' },
};
const bugRows = {
  firefly: [['....WW..........', '...WWWW....a..a.', '..WWWWWW....aa..', '...WWWWWWBBHH...', 'GGGBBBBBBBHHHH..', 'GGGBBBBBBBHHeH..', 'GGGBBBBBBBHHHH..', '.GGGBBBBBBHHH...', '....l..l..l.....', '...l..l..l......'],
    ['................', '...........a..a.', '............aa..', '.........BBHH...', 'GGGBBBBBBBHHHH..', 'GGGBBWWWWWHHeH..', 'GGGBWWWWWWWHHH..', '.GGGWWWWWWWHH...', '....WWWWW.l.....', '...l..l..l......']],
  moth: [['..WWWW..........', '.WWWWWWW...a..a.', 'WWWWWWWWW...aa..', '.WWWWWWWWWBHH...', '..BBBBBBBBHHHH..', '.BBBBBBBBBHHeH..', '..BBBBBBBBHHHH..', '...BBBBBBBHHH...', '....l..l..l.....', '...l..l..l......'],
    ['................', '...........a..a.', '............aa..', '..........BHH...', '..BBBBBBBBHHHH..', '.BBBWWWWWWHHeH..', '..WWWWWWWWWHHH..', '.WWWWWWWWWHHH...', 'WWWWWWWl..l.....', '.WWWWl..l.......']],
  beetle: [['................', '....SSSSS...a.a.', '..SSSkSSSSS..a..', '.SSSSSSSkSSHH...', 'SSkSSSSSSSSHHH..', 'SSSSSSkSSSSHeH..', 'SSSSSSSSSSHHHH..', '.BBBBBBBBBHHH...', '..l..l..l..l....', '.l..l..l..l.....'],
    ['................', '....SSSSS...a.a.', '..SSSkSSSSS..a..', '.SSSSSSSkSSHH...', 'SSkSSSSSSSSHHH..', 'SSSSSSkSSSSHeH..', 'SSSSSSSSSSHHHH..', '.BBBBBBBBBHHH...', '.l..l..l..l.....', '..l..l..l..l....']],
  lantern: [['....WW..........', '...WWWW....a..a.', '..WWWWWW....aa..', 'GGGGWWWWWBBHH...', 'GGGGGBBBBBHHHH..', 'GGdGGBBBBBHHeH..', 'GGGGGBBBBBHHHH..', 'GGGG.BBBBBHHH...', '....l..l..l.....', '...l..l..l......'],
    ['................', '...........a..a.', '............aa..', 'GGGG.....BBHH...', 'GGGGGBBBBBHHHH..', 'GGdGGWWWWWHHeH..', 'GGGGWWWWWWWHHH..', 'GGGGWWWWWWWHH...', '....WWWWW.l.....', '...l..l..l......']],
  wasp: [['....WW..........', '...WWWW....a..a.', '..WWWWWW....aa..', '...WWWWWWBBHH...', 'sAAdAAdBBBHHHH..', '.AAdAAdBBBHHeH..', '..AdAAdBBBHHHH..', '...AAAABBBHHH...', '.......l.l.l....', '......l.l.l.....'],
    ['................', '...........a..a.', '............aa..', '.........BBHH...', 'sAAdAAdBBBHHHH..', '.AAdAAWWWWWHeH..', '..AdAWWWWWWWHH..', '...AAWWWWWWWH...', '.....WWWWW.l....', '......l.l.l.....']],
};
const BUGS = {}; for (const k in bugRows) BUGS[k] = bugRows[k].map(f => bake(bugPal[k], f));
const BUG_NAMES = { firefly: 'Firefly', moth: 'Moth', beetle: 'Beetle', lantern: 'Lantern', wasp: 'Wasp' };

// Old Glim: an old moth peddler with a jar-pack and a lantern on a staff
function glimRows(f) {
  const g = fromRows([
    '............a...a...', '...........a.a.a.a..', '............aa.aa...', '.............HHH....', '............HHHHH...', '...........HHHeeH..t', '...........HHHHpH..t',
    '..JJJ.......FFFF...t', '.JjJjJ....FFFFFFF..t', '.JJJJJJ..CCCCCCCC.LL', '.JjJjJJCCCCCCCCChhLg', '.JJJJJJCCCCCCCCC.tLL', '..JJJJCCCCCCCCCC..t.',
    '......CCCCCCCCCC..t.', '.....CCCCcCCCCCC..t.', '.....CCCCCCCCcCC..t.', '....CCCcCCCCCCCC..t.', '....CCCCCCCCCCCC..t.', '...CCCCCCCcCCCCC..t.',
    '...CCCCCCCCCCCCC..t.', '....CCCCCCCCCCC...t.', '.....ll....ll.....t.', '.....ll....ll.....t.', '....lll...lll.......']);
  if (f === 1) { g[10][19] = 'k'; g[0] = fromRows(['...........a...a....'])[0]; g[1] = fromRows(['..........a.a.a.a...'])[0]; replace(g, 'j', 'k'); }
  if (f === 2) { g[6][15] = 'm'; g[5][14] = 'e'; } // talking: mouth open
  return g;
}
const GLIM_PAL = { H: P.cream, e: '#1a1208', p: '#fff4d8', m: '#3a1a10', F: ['#6a6a7a', '#a0a0b0', '#d8d8e6', '#f4f4ff', '#ffffff'], C: P.teal, c: '#7ad0b8', J: P.glass, j: '#ffd86a', k: '#fff6c0', L: P.brass, g: '#fff3a0', t: '#4a2a16', h: '#c8aa7a', a: '#8a7050', l: '#2a2018' };
const GLIM = [0, 1, 2].map(f => bake(GLIM_PAL, glimRows(f)));
const GLIM_PORTRAIT = (() => { const g = glimRows(2).slice(0, 13).map(r => r.slice(7, 20)); return bake(GLIM_PAL, g); })();

// Shellby: a snail who runs a shop out of her shell (Mushroom Market, locked for now)
function shellbyRows(f) {
  const g = pg(30, 22);
  ell(g, 12.5, 9.5, 9.5, 9, 'S');
  for (let t = 0; t < 2.6 * TAU; t += .05) { const rr = 8.5 - t * .5; if (rr < 1) break; put(g, Math.round(12.5 + Math.cos(t) * rr), Math.round(9.5 + Math.sin(t) * rr * .95), 'd'); }
  rect(g, 9, 11, 13, 17, 'W'); rect(g, 10, 12, 12, 16, 'w'); put(g, 12, 14, 'k'); // a little door
  rect(g, 15, 5, 17, 7, 'y'); // lit window
  ell(g, 15, 19.5, 15, 2.6, 'B'); rect(g, 22, 13, 27, 19, 'B'); ell(g, 25, 13.5, 3.5, 3, 'B');
  line(g, 24, 11, 23, f ? 3 : 4, 'b'); line(g, 27, 11, 28, f ? 4 : 3, 'b'); put(g, 23, f ? 2 : 3, 'e'); put(g, 28, f ? 3 : 2, 'e');
  put(g, 26, 15, 'm'); put(g, 27, 15, 'm');
  rect(g, 5, 0, 19, 0, 'A'); for (let x = 5; x <= 19; x++) if (x % 3 === 0) put(g, x, 1, 'A'); // awning over the shell
  return g;
}
const SHELLBY_PAL = { S: ['#3a2410', '#6a4420', '#a8703a', '#d8a060', '#ffd8a0'], d: '#4a2c12', W: P.wood, w: '#2a160c', k: '#ffd27a', y: '#ffd86a', B: ['#2a3a24', '#4a6a3a', '#7a9a5a', '#a8c47a', '#d8eaa8'], b: '#4a6a3a', e: '#1a1208', m: '#2a3a24', A: ['#3a1a10', '#8a3a1a', '#c86a30', '#f0a050', '#ffd090'] };
const SHELLBY = [0, 1].map(f => bake(SHELLBY_PAL, shellbyRows(f)));

// the fireflies that trail behind you, and a lost one waiting to be rescued
const FIREFLY = [0, 1].map(f => bake({ G: ['#8a6a10', '#d8a820', '#ffe066', '#fff3a0', '#ffffe0'], w: WING, b: '#3d2f5a' }, f ? ['.w.w.', 'bGGG.', '.GGG.'] : ['ww.ww', 'bGGG.', '.GGG.'], '#1a1208'));
const STRAY = [0, 1].map(f => px(9, 9, (c, dot) => { const pts = f ? [[4, 0], [0, 4], [8, 4], [4, 8]] : [[1, 1], [7, 1], [1, 7], [7, 7]]; for (const [x, y] of pts) dot(x, y, 'rgba(255,233,160,.7)'); c.drawImage(FIREFLY[f], 2, 2); }));
