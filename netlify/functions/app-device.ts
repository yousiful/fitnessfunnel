import type { Handler } from '@netlify/functions';
import { clientIp, hashKey, json, parseBody, signSession, store } from '../lib/app-lib';
import { emptyMember } from '../../src/app/lib/model';

// POST { deviceId } -> { token }. No sign-in: each phone/browser gets its own member record,
// keyed by a random id the app keeps in local storage. The IP is recorded with it for the club's records.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const deviceId = String(parseBody<{ deviceId?: string }>(event)?.deviceId || '');
  if (!/^[a-z0-9-]{16,64}$/i.test(deviceId)) return json(400, { error: 'Bad device id' });

  const db = store(event);
  const ip = clientIp(event);
  const cid = 'd_' + hashKey(deviceId).slice(0, 24);
  const key = `member/${cid}`;
  if (!(await db.get(key, { type: 'json' }))) {
    // Light guard against scripted sign-ups: at most 30 new devices per IP per day.
    const day = new Date().toISOString().slice(0, 10);
    const rateKey = `rate/${hashKey(ip + day)}`;
    const n = Number(await db.get(rateKey)) || 0;
    if (n >= 30) return json(429, { error: 'Too many new sign-ups from this network today.' });
    await db.set(rateKey, String(n + 1));
    await db.setJSON(key, { ...emptyMember(), device: { ip, firstSeen: new Date().toISOString(), userAgent: String(event.headers['user-agent'] || '').slice(0, 200) } });
  }
  return json(200, { token: signSession(cid, '') });
};
