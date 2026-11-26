// Counts how many different players have opened the game.
// There are no accounts, so a "player" is one browser: the game makes a random id the first time it runs,
// keeps it in localStorage and posts it here once. Nothing else about the player is sent or stored.
//
// Storage is a Redis database from the Vercel Marketplace (Upstash, free tier). Connecting one to the
// project sets KV_REST_API_URL and KV_REST_API_TOKEN (or the UPSTASH_REDIS_REST_* pair), which is all this needs.
//
// To see the count, open /api/players?key=<STATS_KEY> on the live site, where STATS_KEY is an
// environment variable you pick in Vercel. Without STATS_KEY set, the count stays private (403).
const hits = new Map(), WINDOW = 10 * 60 * 1000, PER_IP = 6;
function limited(ip) {
  const now = Date.now(), mine = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  if (mine.length >= PER_IP) return true;
  mine.push(now); hits.set(ip, mine); return false;
}
const sameSite = req => { try { return new URL(req.headers.origin).host === req.headers.host; } catch (e) { return false; } };
const day = d => d.toISOString().slice(0, 10);

async function redis(cmds) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const r = await fetch(url.replace(/\/$/, '') + '/pipeline', {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds),
  }).catch(() => null);
  if (!r || !r.ok) return null;
  return (await r.json()).map(x => x.result);
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const key = process.env.STATS_KEY;
    if (!key || req.query.key !== key) return res.status(403).json({ error: 'Not for you' });
    const days = [...Array(14)].map((_, i) => day(new Date(Date.now() - i * 864e5)));
    const out = await redis([['SCARD', 'players'], ...days.map(d => ['GET', 'players:new:' + d])]);
    if (!out) return res.status(503).json({ error: 'Player count is not set up yet' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ players: out[0] || 0, newByDay: Object.fromEntries(days.map((d, i) => [d, Number(out[i + 1]) || 0])) });
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'GET or POST only' }); }
  if (!sameSite(req)) return res.status(403).json({ error: 'Not from the game' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Slow down a little' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  const id = b && typeof b.id === 'string' ? b.id : '';
  if (!/^[a-z0-9]{16,40}$/.test(id)) return res.status(400).json({ error: 'Bad id' });
  const added = await redis([['SADD', 'players', id]]);
  if (!added) return res.status(503).json({ error: 'Player count is not set up yet' });
  if (added[0] === 1) await redis([['INCR', 'players:new:' + day(new Date())], ['EXPIRE', 'players:new:' + day(new Date()), 400 * 86400]]);
  return res.status(200).json({ ok: true });
};
