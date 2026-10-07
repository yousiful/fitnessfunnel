import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { saveContact, type ContactInfo } from '../lib/api';
import type { Member } from '../lib/model';

/** Asked once someone has used the app for a few minutes: who they are, so the club can cheer them on. */
export function ContactSheet({ initialName, onClose, onSaved }: {
  initialName: string; onClose: () => void; onSaved: (c: NonNullable<Member['contact']>) => void;
}) {
  const [info, setInfo] = useState<ContactInfo>({ firstName: initialName, email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const set = (k: keyof ContactInfo) => (e: React.ChangeEvent<HTMLInputElement>) => setInfo((i) => ({ ...i, [k]: e.target.value }));

  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try { onSaved((await saveContact(info)).contact); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Save your progress">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form ref={ref} tabIndex={-1} onSubmit={submit} className="rise-in relative w-full max-w-xl rounded-t-[28px] px-6 pt-6 pb-[max(28px,env(safe-area-inset-bottom))]" style={{ background: 'var(--ground-2)' }}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="display text-[26px] leading-tight font-extrabold">Want your coach to see your progress?</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 -mr-2"><X aria-hidden="true" /></button>
        </div>
        <p className="mt-2 text-[17px]" style={{ color: 'var(--muted)' }}>Leave your details and the club can check in and celebrate your wins with you.</p>

        <label htmlFor="c-name" className="block mt-6 mb-2 font-semibold">First name</label>
        <input id="c-name" className="field" autoComplete="given-name" required value={info.firstName} onChange={set('firstName')} />
        <label htmlFor="c-email" className="block mt-4 mb-2 font-semibold">Email</label>
        <input id="c-email" className="field" type="email" inputMode="email" autoComplete="email" required placeholder="you@example.com" value={info.email} onChange={set('email')} />
        <label htmlFor="c-phone" className="block mt-4 mb-2 font-semibold">Phone <span style={{ color: 'var(--muted)' }}>(optional)</span></label>
        <input id="c-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" value={info.phone} onChange={set('phone')} />

        {error && <p role="alert" className="mt-3 font-semibold" style={{ color: '#FF9C86' }}>{error}</p>}
        <button className="btn btn-sun w-full mt-6" disabled={busy || !info.firstName.trim() || !info.email}>{busy ? 'Saving...' : 'Save my progress'}</button>
        <button type="button" className="btn btn-ghost w-full mt-3" onClick={onClose}>Maybe later</button>
      </form>
    </div>
  );
}
