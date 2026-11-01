'use strict';
// Shared helpers for the cloud-save API (runs on Vercel as serverless functions).
// Storage: Upstash Redis through its REST API. No npm packages needed.
const crypto = require('crypto');

const redisUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const redisToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const configured = () => !!(redisUrl() && redisToken());

async function redis(cmd) {
  const r = await fetch(redisUrl(), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + redisToken(), 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || ('redis ' + r.status));
  return j.result;
}

// Recovery code: 12 characters from a 32-letter alphabet (no I, L, O, U) = 60 bits.
const CODE_RE = /^[0-9A-HJKMNP-TV-Z]{12}$/;
const keyFor = (code) => 'dc:save:' + crypto.createHash('sha256').update(code).digest('hex');   // the code itself is never stored
const TTL_SECONDS = 60 * 60 * 24 * 365 * 3;                                                       // refreshed on every save

function clientIp(req) {
  const f = (req.headers && req.headers['x-forwarded-for']) || '';
  return String(f).split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'unknown';
}
// simple per-IP limit per minute (stops anyone from guessing codes)
async function rateLimit(req, action, max) {
  const bucket = Math.floor(Date.now() / 60000);
  const k = 'dc:rl:' + action + ':' + clientIp(req) + ':' + bucket;
  const n = await redis(['INCR', k]);
  if (n === 1) await redis(['EXPIRE', k, 120]);
  return n <= max;
}
function send(res, status, obj) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(obj);
}
function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}
// returns the level number, or throws if the save looks wrong
function checkData(data) {
  if (!data || typeof data !== 'object' || !data.progress || typeof data.progress !== 'object') throw new Error('bad data');
  const level = Math.floor(Number(data.progress.highestUnlocked));
  if (!(level >= 1 && level <= 5000)) throw new Error('bad level');
  if (JSON.stringify(data).length > 100000) throw new Error('too big');
  return level;
}

module.exports = { configured, redis, CODE_RE, keyFor, TTL_SECONDS, rateLimit, send, readBody, checkData, redisUrl, redisToken };
