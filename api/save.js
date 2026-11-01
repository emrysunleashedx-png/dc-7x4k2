'use strict';
// POST /api/save  { code, data, create?, force? }
const c = require('../lib/cloud');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return c.send(res, 405, { error: 'method' });
  if (!c.configured()) return c.send(res, 503, { error: 'not_configured' });
  try {
    if (!(await c.rateLimit(req, 'save', 60))) return c.send(res, 429, { error: 'slow_down' });
    const body = c.readBody(req);
    const code = String(body.code || '');
    if (!c.CODE_RE.test(code)) return c.send(res, 400, { error: 'bad_code' });
    let level;
    try { level = c.checkData(body.data); } catch (e) { return c.send(res, 400, { error: 'bad_data' }); }

    const key = c.keyFor(code);
    const record = JSON.stringify({ t: Date.now(), level: level, data: body.data });

    if (body.create) {                                    // first save for a brand-new code: never overwrite
      const ok = await c.redis(['SET', key, record, 'NX', 'EX', c.TTL_SECONDS]);
      if (ok !== 'OK') return c.send(res, 409, { error: 'exists' });
      return c.send(res, 200, { ok: true, t: Date.now() });
    }
    const existing = await c.redis(['GET', key]);
    if (!existing) return c.send(res, 404, { error: 'unknown_code' });
    if (!body.force) {                                    // never replace a newer save with an older one
      let cur = null; try { cur = JSON.parse(existing); } catch (e) {}
      if (cur && cur.level > level) return c.send(res, 409, { error: 'older', cloud: { level: cur.level, t: cur.t } });
    }
    await c.redis(['SET', key, record, 'EX', c.TTL_SECONDS]);
    return c.send(res, 200, { ok: true, t: Date.now() });
  } catch (e) {
    return c.send(res, 500, { error: 'server' });
  }
};
