import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';
import type { HandlerEvent } from '@netlify/functions';

// Shared helpers for the Health Club member app (/app).
// Env: GHL_PIT + GHL_LOCATION_ID (The Internet Health Club location), APP_SESSION_SECRET.
// APP_DEV=1 (local `netlify dev` only) skips every GHL call and returns the login code in the response.

const GHL = 'https://services.leadconnectorhq.com';
export const DEV = process.env.APP_DEV === '1';

export function store(event: HandlerEvent) {
  connectLambda(event as any);
  return getStore('ihc-app');
}

export const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  body: JSON.stringify(body),
});

export function parseBody<T>(event: HandlerEvent): T | null {
  try { return JSON.parse(event.body || '{}') as T; } catch { return null; }
}

export const normEmail = (e: unknown) => (typeof e === 'string' ? e.trim().toLowerCase() : '');
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;

function secret() {
  const s = process.env.APP_SESSION_SECRET;
  if (!s && !DEV) throw new Error('APP_SESSION_SECRET is not set');
  return s || 'dev-only-secret';
}

export const hashKey = (v: string) => createHash('sha256').update(v).digest('hex').slice(0, 40);
export const hashCode = (email: string, code: string) => createHmac('sha256', secret()).update(`${email}:${code}`).digest('hex');

const b64url = (s: string) => Buffer.from(s).toString('base64url');

export interface Session { cid: string; email: string; exp: number }

export function signSession(cid: string, email: string, days = 60): string {
  const payload = b64url(JSON.stringify({ cid, email, exp: Date.now() + days * 864e5 }));
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function readSession(event: HandlerEvent): Session | null {
  const auth = event.headers.authorization || event.headers.Authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    return s.exp > Date.now() ? s : null;
  } catch { return null; }
}

async function ghl(path: string, init: RequestInit = {}) {
  const res = await fetch(GHL + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GHL_PIT}`,
      Version: '2021-07-28',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw new Error(`GHL ${init.method || 'GET'} ${path} -> ${res.status} ${text.slice(0, 200)}`);
  return body;
}

/** Find the member's existing GHL contact by email, or create one tagged as an app sign-up. */
export async function findOrCreateContact(email: string): Promise<{ id: string; firstName?: string; isNew: boolean }> {
  if (DEV) return { id: 'dev-' + hashKey(email).slice(0, 12), isNew: false };
  const loc = process.env.GHL_LOCATION_ID!;
  const found = await ghl(`/contacts/search/duplicate?locationId=${loc}&email=${encodeURIComponent(email)}`);
  if (found?.contact?.id) return { id: found.contact.id, firstName: found.contact.firstName, isNew: false };
  const created = await ghl('/contacts/', {
    method: 'POST',
    body: JSON.stringify({ locationId: loc, email, source: 'Health Club App', tags: ['ihc app: joined'] }),
  });
  return { id: created.contact.id, isNew: true };
}

export async function sendCodeEmail(contactId: string, code: string) {
  if (DEV) return;
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#16123A">
    <p style="font-size:16px;margin:0 0 12px">Here's your sign-in code for the Health Club app:</p>
    <p style="font-size:40px;font-weight:800;letter-spacing:8px;margin:8px 0 16px">${code}</p>
    <p style="font-size:14px;color:#555;margin:0">It works for 10 minutes. If you didn't ask for it, you can ignore this email.</p>
  </div>`;
  await ghl('/conversations/messages', {
    method: 'POST',
    body: JSON.stringify({ type: 'Email', contactId, subject: `${code} is your Health Club sign-in code`, html }),
  });
}

/** Adds tags and a note to the member's contact so the coaching team sees app milestones. */
export async function recordMilestones(contactId: string, items: { tag: string; note: string }[]) {
  if (!items.length) return;
  if (DEV) { console.log('[dev] milestones', contactId, items.map((i) => i.tag)); return; }
  await ghl(`/contacts/${contactId}/tags`, { method: 'POST', body: JSON.stringify({ tags: items.map((i) => i.tag) }) });
  await ghl(`/contacts/${contactId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body: 'Health Club app:\n' + items.map((i) => `- ${i.note}`).join('\n') }),
  });
}
