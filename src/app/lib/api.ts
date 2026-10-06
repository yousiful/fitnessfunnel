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

export const startSignIn = (email: string) =>
  call<{ ok: true; devCode?: string }>('app-auth-start', { method: 'POST', body: JSON.stringify({ email }) });

export const verifyCode = (email: string, code: string) =>
  call<{ token: string; firstName: string }>('app-auth-verify', { method: 'POST', body: JSON.stringify({ email, code }) });

export const fetchMember = () => call<{ member: Member; email: string }>('app-state');

export const saveMember = (m: Member) =>
  call<{ member: Member; reached: { key: string; label: string }[] }>('app-state', {
    method: 'PUT',
    body: JSON.stringify({ profile: m.profile, workouts: m.workouts, weights: m.weights }),
  });
