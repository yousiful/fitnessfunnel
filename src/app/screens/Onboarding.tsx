import { useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Sky } from '../components/Sky';
import type { Goal, Level, Profile, Unit } from '../lib/model';
import { GOAL_LABEL, LEVEL_LABEL } from '../lib/workouts';

const GOAL_LINE: Record<Goal, string> = {
  lose: 'Burn fat with simple at-home workouts.',
  recover: 'Gentle moves to come back from injury or pain.',
  stronger: 'Build strength with no equipment.',
  move: 'Loosen up, stand taller, feel younger.',
};
const LEVEL_LINE: Record<Level, string> = {
  beginner: "New to this, or it's been a while.",
  regular: 'I move a few times a week.',
  advanced: 'I train hard and want a challenge.',
};

export function Onboarding({ initialName, onDone }: { initialName: string; onDone: (p: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [days, setDays] = useState(3);
  const [unit, setUnit] = useState<Unit>('lb');
  const [now, setNow] = useState('');
  const [target, setTarget] = useState('');

  const total = 5;
  const next = () => setStep((s) => s + 1);
  const finish = (withWeight: boolean) => onDone({
    name: name.trim(), goal: goal!, level: level!, daysPerWeek: days, unit,
    startWeight: withWeight && now ? Number(now) : null, targetWeight: withWeight && target ? Number(target) : null,
  });

  return (
    <main className="min-h-full flex flex-col">
      <Sky progress={0.1 + (step / total) * 0.75} height="26vh">
        <div className="h-full flex items-start justify-between px-6 pt-[max(22px,env(safe-area-inset-top))] max-w-xl mx-auto w-full">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 font-semibold" aria-label="Back">
              <ArrowLeft className="w-6 h-6" aria-hidden="true" />
            </button>
          ) : <span />}
          <span className="font-semibold" style={{ color: 'var(--muted)' }}>{step + 1} of {total}</span>
        </div>
      </Sky>

      <section key={step} className="rise-in flex-1 px-6 pt-8 pb-10 max-w-xl mx-auto w-full flex flex-col">
        {step === 0 && (
          <>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">What should we call you?</h1>
            <input className="field mt-8" autoComplete="given-name" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn btn-sun w-full mt-auto" disabled={!name.trim()} onClick={next}>Continue</button>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">What's your main goal, {name.trim()}?</h1>
            <div className="mt-6 grid gap-3">
              {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
                <button key={g} type="button" className="choice" aria-pressed={goal === g} onClick={() => setGoal(g)}>
                  <span className="block text-[20px] font-bold">{GOAL_LABEL[g]}</span>
                  <span className="block mt-1" style={{ color: 'var(--muted)' }}>{GOAL_LINE[g]}</span>
                </button>
              ))}
            </div>
            <div className="sticky-action mt-6"><button className="btn btn-sun w-full" disabled={!goal} onClick={next}>Continue</button></div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">Where are you starting?</h1>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>Every move has an easier version. You can change this anytime.</p>
            <div className="mt-6 grid gap-3">
              {(Object.keys(LEVEL_LABEL) as Level[]).map((l) => (
                <button key={l} type="button" className="choice" aria-pressed={level === l} onClick={() => setLevel(l)}>
                  <span className="block text-[20px] font-bold">{LEVEL_LABEL[l]}</span>
                  <span className="block mt-1" style={{ color: 'var(--muted)' }}>{LEVEL_LINE[l]}</span>
                </button>
              ))}
            </div>
            <div className="sticky-action mt-6"><button className="btn btn-sun w-full" disabled={!level} onClick={next}>Continue</button></div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">How many days a week can you move?</h1>
            <div className="mt-10 flex items-center justify-center gap-8">
              <button type="button" className="btn btn-raised w-16 h-16 !p-0 rounded-full" aria-label="Fewer days" onClick={() => setDays((d) => Math.max(2, d - 1))}><Minus aria-hidden="true" /></button>
              <span className="num text-[96px] leading-none font-extrabold w-24 text-center" aria-live="polite">{days}</span>
              <button type="button" className="btn btn-raised w-16 h-16 !p-0 rounded-full" aria-label="More days" onClick={() => setDays((d) => Math.min(7, d + 1))}><Plus aria-hidden="true" /></button>
            </div>
            <p className="text-center mt-4" style={{ color: 'var(--muted)' }}>{days <= 3 ? 'A great, steady start.' : days <= 5 ? 'Strong rhythm.' : 'All in. Remember to rest when you need it.'}</p>
            <button className="btn btn-sun w-full mt-auto" onClick={next}>Continue</button>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">Want to track your weight?</h1>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>Optional. Only you and your coach see it.</p>
            <div className="mt-6 inline-flex rounded-full p-1 self-start" style={{ background: 'var(--ground-2)' }} role="group" aria-label="Units">
              {(['lb', 'kg'] as Unit[]).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u}
                  className="px-5 py-2 rounded-full font-bold" style={{ background: unit === u ? 'var(--sun)' : 'transparent', color: unit === u ? 'var(--night)' : 'var(--muted)' }}>
                  {u}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block mb-2 font-semibold">Today</span>
                <input className="field num" inputMode="decimal" placeholder={unit === 'lb' ? '185' : '84'} value={now} onChange={(e) => setNow(e.target.value.replace(/[^\d.]/g, ''))} />
              </label>
              <label className="block">
                <span className="block mb-2 font-semibold">Goal</span>
                <input className="field num" inputMode="decimal" placeholder={unit === 'lb' ? '165' : '75'} value={target} onChange={(e) => setTarget(e.target.value.replace(/[^\d.]/g, ''))} />
              </label>
            </div>
            <button className="btn btn-sun w-full mt-auto" onClick={() => finish(true)}>Start my plan</button>
            <button type="button" className="btn w-full mt-2" style={{ color: 'var(--muted)' }} onClick={() => finish(false)}>Skip for now</button>
          </>
        )}
      </section>
    </main>
  );
}
