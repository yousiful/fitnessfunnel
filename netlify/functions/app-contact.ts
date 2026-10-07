import type { Handler } from '@netlify/functions';
import { clientIp, json, normEmail, parseBody, readSession, recordMilestones, store, upsertContact, validEmail } from '../lib/app-lib';
import type { Member } from '../../src/app/lib/model';

// POST { firstName, email, phone } -> saves the member's details and links them to a GHL contact,
// so their progress shows up for the coaching team.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const session = readSession(event);
  if (!session) return json(401, { error: 'Please reopen the app.' });

  const body = parseBody<{ firstName?: string; email?: string; phone?: string }>(event);
  const firstName = String(body?.firstName || '').trim().slice(0, 60);
  const email = normEmail(body?.email);
  const phone = String(body?.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  if (!firstName) return json(400, { error: 'Add your first name.' });
  if (!validEmail(email)) return json(400, { error: 'Please enter a valid email address.' });
  if (phone && phone.replace(/\D/g, '').length < 10) return json(400, { error: 'That phone number looks short.' });

  const db = store(event);
  const key = `member/${session.cid}`;
  const current = (await db.get(key, { type: 'json' })) as (Member & { device?: { ip?: string } }) | null;
  if (!current) return json(404, { error: 'Please reopen the app.' });

  let ghlId: string;
  try {
    ghlId = await upsertContact({ email, firstName, phone });
  } catch (e) {
    console.error(e);
    return json(502, { error: "We couldn't reach the club right now. Please try again in a moment." });
  }

  const first = !current.contact;
  const next = { ...current, contact: { ghlId, firstName, email, phone } };
  await db.setJSON(key, next);

  if (first) {
    const done = current.workouts.length;
    try {
      await recordMilestones(ghlId, [{
        tag: 'ihc app: joined',
        note: `Joined the Health Club app (device IP ${current.device?.ip || clientIp(event) || 'unknown'}). ${done} workout${done === 1 ? '' : 's'} logged so far.`,
      }]);
    } catch (e) { console.error(e); }
  }
  return json(200, { contact: next.contact });
};
