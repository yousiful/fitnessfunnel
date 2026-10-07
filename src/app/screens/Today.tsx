import { useState } from 'react';
import { Flame, Play, Scale } from 'lucide-react';
import { Sky } from '../components/Sky';
import { WeekStrip } from '../components/Bits';
import { currentStreak, dailyTargetMinutes, dayKey, latestWeight, minutesOn, type Member } from '../lib/model';
import { GOAL_LABEL, LEVEL_LABEL, todaysWorkout, workoutMinutes, type Workout } from '../lib/workouts';
import { WeightSheet } from './WeightSheet';
import { MoveDemo } from '../components/MoveDemo';
import { HowToSheet } from '../components/HowToSheet';
import { quoteOfTheDay } from '../lib/quotes';
import { buildSteps } from '../lib/workouts';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function Today({ member, riseFrom, onStart, onLogWeight }: { member: Member; riseFrom?: number; onStart: (w: Workout) => void; onLogWeight: (v: number) => void }) {
  const p = member.profile!;
  const today = dayKey();
  const done = minutesOn(member, today);
  const target = dailyTargetMinutes(p.level);
  const progress = done / target;
  const streak = currentStreak(member);
  const workout = todaysWorkout(p.goal, member.workouts.length);
  const mins = workoutMinutes(workout, p.level);
  const weight = latestWeight(member);
  const [weighing, setWeighing] = useState(false);
  const [how, setHow] = useState<{ demo: string; name: string } | null>(null);
  const low = p.level === 'beginner' || workout.goal === 'recover';
  const moves = buildSteps(workout, p.level, low).filter((s) => s.phase === 'Workout' && s.kind === 'work' && s.round === 1).map((s) => s.exercise);
  const finished = progress >= 0.8;

  return (
    <main className="screen">
      <Sky progress={progress} from={riseFrom} height="46vh" minHeight={330} sunX={74} sunSize={120}>
        <div className="h-full flex flex-col px-6 pt-[max(24px,env(safe-area-inset-top))] pb-6 max-w-xl mx-auto w-full">
          <div className="flex items-start justify-between">
            <h1 className="display text-[30px] leading-[1.08] font-extrabold max-w-[70%]">{greeting()}, {p.name || 'friend'}</h1>
            {streak > 0 && (
              <span className="chip !bg-[rgba(18,15,46,0.55)] !text-[var(--cream)]" aria-label={`${streak} day streak`}>
                <Flame className="w-4 h-4" style={{ color: 'var(--sun)' }} aria-hidden="true" /> {streak} day{streak === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <div className="mt-auto max-w-[52%]" style={{ color: finished ? 'var(--night)' : 'var(--cream)' }}>
            <p className="whitespace-nowrap">
              <span className="num text-[64px] leading-none font-extrabold">{done}</span>
              <span className="num text-[26px] font-bold" style={{ opacity: 0.75 }}> / {target} min</span>
            </p>
            <p className="mt-1 font-semibold leading-snug">
              {finished ? "Sun's up. Today is done." : done > 0 ? 'Almost there. Keep it rising.' : "Today's sun is waiting on you."}
            </p>
          </div>
        </div>
      </Sky>

      <div className="px-5 max-w-xl mx-auto -mt-1">
        <section className="pt-7" aria-labelledby="this-week">
          <h2 id="this-week" className="sr-only">This week</h2>
          <WeekStrip member={member} stampToday={riseFrom != null} />
        </section>

        <section className="mt-7" aria-labelledby="next-up">
          <h2 id="next-up" className="display text-[28px] leading-tight font-extrabold">{workout.title}</h2>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>{mins} min · {LEVEL_LABEL[p.level]} · {GOAL_LABEL[p.goal]}. {workout.blurb}</p>
          <button type="button" onClick={() => onStart(workout)} className={`btn ${finished ? 'btn-raised' : 'btn-sun'} w-full mt-4 !min-h-[64px] text-[19px]`}>
            <Play className="w-6 h-6 fill-current" aria-hidden="true" /> {finished ? 'Do another workout' : "Start today's workout"}
          </button>
        </section>

        <section className="mt-6" aria-labelledby="todays-moves">
          <h2 id="todays-moves" className="font-bold text-[18px]">Today's moves <span className="font-semibold text-[15px]" style={{ color: 'var(--muted)' }}>· tap to learn each one</span></h2>
          <ul className="mt-3 -mx-5 px-5 flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
            {moves.map((e, i) => (
              <li key={e.id + i} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <button type="button" onClick={() => setHow({ demo: e.demo || e.id, name: e.name })} className="panel w-[132px] p-3 flex flex-col items-center text-center gap-1">
                  <MoveDemo demo={e.demo || e.id} size={96} />
                  <span className="font-bold text-[15px] leading-tight">{e.name}</span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--sun)' }}>How to</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <blockquote className="panel px-5 py-4" style={{ background: 'var(--ground-2)' }}>
            <p className="text-[18px] italic leading-snug">"{quoteOfTheDay()}"</p>
            <footer className="mt-1 text-[13px] font-semibold" style={{ color: 'var(--faint)' }}>Today's push</footer>
          </blockquote>
        </section>

        <section className="mt-4">
          <button type="button" onClick={() => setWeighing(true)} className="w-full panel px-5 py-4 flex items-center justify-between">
            <span className="flex items-center gap-3 font-semibold"><Scale className="w-5 h-5" style={{ color: 'var(--sun)' }} aria-hidden="true" /> Log today's weight</span>
            <span className="num font-bold" style={{ color: 'var(--muted)' }}>{weight != null ? `${weight} ${p.unit}` : 'Add'}</span>
          </button>
        </section>
      </div>

      {how && <HowToSheet demo={how.demo} name={how.name} onClose={() => setHow(null)} />}
      {weighing && <WeightSheet unit={p.unit} initial={weight} onClose={() => setWeighing(false)} onSave={(v) => { onLogWeight(v); setWeighing(false); }} />}
    </main>
  );
}
