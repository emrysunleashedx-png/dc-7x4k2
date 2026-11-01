'use strict';
// GET /api/ping  ->  tells the game (and you) whether cloud save is set up.
const c = require('../lib/cloud');
module.exports = async (req, res) => {
  const envSeen = Object.keys(process.env).filter(k => /KV|REDIS|UPSTASH/i.test(k)).sort();   // names only, never values
  c.send(res, 200, { ok: true, configured: c.configured(), envSeen: envSeen });
};
