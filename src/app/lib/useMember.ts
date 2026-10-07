import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, fetchMember, getToken, hasPending, readCache, saveMember, setPending, setToken, startDevice, writeCache } from './api';
import { emptyMember, type Member } from './model';
import { demoMember, isDemo } from './demo';

export type Status = 'loading' | 'ready';

/**
 * The member record, saved on the phone first so the app works offline and feels instant,
 * then synced to the club. Newly reached milestones come back from the server.
 */
export function useMember() {
  const demo = isDemo();
  const [status, setStatus] = useState<Status>(demo ? 'ready' : 'loading');
  const [member, setMember] = useState<Member>(() => (demo ? demoMember() : readCache() || emptyMember()));
  const [email, setEmail] = useState(demo ? 'preview@theinternethealthclub.com' : '');
  const [celebrate, setCelebrate] = useState<{ key: string; label: string }[]>([]);
  const saving = useRef<Promise<void> | null>(null);
  const latest = useRef(member);
  latest.current = member;

  // The token can go bad (e.g. the server secret changes): get a fresh one for this device.
  // The device id stays the same, so the member's record comes back with it.
  const reconnect = useRef<() => void>(() => {});
  const retried = useRef(false);
  const signOut = useCallback(() => {
    setToken(null);
    if (retried.current) { setStatus('ready'); return; } // don't loop if the server keeps refusing
    retried.current = true; reconnect.current();
  }, []);

  const push = useCallback(async () => {
    if (saving.current) return saving.current;
    saving.current = (async () => {
      try {
        const res = await saveMember(latest.current);
        setPending(false);
        // Keep anything recorded while the request was in flight.
        setMember((cur) => {
          const merged = { ...res.member, profile: cur.profile, workouts: cur.workouts, weights: cur.weights, contact: res.member.contact || cur.contact };
          writeCache(merged);
          return merged;
        });
        if (res.reached.length) setCelebrate(res.reached);
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) signOut();
      } finally {
        saving.current = null;
      }
    })();
    return saving.current;
  }, [signOut]);

  const load = useCallback(async () => {
    try {
      const res = await fetchMember();
      setEmail(res.email);
      if (hasPending()) {
        // Offline changes win; send them up.
        setStatus('ready');
        await push();
      } else {
        setMember(res.member); writeCache(res.member); setStatus('ready');
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return signOut();
      if (readCache()) setStatus('ready'); // offline: run from the phone's copy
      else setStatus('ready');
    }
  }, [push, signOut]);

  const connect = useCallback(async () => {
    if (!getToken()) {
      try { setToken((await startDevice()).token); }
      catch { setStatus('ready'); return; } // offline on first open: run locally, sync later
    }
    load();
  }, [load]);
  reconnect.current = connect;

  useEffect(() => { if (!demo) connect(); }, [connect, demo]);

  useEffect(() => {
    const online = () => { if (hasPending()) push(); };
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, [push]);

  const update = useCallback((fn: (m: Member) => Member) => {
    if (demo) { setMember((cur) => fn(cur)); return; } // preview: memory only
    setMember((cur) => {
      const next = fn(cur);
      latest.current = next;
      writeCache(next);
      setPending(true);
      return next;
    });
    queueMicrotask(() => push());
  }, [push, demo]);

  /** After the member shares their details: show them right away; the server already has them. */
  const linked = useCallback((contact: NonNullable<Member['contact']>) => {
    setEmail(contact.email);
    setMember((cur) => { const next = { ...cur, contact }; writeCache(next); return next; });
  }, []);

  return { demo, status, member, email, update, linked, celebrate, clearCelebrate: () => setCelebrate([]) };
}
