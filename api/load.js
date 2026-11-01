'use strict';
// POST /api/load  { code }  ->  { ok, t, data }
const c = require('../lib/cloud');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return c.send(res, 405, { error: 'method' });
  if (!c.configured()) return c.send(res, 503, { error: 'not_configured' });
  try {
    if (!(await c.rateLimit(req, 'load', 15))) return c.send(res, 429, { error: 'slow_down' });
    const code = String((c.readBody(req)).code || '');
    if (!c.CODE_RE.test(code)) return c.send(res, 400, { error: 'bad_code' });
    const raw = await c.redis(['GET', c.keyFor(code)]);
    if (!raw) return c.send(res, 404, { error: 'unknown_code' });
    const rec = JSON.parse(raw);
    return c.send(res, 200, { ok: true, t: rec.t, data: rec.data });
  } catch (e) {
    return c.send(res, 500, { error: 'server' });
  }
};
