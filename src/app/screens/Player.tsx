import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { Sky } from '../components/Sky';
import { MoveDemo } from '../components/MoveDemo';
import { HowToSheet } from '../components/HowToSheet';
import { quoteFor } from '../lib/quotes';
import type { Level } from '../lib/model';
import { buildSteps, totalSeconds, type Workout } from '../lib/workouts';

interface Props {
  workout: Workout;
  level: Level;
  lowImpact: boolean;
  minutesBefore: number; // minutes already done today
  target: number;
  onFinish: (minutes: number, complete: boolean) => void;
  onExit: () => void;
}

let audio: AudioContext | null = null;
function beep(freq = 880, ms = 120) {
  try {
    audio = audio || new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(audio.destination);
    g.gain.setValueAtTime(0.0001, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + ms / 1000);
    o.start(); o.stop(audio.currentTime + ms / 1000 + 0.02);
  } catch { /* sound is a bonus */ }
}
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* not supported */ } };

export function Player({ workout, level, lowImpact, minutesBefore, target, onFinish, onExit }: Props) {
  const steps = useMemo(() => buildSteps(workout, level, lowImpact), [workout, level, lowImpact]);
  const total = useMemo(() => totalSeconds(steps), [steps]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(steps[0].seconds);
  const [running, setRunning] = useState(true);
  const [confirmExit, setConfirmExit] = useState(false);
  const [done, setDone] = useState(false);
  const [howTo, setHowTo] = useState(false);
  const lastTick = useRef<number | null>(null);
  const leftRef = useRef(left);
  leftRef.current = left;

  const step = steps[i];
  const elapsed = steps.slice(0, i).reduce((s, x) => s + x.seconds, 0) + (step.seconds - left);

  // Keep the screen awake during the workout.
  useEffect(() => {
    let lock: any = null;
    (navigator as any).wakeLock?.request('screen').then((l: any) => { lock = l; }).catch(() => {});
    return () => { lock?.release?.().catch?.(() => {}); };
  }, []);

  const goTo = useCallback((n: number) => {
    if (n >= steps.length) { setDone(true); setRunning(false); beep(660, 180); setTimeout(() => beep(990, 260), 200); buzz([120, 80, 220]); return; }
    const target = Math.max(0, n);
    setI(target); setLeft(steps[target].seconds);
    beep(steps[target].kind === 'work' ? 990 : 520, 160); buzz(steps[target].kind === 'work' ? [80, 60, 80] : 120);
  }, [steps]);

  useEffect(() => {
    if (!running || done) { lastTick.current = null; return; }
    const id = window.setInterval(() => {
      const now = performance.now();
      if (lastTick.current == null) { lastTick.current = now; return; }
      if (now - lastTick.current < 1000) return;
      lastTick.current += 1000;
      const l = leftRef.current;
      if (l <= 1) { goTo(i + 1); return; }
      if (l <= 4) beep(740, 90);
      leftRef.current = l - 1;
      setLeft(l - 1);
    }, 100);
    return () => window.clearInterval(id);
  }, [running, done, i, goTo]);

  const minutesDone = Math.round(elapsed / 60);
  const dayProgress = (minutesBefore + elapsed / 60) / target;

  if (done) {
    const minutes = Math.max(1, Math.round(total / 60));
    return (
      <main className="fixed inset-0 z-40 flex flex-col" style={{ background: 'var(--ground)' }}>
        <Sky progress={Math.max(0.85, (minutesBefore + minutes) / target)} from={minutesBefore / target} height="58vh">
          <div className="h-full flex flex-col justify-end px-6 pb-8 max-w-xl mx-auto w-full rise-in">
            <h1 className="display text-[56px] leading-[0.95] font-extrabold" style={{ color: 'var(--night)' }}>Sun's up.</h1>
            <p className="mt-2 text-[19px] font-semibold" style={{ color: 'var(--night)' }}>{workout.title} is done.</p>
          </div>
        </Sky>
        <div className="flex-1 px-6 pt-8 pb-[max(28px,env(safe-area-inset-bottom))] max-w-xl mx-auto w-full flex flex-col">
          <p className="text-[20px]"><span className="num text-[40px] font-extrabold">{minutes}</span> minutes of real work. Your coach will be proud.</p>
          <p className="mt-5 text-[18px] italic leading-snug" style={{ color: 'var(--muted)' }}>"{quoteFor(steps.length)}"</p>
          <button className="btn btn-sun w-full mt-auto" onClick={() => onFinish(minutes, true)}>Done</button>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-40 flex flex-col overflow-y-auto" style={{ background: 'var(--ground)' }}>
      <Sky progress={dayProgress} height="28vh" minHeight={170} sunSize={96}>
        <div className="h-full flex items-start justify-between px-5 pt-[max(18px,env(safe-area-inset-top))] max-w-xl mx-auto w-full">
          <div>
            <p className="font-bold">{workout.title}</p>
            <p className="text-[15px] font-semibold" style={{ color: 'var(--muted)' }}>
              {step.phase}{step.round ? ` · round ${step.round} of ${step.rounds}` : ''}
            </p>
          </div>
          <button type="button" onClick={() => { setRunning(false); setConfirmExit(true); }} aria-label="End workout" className="w-11 h-11 grid place-items-center rounded-full" style={{ background: 'rgba(18,15,46,0.55)' }}>
            <X aria-hidden="true" />
          </button>
        </div>
      </Sky>

      {/* Timeline: every bar is exactly as long as its seconds. */}
      <div className="px-5 pt-4 max-w-xl mx-auto w-full">
        {/* Only this phase (or round) is drawn, so a 40s move is visibly twice a 20s rest. */}
        <div className="flex items-center gap-[3px] h-4" role="progressbar" aria-label="Workout progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={elapsed}>
          {steps.map((s, n) => ({ s, n })).filter(({ s }) => s.phase === step.phase && s.round === step.round).map(({ s, n }) => {
            const fill = n < i ? 1 : n === i ? (s.seconds - left) / s.seconds : 0;
            const work = s.kind === 'work';
            return (
              <div key={n} className="relative overflow-hidden rounded-[3px]" style={{ flexGrow: s.seconds, flexBasis: 0, height: work ? 14 : 6, background: work ? 'rgba(255,243,226,0.16)' : 'rgba(255,243,226,0.08)' }}>
                <div className="absolute inset-0 origin-left" style={{ transform: `scaleX(${fill})`, background: work ? 'var(--sun)' : 'var(--muted)', transition: n === i ? 'transform 900ms linear' : 'none' }} />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[14px] font-semibold flex justify-between" style={{ color: 'var(--faint)' }}>
          <span>{minutesDone} min done</span><span>{Math.ceil((total - elapsed) / 60)} min left</span>
        </p>
      </div>

      <section className="flex-1 px-6 pt-4 pb-4 max-w-xl mx-auto w-full flex flex-col" aria-live="polite">
        {step.kind === 'rest' ? (
          <>
            <h2 className="display text-[38px] leading-[1.02] font-extrabold">Rest and breathe</h2>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="num font-extrabold leading-none text-[104px]" style={{ color: 'var(--muted)' }}>{left}</p>
              <MoveDemo demo={step.exercise.demo || step.exercise.id} size={150} className="shrink-0 opacity-80" />
            </div>
            <p className="mt-3 text-[20px] font-bold">{step.exercise.name} is next.</p>
            <p className="mt-1 text-[17px]" style={{ color: 'var(--muted)' }}>{step.exercise.cue}</p>
            <button type="button" onClick={() => { setRunning(false); setHowTo(true); }} className="mt-3 self-start inline-flex items-center gap-2 font-semibold text-[16px] px-4 py-2.5 rounded-full" style={{ background: 'var(--ground-2)', color: 'var(--sun)' }}>
              <BookOpen className="w-[18px] h-[18px]" aria-hidden="true" /> How to do it (video)
            </button>
            <p className="mt-auto pt-5 text-[17px] italic leading-snug" style={{ color: 'var(--muted)' }}>"{quoteFor(i)}"</p>
          </>
        ) : (
          <>
            <h2 className="display text-[38px] leading-[1.02] font-extrabold">{step.exercise.name}</h2>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="num font-extrabold leading-none text-[112px]" style={{ color: left <= 3 ? 'var(--sun)' : 'var(--cream)' }}>{left}</p>
              <MoveDemo demo={step.exercise.demo || step.exercise.id} size={170} playing={running} className="shrink-0" />
            </div>
            <p className="mt-3 text-[18px] leading-snug">{step.exercise.cue}</p>
            <button type="button" onClick={() => { setRunning(false); setHowTo(true); }} className="mt-3 self-start inline-flex items-center gap-2 font-semibold text-[16px] px-4 py-2.5 rounded-full" style={{ background: 'var(--ground-2)', color: 'var(--sun)' }}>
              <BookOpen className="w-[18px] h-[18px]" aria-hidden="true" /> How to do it (video)
            </button>
          </>
        )}
      </section>

      <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))] max-w-xl mx-auto w-full flex items-center justify-between">
        <button type="button" onClick={() => goTo(i - 1)} disabled={i === 0} aria-label="Previous" className="w-16 h-16 grid place-items-center rounded-full disabled:opacity-30" style={{ background: 'var(--ground-2)' }}>
          <SkipBack aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pause' : 'Resume'} className="w-24 h-24 grid place-items-center rounded-full" style={{ background: 'var(--sun)', color: 'var(--night)', boxShadow: '0 14px 34px -14px rgba(255,178,63,0.8)' }}>
          {running ? <Pause className="w-10 h-10 fill-current" aria-hidden="true" /> : <Play className="w-10 h-10 fill-current ml-1" aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => goTo(i + 1)} aria-label="Skip" className="w-16 h-16 grid place-items-center rounded-full" style={{ background: 'var(--ground-2)' }}>
          <SkipForward aria-hidden="true" />
        </button>
      </div>

      {howTo && <HowToSheet demo={step.exercise.demo || step.exercise.id} name={step.exercise.name} onClose={() => setHowTo(false)} />}

      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="End workout">
          <div className="absolute inset-0 bg-black/60" />
          <div className="rise-in relative w-full max-w-xl rounded-t-[28px] px-6 pt-6 pb-[max(28px,env(safe-area-inset-bottom))]" style={{ background: 'var(--ground-2)' }}>
            <h2 className="display text-[28px] font-extrabold">End this workout?</h2>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>
              {minutesDone >= 2 ? `Your ${minutesDone} minutes still count toward today.` : 'Nothing is saved for workouts under 2 minutes.'}
            </p>
            <button className="btn btn-sun w-full mt-6" onClick={() => { setConfirmExit(false); setRunning(true); }}>Keep going</button>
            <button className="btn btn-ghost w-full mt-3" onClick={() => (minutesDone >= 2 ? onFinish(minutesDone, false) : onExit())}>End workout</button>
          </div>
        </div>
      )}
    </main>
  );
}
