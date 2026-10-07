import { useEffect, useState } from 'react';
import { ExternalLink, Smartphone, UserRound } from 'lucide-react';
import { todayProgress, type Goal, type Level, type Member, type Profile } from '../lib/model';
import { SkyBand } from '../components/Sky';
import { GOAL_LABEL, LEVEL_LABEL } from '../lib/workouts';

const MEMBERS_PORTAL = 'https://5ijobzm3ovbhqenhpjix.app.clientclub.net/';

export function Me({ member, email, onSave, onShareDetails }: { member: Member; email: string; onSave: (p: Profile) => void; onShareDetails?: () => void }) {
  const p = member.profile!;
  const [draft, setDraft] = useState(p);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const changed = JSON.stringify(draft) !== JSON.stringify(p);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const standalone = typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches;

  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  const segmented = <T extends string>(label: string, options: Record<T, string>, value: T, onPick: (v: T) => void) => (
    <fieldset className="mt-6">
      <legend className="font-semibold mb-2">{label}</legend>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Object.keys(options).length > 3 ? 2 : 3}, minmax(0, 1fr))` }}>
        {(Object.keys(options) as T[]).map((k) => (
          <button key={k} type="button" aria-pressed={value === k} onClick={() => onPick(k)} className="choice !py-3 !px-3 text-center font-bold text-[16px]">{options[k]}</button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <main className="screen">
      <SkyBand progress={todayProgress(member)} title={p.name || 'You'} subtitle={email} />
      <div className="px-5 max-w-xl mx-auto">

      <a href={MEMBERS_PORTAL} target="_blank" rel="noopener noreferrer" className="mt-5 panel px-5 py-4 flex items-center justify-between font-semibold">
        Message your coach and the community <ExternalLink className="w-5 h-5" style={{ color: 'var(--sun)' }} aria-hidden="true" />
      </a>

      {!standalone && (
        <div className="mt-3 panel px-5 py-4">
          <p className="flex items-center gap-3 font-semibold"><Smartphone className="w-5 h-5" style={{ color: 'var(--sun)' }} aria-hidden="true" /> Put the app on your home screen</p>
          {installPrompt ? (
            <button className="btn btn-quiet w-full mt-3" onClick={() => { installPrompt.prompt(); setInstallPrompt(null); }}>Install</button>
          ) : (
            <p className="mt-2 text-[15px]" style={{ color: 'var(--muted)' }}>iPhone: tap Share, then "Add to Home Screen". Android: tap the menu, then "Install app".</p>
          )}
        </div>
      )}

      <section className="mt-8" aria-labelledby="plan">
        <h2 id="plan" className="display text-[24px] font-extrabold">Your plan</h2>
        <label className="block mt-4">
          <span className="block font-semibold mb-2">Name</span>
          <input className="field" value={draft.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        {segmented<Goal>('Goal', GOAL_LABEL, draft.goal, (v) => set('goal', v))}
        {segmented<Level>('Level', LEVEL_LABEL, draft.level, (v) => set('level', v))}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block font-semibold mb-2">Start weight ({draft.unit})</span>
            <input className="field num" inputMode="decimal" value={draft.startWeight ?? ''} onChange={(e) => set('startWeight', e.target.value ? Number(e.target.value.replace(/[^\d.]/g, '')) : null)} />
          </label>
          <label className="block">
            <span className="block font-semibold mb-2">Goal weight ({draft.unit})</span>
            <input className="field num" inputMode="decimal" value={draft.targetWeight ?? ''} onChange={(e) => set('targetWeight', e.target.value ? Number(e.target.value.replace(/[^\d.]/g, '')) : null)} />
          </label>
        </div>
        <button className="btn btn-sun w-full mt-6" disabled={!changed || !draft.name.trim()} onClick={() => onSave(draft)}>{changed ? 'Save changes' : 'Saved'}</button>
      </section>

      {onShareDetails && (
        <button type="button" onClick={onShareDetails} className="btn btn-ghost w-full mt-10"><UserRound className="w-5 h-5" aria-hidden="true" /> Let your coach see your progress</button>
      )}
      </div>
    </main>
  );
}
