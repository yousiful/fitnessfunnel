import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, fetchMember, getToken, hasPending, readCache, saveMember, setPending, setToken, writeCache } from './api';
import { emptyMember, type Member } from './model';

export type Status = 'signed-out' | 'loading' | 'ready';

/**
 * The member record, saved on the phone first so the app works offline and feels instant,
 * then synced to the club. Newly reached milestones come back from the server.
 */
export function useMember() {
  const [status, setStatus] = useState<Status>(getToken() ? 'loading' : 'signed-out');
  const [member, setMember] = useState<Member>(() => readCache() || emptyMember());
  const [email, setEmail] = useState('');
  const [celebrate, setCelebrate] = useState<{ key: string; label: string }[]>([]);
  const saving = useRef<Promise<void> | null>(null);
  const latest = useRef(member);
  latest.current = member;

  const signOut = useCallback(() => {
    setToken(null); writeCache(null); setPending(false);
    setMember(emptyMember()); setStatus('signed-out');
  }, []);

  const push = useCallback(async () => {
    if (saving.current) return saving.current;
    saving.current = (async () => {
      try {
        const res = await saveMember(latest.current);
        setPending(false);
        // Keep anything recorded while the request was in flight.
        setMember((cur) => {
          const merged = { ...res.member, profile: cur.profile, workouts: cur.workouts, weights: cur.weights };
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

  useEffect(() => { if (getToken()) load(); }, [load]);

  useEffect(() => {
    const online = () => { if (hasPending()) push(); };
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, [push]);

  const update = useCallback((fn: (m: Member) => Member) => {
    setMember((cur) => {
      const next = fn(cur);
      latest.current = next;
      writeCache(next);
      setPending(true);
      return next;
    });
    queueMicrotask(() => push());
  }, [push]);

  const signedIn = useCallback((token: string) => {
    setToken(token); setStatus('loading'); load();
  }, [load]);

  return { status, member, email, update, signOut, signedIn, celebrate, clearCelebrate: () => setCelebrate([]) };
}
