// Forwards in-game feedback (the "Tell the maker something" option when you talk to Glim) to a private Discord channel.
// Set DISCORD_WEBHOOK_URL in the Vercel project's environment variables. The URL never reaches the browser.
// Light abuse protection: only the game's own page may post, and each address gets a few messages per ten minutes.
// The counts live in this server instance's memory, so they're a speed bump rather than a wall.
const hits = new Map(), WINDOW = 10 * 60 * 1000, PER_IP = 4, PER_INSTANCE = 60;
let instanceHits = [];
function limited(ip) {
  const now = Date.now(); instanceHits = instanceHits.filter(t => now - t < WINDOW);
  const mine = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (mine.length >= PER_IP || instanceHits.length >= PER_INSTANCE) return true;
  mine.push(now); hits.set(ip, mine); instanceHits.push(now); return false;
}
const sameSite = req => { try { return new URL(req.headers.origin).host === req.headers.host; } catch (e) { return false; } };
const clip = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'POST only' }); }
  if (!sameSite(req)) return res.status(403).json({ error: 'Not from the game' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Slow down a little' });
  const hook = process.env.DISCORD_WEBHOOK_URL;
  if (!hook) return res.status(503).json({ error: 'Feedback is not set up yet' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  const msg = b && typeof b.msg === 'string' ? b.msg.trim() : '';
  if (msg.length < 3 || msg.length > 1000) return res.status(400).json({ error: 'Message must be 3 to 1000 characters' });
  const who = clip(b.name, 16) || 'someone without a name';
  const meta = 'Bug: ' + clip(b.bug, 12) + ' · runs: ' + (Number(b.runs) | 0) + ' · best: ' + (Number(b.best) | 0) + (b.won ? ' · has seen the dawn' : '');
  const r = await fetch(hook, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Glim', // posts as Glim, with his portrait, whatever the webhook itself is called
      avatar_url: 'https://firefliers.vercel.app/icons/glim-avatar.png',
      allowed_mentions: { parse: [] }, // nobody can @everyone through this
      embeds: [{ title: 'Feedback from ' + who, description: msg, color: 0xf2c14e, footer: { text: meta }, timestamp: new Date().toISOString() }],
    }),
  }).catch(() => null);
  if (!r || !r.ok) return res.status(502).json({ error: 'Could not reach Discord' });
  return res.status(200).json({ ok: true });
};
