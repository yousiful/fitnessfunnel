import type { Handler } from '@netlify/functions';
import { hashCode, hashKey, json, normEmail, parseBody, recordMilestones, signSession, store } from '../lib/app-lib';

// POST { email, code } -> { token, firstName } when the code matches.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody<{ email?: string; code?: string }>(event);
  const email = normEmail(body?.email);
  const code = String(body?.code || '').replace(/\D/g, '');
  if (!email || code.length !== 6) return json(400, { error: 'Enter the 6-digit code from your email.' });

  const db = store(event);
  const key = `otp/${hashKey(email)}`;
  const rec = (await db.get(key, { type: 'json' })) as
    | { hash: string; cid: string; isNew: boolean; firstName: string; expires: number; tries: number }
    | null;
  if (!rec || rec.expires < Date.now()) return json(400, { error: 'That code expired. Send yourself a new one.' });
  if (rec.tries >= 5) return json(429, { error: 'Too many tries. Send yourself a new code.' });

  if (hashCode(email, code) !== rec.hash) {
    await db.setJSON(key, { ...rec, tries: rec.tries + 1 });
    return json(400, { error: "That code doesn't match. Check the email and try again." });
  }
  await db.delete(key);

  // First time this contact opens the app: tag them so the coaching team knows.
  const memberKey = `member/${rec.cid}`;
  const existing = await db.get(memberKey, { type: 'json' });
  if (!existing) {
    await db.setJSON(memberKey, { profile: null, workouts: [], weights: [], milestones: { joined: new Date().toISOString() } });
    try {
      await recordMilestones(rec.cid, [{ tag: 'ihc app: joined', note: `Signed in to the Health Club app for the first time (${email}).` }]);
    } catch (e) { console.error(e); }
  }

  return json(200, { token: signSession(rec.cid, email), firstName: rec.firstName });
};
