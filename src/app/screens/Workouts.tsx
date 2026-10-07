import { useEffect, useState } from 'react';
import { MoveDemo } from '../components/MoveDemo';
import { VideoLink } from '../components/VideoLink';
import { ChevronRight, X } from 'lucide-react';
import { todayProgress, type Goal, type Level, type Member } from '../lib/model';
import { SkyBand } from '../components/Sky';
import { GOAL_LABEL, LEVEL_LABEL, WORKOUTS, buildSteps, workoutMinutes, type Workout } from '../lib/workouts';

export function Workouts({ member, onStart }: { member: Member; onStart: (w: Workout, lowImpact: boolean) => void }) {
  const p = member.profile!;
  const [open, setOpen] = useState<Workout | null>(null);
  const goals = [p.goal, ...(['lose', 'recover', 'stronger', 'move'] as Goal[]).filter((g) => g !== p.goal)];
  const timesDone = (id: string) => member.workouts.filter((w) => w.workoutId === id).length;

  return (
    <main className="screen">
      <SkyBand progress={todayProgress(member)} title="Workouts" subtitle={<>All at home, no equipment. {LEVEL_LABEL[p.level]} level.</>} />
      <div className="px-5 max-w-xl mx-auto">

      {goals.map((g, gi) => (
        <section key={g} className="mt-9" aria-labelledby={`goal-${g}`}>
          <h2 id={`goal-${g}`} className="flex items-baseline justify-between">
            <span className="display text-[24px] font-extrabold">{GOAL_LABEL[g]}</span>
            {gi === 0 && <span className="text-[14px] font-semibold" style={{ color: 'var(--sun)' }}>Your goal</span>}
          </h2>
          <ul className="mt-3 border-t" style={{ borderColor: 'var(--line)' }}>
            {WORKOUTS.filter((w) => w.goal === g).map((w) => (
              <li key={w.id} className="border-b" style={{ borderColor: 'var(--line)' }}>
                <button type="button" onClick={() => setOpen(w)} className="w-full py-4 flex items-center justify-between gap-4 text-left">
                  <span>
                    <span className="block text-[19px] font-bold">{w.title}</span>
                    <span className="block text-[15px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      {workoutMinutes(w, p.level)} min · {w.moves.length} moves{timesDone(w.id) ? ` · done ${timesDone(w.id)}×` : ''}
                    </span>
                  </span>
                  <ChevronRight className="w-5 h-5 shrink-0" style={{ color: 'var(--faint)' }} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      </div>
      {open && (
        <Preview
          workout={open} level={p.level} defaultLow={p.level === 'beginner' || open.goal === 'recover'}
          onClose={() => setOpen(null)} onStart={(low) => { onStart(open, low); setOpen(null); }}
        />
      )}
    </main>
  );
}

function Preview({ workout, level, defaultLow, onClose, onStart }: { workout: Workout; level: Level; defaultLow: boolean; onClose: () => void; onStart: (low: boolean) => void }) {
  const [low, setLow] = useState(defaultLow);
  const moves = buildSteps(workout, level, low).filter((s) => s.phase === 'Workout' && s.kind === 'work' && s.round === 1);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={workout.title}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="rise-in relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-t-[28px] px-6 pt-6 pb-[max(28px,env(safe-area-inset-bottom))]" style={{ background: 'var(--ground-2)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="display text-[30px] leading-tight font-extrabold">{workout.title}</h2>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>{workoutMinutes(workout, level)} min · {LEVEL_LABEL[level]}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 -mr-2"><X aria-hidden="true" /></button>
        </div>
        <p className="mt-3">{workout.blurb}</p>

        <div className="mt-5 flex items-center justify-between gap-4 panel px-4 py-3" style={{ background: 'var(--ground-3)' }}>
          <span id="low-label">
            <span className="block font-bold">Low-impact version</span>
            <span className="block text-[14px]" style={{ color: 'var(--muted)' }}>No jumping, easier on joints.</span>
          </span>
          <button type="button" role="switch" aria-checked={low} aria-labelledby="low-label" className="switch" onClick={() => setLow((v) => !v)} />
        </div>

        <ol className="mt-5">
          <li className="py-2 font-semibold" style={{ color: 'var(--faint)' }}>2 min warm up</li>
          {moves.map((s, i) => (
            <li key={s.exercise.id + i} className="py-3 border-t flex gap-3 items-start" style={{ borderColor: 'var(--line)' }}>
              <MoveDemo demo={s.exercise.demo || s.exercise.id} size={72} className="shrink-0 rounded-xl" />
              <span className="min-w-0">
                <span className="block font-bold text-[18px]">{s.exercise.name}</span>
                <span className="block text-[15px] mt-0.5" style={{ color: 'var(--muted)' }}>{s.exercise.cue}</span>
                <VideoLink name={s.exercise.name} />
              </span>
            </li>
          ))}
          <li className="py-2 border-t font-semibold" style={{ borderColor: 'var(--line)', color: 'var(--faint)' }}>1.5 min cool down</li>
        </ol>

        <button className="btn btn-sun w-full mt-6" onClick={() => onStart(low)}>Start workout</button>
      </div>
    </div>
  );
}
