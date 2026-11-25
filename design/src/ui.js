// ---------- UI kit: pixel 9-slice pieces, turned into data URIs and used by real HTML controls ----------
const U = 3; // one art pixel = 3 CSS pixels
const uri = cv => cv.toDataURL();
// a framed slab: outline, inner bevel, and optional corner brackets in an accent colour
function frame(w, h, o) {
  return px(w, h, (c, dot, box) => {
    box(0, 0, w, h, o.outline); box(1, 1, w - 2, h - 2, o.fill);
    if (o.hi) { box(1, 1, w - 2, 1, o.hi); box(1, 1, 1, h - 2, o.hi); } if (o.lo) { box(1, h - 2, w - 2, 1, o.lo); box(w - 2, 1, 1, h - 2, o.lo); }
    if (o.bevel) box(1, h - 1 - o.bevel, w - 2, o.bevel, o.lo);
    if (o.corner) for (const [x, y, sx, sy] of [[1, 1, 1, 1], [w - 2, 1, -1, 1], [1, h - 2, 1, -1], [w - 2, h - 2, -1, -1]]) { dot(x, y, o.corner); dot(x + sx, y, o.corner); dot(x + 2 * sx, y, o.corner); dot(x, y + sy, o.corner); dot(x, y + 2 * sy, o.corner); }
    if (o.notch) { dot(0, 0, 'rgba(0,0,0,0)'); c.clearRect(0, 0, 1, 1); c.clearRect(w - 1, 0, 1, 1); c.clearRect(0, h - 1, 1, 1); c.clearRect(w - 1, h - 1, 1, 1); }
  });
}
const KIT = {
  panel: frame(12, 12, { outline: '#030405', fill: '#10161a', hi: '#263030', lo: '#070a0b', corner: '#d8d2c2' }),
  panelGold: frame(12, 12, { outline: '#030405', fill: '#141410', hi: '#3a3220', lo: '#070605', corner: '#f2c14e' }),
  // buttons: 10x10, 3px slices; the bottom bevel moves to the top when pressed
  btn: frame(10, 10, { outline: '#1d1404', fill: '#f0b848', hi: '#fff3c8', lo: '#b4741c', bevel: 2, notch: 1 }),
  btnHover: frame(10, 10, { outline: '#1d1404', fill: '#ffcc60', hi: '#ffffff', lo: '#c8862a', bevel: 2, notch: 1 }),
  btnDown: frame(10, 10, { outline: '#1d1404', fill: '#d89a30', hi: '#8a5a10', lo: '#d89a30', notch: 1 }),
  btnOff: frame(10, 10, { outline: '#0a0c0d', fill: '#2a2e30', hi: '#3a4042', lo: '#1a1e20', bevel: 2, notch: 1 }),
  stone: frame(10, 10, { outline: '#030405', fill: '#1a2122', hi: '#3a4746', lo: '#0c1011', bevel: 2, notch: 1 }),
  stoneHover: frame(10, 10, { outline: '#030405', fill: '#24302f', hi: '#5a6a68', lo: '#121818', bevel: 2, notch: 1 }),
  stoneDown: frame(10, 10, { outline: '#030405', fill: '#141a1b', hi: '#0c1011', lo: '#141a1b', notch: 1 }),
  danger: frame(10, 10, { outline: '#1a0404', fill: '#c8402f', hi: '#ff9a80', lo: '#7a1a14', bevel: 2, notch: 1 }),
  dangerHover: frame(10, 10, { outline: '#1a0404', fill: '#e05440', hi: '#ffc0a8', lo: '#8a2018', bevel: 2, notch: 1 }),
  mint: frame(10, 10, { outline: '#05201a', fill: '#5cbaa4', hi: '#d0fff2', lo: '#2e7a68', bevel: 2, notch: 1 }),
  tab: frame(10, 10, { outline: '#030405', fill: '#10161a', hi: '#3a4746', lo: '#10161a', notch: 1 }),
  tabOff: frame(10, 10, { outline: '#030405', fill: '#0a0e10', hi: '#1a2122', lo: '#0a0e10', notch: 1 }),
  inset: frame(8, 8, { outline: '#030405', fill: '#06090a', hi: '#020303', lo: '#1e2626' }), // grooves for sliders, bars and inputs
  key: frame(9, 10, { outline: '#030405', fill: '#d8d2c2', hi: '#ffffff', lo: '#8d9491', bevel: 2, notch: 1 }),
  bossBar: frame(10, 8, { outline: '#030405', fill: '#06090a', hi: '#020303', lo: '#1e2626', corner: '#d8d2c2' }),
  tip: frame(8, 8, { outline: '#030405', fill: '#1a1a14', hi: '#3a3220', lo: '#0a0a08' }),
  toast: frame(12, 10, { outline: '#030405', fill: '#141410', hi: '#3a3220', lo: '#070605', corner: '#f2c14e' }),
};
// small single images
const IMG = {
  knob: bake({ L: P.brass, g: '#fff3a0', k: '#3a2208' }, ['.LLL.', 'LLLLL', 'LgggL', 'LgggL', 'LgggL', 'LLLLL', '.k.k.']),
  toggleOff: px(22, 12, (c, dot, box) => { c.drawImage(frame(22, 12, { outline: '#030405', fill: '#06090a', hi: '#020303', lo: '#1e2626' }), 0, 0); box(2, 2, 8, 8, '#465150'); box(2, 2, 8, 1, '#8d9491'); box(2, 9, 8, 1, '#283030'); box(14, 5, 4, 2, '#283030'); }),
  toggleOn: px(22, 12, (c, dot, box) => { c.drawImage(frame(22, 12, { outline: '#030405', fill: '#1e4a40', hi: '#123028', lo: '#2e7a68' }), 0, 0); box(12, 2, 8, 8, '#f0b848'); box(12, 2, 8, 1, '#fff3c8'); box(12, 9, 8, 1, '#b4741c'); box(15, 5, 2, 2, '#fff3c8'); box(4, 5, 4, 2, '#7fd6c2'); }),
  boxOff: frame(11, 11, { outline: '#030405', fill: '#06090a', hi: '#020303', lo: '#2a3434' }),
  boxOn: px(11, 11, c => { c.drawImage(frame(11, 11, { outline: '#030405', fill: '#06090a', hi: '#020303', lo: '#2a3434' }), 0, 0); c.drawImage(ICO.check, 1, 1, 9, 9); }),
  radioOff: bake({ o: '#2a3434', i: '#06090a' }, ['..ooooo..', '.oiiiiio.', 'oiiiiiiio', 'oiiiiiiio', 'oiiiiiiio', 'oiiiiiiio', 'oiiiiiiio', '.oiiiiio.', '..ooooo..']),
  radioOn: bake({ o: '#2a3434', i: '#06090a', g: '#f0b848', w: '#fff3c8' }, ['..ooooo..', '.oiiiiio.', 'oiigggiio', 'oiggwggio', 'oigggggio', 'oigggggio', 'oiigggiio', '.oiiiiio.', '..ooooo..']),
  pipOn: bake({ A: P.amber }, ['..A..', '.AAA.', 'AAAAA', '.AAA.', '..A..']),
  pipOff: bake({ o: '#465150', i: '#06090a' }, ['..o..', '.oio.', 'oiiio', '.oio.', '..o..'], '#030405'),
  arrowDown: bake({ w: '#e9e4d6' }, ['wwwww', '.www.', '..w..'], null),
  tipPoint: bake({ f: '#1a1a14' }, ['fffff', '.fff.', '..f..'], '#030405'),
  scrollThumb: frame(6, 10, { outline: '#030405', fill: '#465150', hi: '#8d9491', lo: '#283030' }),
  cursor: bake({ w: '#e9e4d6', g: '#ffe066' }, ['w.......', 'ww......', 'wgw.....', 'wggw....', 'wgggw...', 'wggggw..', 'wgggggw.', 'wggwwww.', 'ww.w....', 'w...w...', '....w...'], '#030405'),
};
// the CSS that turns those images into a working kit
function kitCSS() {
  const b = (img, slice) => 'border-style:solid;border-image:url(' + uri(img) + ') ' + slice + ' fill / ' + (slice * U) + 'px stretch;image-rendering:pixelated;';
  return `
  .k-btn{font:inherit;font-size:20px;font-weight:400;letter-spacing:.06em;text-transform:uppercase;color:#1d1404;padding:6px 18px 9px;${b(KIT.btn, 3)}background:none;cursor:pointer;min-height:42px}
  .k-btn:hover,.k-btn.is-hover{${b(KIT.btnHover, 3)}} .k-btn:active,.k-btn.is-down{${b(KIT.btnDown, 3)}padding:9px 18px 6px}
  .k-btn:disabled,.k-btn.is-off{${b(KIT.btnOff, 3)}color:#5d6563;cursor:not-allowed}
  .k-btn.stone{color:#e9e4d6;${b(KIT.stone, 3)}} .k-btn.stone:hover,.k-btn.stone.is-hover{${b(KIT.stoneHover, 3)}} .k-btn.stone:active,.k-btn.stone.is-down{${b(KIT.stoneDown, 3)}}
  .k-btn.danger{color:#fff0e8;${b(KIT.danger, 3)}} .k-btn.danger:hover,.k-btn.danger.is-hover{${b(KIT.dangerHover, 3)}}
  .k-btn.mint{color:#05201a;${b(KIT.mint, 3)}}
  .k-btn:focus-visible{outline:3px solid #e9e4d6;outline-offset:3px}
  .k-btn.icon{padding:6px 9px 9px;min-width:42px;display:inline-grid;place-items:center}
  .k-panel{${b(KIT.panel, 4)}padding:6px 8px} .k-panel.gold{${b(KIT.panelGold, 4)}}
  .k-inset{${b(KIT.inset, 3)}}
  .k-tabs{display:flex;gap:4px;margin-bottom:-3px;position:relative;z-index:1}
  .k-tab{font:inherit;color:#8d9491;padding:6px 14px 4px;${b(KIT.tabOff, 3)}border-bottom-width:0;background:none;cursor:pointer}
  .k-tab[aria-selected="true"]{color:#e9e4d6;${b(KIT.tab, 3)}border-bottom-width:0}
  .k-key{display:inline-grid;place-items:center;min-width:30px;height:30px;padding:0 6px 3px;font-size:18px;color:#1a1e20;${b(KIT.key, 3)}}
  .k-toggle{appearance:none;width:${22 * U}px;height:${12 * U}px;background:url(${uri(IMG.toggleOff)}) 0 0/100% 100%;image-rendering:pixelated;cursor:pointer;margin:0}
  .k-toggle:checked{background-image:url(${uri(IMG.toggleOn)})} .k-toggle:focus-visible,.k-check:focus-visible,.k-radio:focus-visible{outline:3px solid #e9e4d6;outline-offset:3px}
  .k-check{appearance:none;width:${11 * U}px;height:${11 * U}px;background:url(${uri(IMG.boxOff)}) 0 0/100% 100%;image-rendering:pixelated;cursor:pointer;margin:0}
  .k-check:checked{background-image:url(${uri(IMG.boxOn)})}
  .k-radio{appearance:none;width:${11 * U}px;height:${11 * U}px;background:url(${uri(IMG.radioOff)}) 0 0/100% 100%;image-rendering:pixelated;cursor:pointer;margin:0}
  .k-radio:checked{background-image:url(${uri(IMG.radioOn)})}
  .k-slider{position:relative;height:${13 * U}px;min-width:160px}
  .k-slider .tr{position:absolute;left:0;right:0;top:${4 * U}px;height:${5 * U}px;${b(KIT.inset, 2)}border-width:${2 * U}px}
  .k-slider .fi{position:absolute;left:${U}px;top:${5 * U}px;height:${3 * U}px;background:repeating-linear-gradient(90deg,#f0b848 0 ${3 * U}px,#e09a30 ${3 * U}px ${4 * U}px)}
  .k-slider .kn{position:absolute;top:${2 * U}px;width:${7 * U}px;height:${9 * U}px;margin-left:${-3.5 * U}px;background:url(${uri(IMG.knob)}) 0 0/100% 100%;image-rendering:pixelated;pointer-events:none}
  .k-slider input{position:absolute;inset:0;width:100%;opacity:0;cursor:pointer;margin:0}
  .k-slider:has(input:focus-visible){outline:3px solid #e9e4d6;outline-offset:3px}
  .k-select{appearance:none;font:inherit;color:#e9e4d6;padding:6px 40px 7px 12px;${b(KIT.inset, 3)}background:none;cursor:pointer;width:100%}
  .k-selwrap{position:relative;display:block}.k-selwrap::after{content:"";position:absolute;right:14px;top:50%;width:${5 * U}px;height:${3 * U}px;margin-top:${-1.5 * U}px;background:url(${uri(IMG.arrowDown)}) 0 0/100% 100%;image-rendering:pixelated;pointer-events:none}
  .k-bar.boss{${b(KIT.bossBar, 3)}border-width:${3 * U}px}
  .k-bar{position:relative;height:${8 * U}px;${b(KIT.inset, 3)}border-width:${3 * U}px} .k-bar i{position:absolute;inset:0 auto 0 0;display:block}
  .k-tip{position:relative;display:inline-block;padding:6px 10px 7px;font-size:17px;${b(KIT.tip, 3)}}
  .k-tip::after{content:"";position:absolute;left:50%;bottom:${-6 * U}px;width:${7 * U}px;height:${5 * U}px;margin-left:${-3.5 * U}px;background:url(${uri(IMG.tipPoint)}) 0 0/100% 100%;image-rendering:pixelated}
  .k-toast{display:inline-flex;gap:10px;align-items:center;padding:6px 14px 8px;${b(KIT.toast, 4)}}
  .k-pips{display:inline-flex;gap:3px} .k-pips i{width:${7 * U}px;height:${7 * U}px;background:url(${uri(IMG.pipOff)}) 0 0/100% 100%;image-rendering:pixelated}
  .k-pips i.on{background-image:url(${uri(IMG.pipOn)});background-size:${5 * U}px ${5 * U}px;background-position:${U}px ${U}px;background-repeat:no-repeat}
  .k-scroll{max-height:180px;overflow-y:auto;scrollbar-width:auto}
  .k-scroll::-webkit-scrollbar{width:${6 * U}px} .k-scroll::-webkit-scrollbar-track{background:#06090a}
  .k-scroll::-webkit-scrollbar-thumb{border-style:solid;border-image:url(${uri(IMG.scrollThumb)}) 3 fill / ${3 * U}px stretch;image-rendering:pixelated}
  .k-cursor{cursor:url(${(() => { const c = document.createElement('canvas'); c.width = IMG.cursor.width * 2; c.height = IMG.cursor.height * 2; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(IMG.cursor, 0, 0, c.width, c.height); return c.toDataURL(); })()}) 2 2,auto}
  `;
}
