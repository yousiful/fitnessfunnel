import type { Member } from './model';

const TOKEN_KEY = 'ihc-app-token';
const CACHE_KEY = 'ihc-app-member';
const PENDING_KEY = 'ihc-app-pending';

const safe = <T,>(fn: () => T, fallback: T): T => { try { return fn(); } catch { return fallback; } };

export const getToken = () => safe(() => localStorage.getItem(TOKEN_KEY), null);
export const setToken = (t: string | null) => safe(() => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)), undefined);

export const readCache = (): Member | null => safe(() => JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'), null);
export const writeCache = (m: Member | null) => safe(() => (m ? localStorage.setItem(CACHE_KEY, JSON.stringify(m)) : localStorage.removeItem(CACHE_KEY)), undefined);
export const hasPending = () => safe(() => localStorage.getItem(PENDING_KEY) === '1', false);
export const setPending = (on: boolean) => safe(() => (on ? localStorage.setItem(PENDING_KEY, '1') : localStorage.removeItem(PENDING_KEY)), undefined);

export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`/.netlify/functions/${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init.headers || {}) },
    });
  } catch {
    throw new ApiError("You're offline. We'll keep trying.", 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error || 'Something went wrong. Please try again.', res.status);
  return body as T;
}

const DEVICE_KEY = 'ihc-app-device';
const USE_KEY = 'ihc-app-seconds';

/** A random id for this phone/browser, created on first open. */
export function deviceId(): string {
  let id = safe(() => localStorage.getItem(DEVICE_KEY), null);
  if (!id) {
    id = (crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
    safe(() => localStorage.setItem(DEVICE_KEY, id!), undefined);
  }
  return id;
}

/** Seconds the app has been open on screen on this device, across visits. */
export const usedSeconds = () => safe(() => Number(localStorage.getItem(USE_KEY)) || 0, 0);
export const addUsedSeconds = (n: number) => safe(() => localStorage.setItem(USE_KEY, String(usedSeconds() + n)), undefined);

export const startDevice = () =>
  call<{ token: string }>('app-device', { method: 'POST', body: JSON.stringify({ deviceId: deviceId() }) });

export type ContactInfo = { firstName: string; email: string; phone: string };
export const saveContact = (c: ContactInfo) =>
  call<{ contact: NonNullable<Member['contact']> }>('app-contact', { method: 'POST', body: JSON.stringify(c) });

export const fetchMember = () => call<{ member: Member; email: string }>('app-state');

export const saveMember = (m: Member) =>
  call<{ member: Member; reached: { key: string; label: string }[] }>('app-state', {
    method: 'PUT',
    body: JSON.stringify({ profile: m.profile, workouts: m.workouts, weights: m.weights }),
  });
