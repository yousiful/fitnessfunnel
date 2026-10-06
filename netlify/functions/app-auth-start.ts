import { randomInt } from 'node:crypto';
import type { Handler } from '@netlify/functions';
import { DEV, findOrCreateContact, hashCode, hashKey, json, normEmail, parseBody, sendCodeEmail, store, validEmail } from '../lib/app-lib';

// POST { email } -> emails a 6-digit sign-in code through the club's GHL location.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody<{ email?: string }>(event);
  const email = normEmail(body?.email);
  if (!validEmail(email)) return json(400, { error: 'Please enter a valid email address.' });

  const db = store(event);
  const key = `otp/${hashKey(email)}`;
  const prev = (await db.get(key, { type: 'json' })) as { sentAt: number } | null;
  if (prev && Date.now() - prev.sentAt < 45_000) {
    return json(429, { error: 'We just sent a code. Give it a minute, then try again.' });
  }

  let contact;
  try {
    contact = await findOrCreateContact(email);
  } catch (e) {
    console.error(e);
    return json(502, { error: "We couldn't reach the club right now. Please try again in a moment." });
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await db.setJSON(key, { hash: hashCode(email, code), cid: contact.id, isNew: contact.isNew, firstName: contact.firstName || '', sentAt: Date.now(), expires: Date.now() + 10 * 60_000, tries: 0 });

  try {
    await sendCodeEmail(contact.id, code);
  } catch (e) {
    console.error(e);
    return json(502, { error: "We couldn't send the email. Please try again in a moment." });
  }

  return json(200, { ok: true, ...(DEV ? { devCode: code } : {}) });
};
