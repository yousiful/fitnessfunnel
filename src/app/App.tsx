import { useEffect, useState } from 'react';
import { Sky } from './components/Sky';
import { TabBar, Toast, type Tab } from './components/Bits';
import { useMember } from './lib/useMember';
import { dailyTargetMinutes, dayKey, minutesOn } from './lib/model';
import type { Workout } from './lib/workouts';
import { ContactSheet } from './screens/ContactSheet';
import { addUsedSeconds, usedSeconds } from './lib/api';
import { Onboarding } from './screens/Onboarding';
import { Today } from './screens/Today';
import { Workouts } from './screens/Workouts';
import { Player } from './screens/Player';
import { Progress } from './screens/Progress';
import { Me } from './screens/Me';

const ASK_AFTER_SECONDS = 180;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export default function App() {
  const { demo, status, member, email, update, linked, celebrate, clearCelebrate } = useMember();
  const [askContact, setAskContact] = useState(false);
  const [askedThisVisit, setAskedThisVisit] = useState(false);

  // Count time on screen; after 3 minutes of use, ask once per visit until they share their details.
  useEffect(() => {
    if (demo || member.contact || askedThisVisit) return;
    const t = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      addUsedSeconds(5);
      if (usedSeconds() >= ASK_AFTER_SECONDS) { setAskContact(true); setAskedThisVisit(true); }
    }, 5000);
    return () => clearInterval(t);
  }, [demo, member.contact, askedThisVisit]);
  const [tab, setTab] = useState<Tab>('today');
  const [playing, setPlaying] = useState<{ workout: Workout; low: boolean } | null>(null);
  // After a workout, Today replays the climb from where the sun was.
  const [riseFrom, setRiseFrom] = useState<number | undefined>(undefined);
  useEffect(() => { if (riseFrom == null) return; const t = setTimeout(() => setRiseFrom(undefined), 4000); return () => clearTimeout(t); }, [riseFrom]);

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);
  useEffect(() => {
    if (!celebrate.length) return;
    const t = setTimeout(clearCelebrate, 6000);
    return () => clearTimeout(t);
  }, [celebrate, clearCelebrate]);

  if (status === 'loading') {
    return (
      <Sky progress={0.3} height="100vh">
        <p className="absolute inset-x-0 top-1/3 text-center font-semibold" style={{ color: 'var(--muted)' }} aria-live="polite">Getting your plan ready...</p>
      </Sky>
    );
  }
  if (!member.profile) {
    return <Onboarding initialName="" onDone={(profile) => update((m) => ({
      ...m,
      profile,
      weights: profile.startWeight != null && !m.weights.length ? [{ date: dayKey(), value: profile.startWeight }] : m.weights,
    }))} />;
  }

  const p = member.profile;
  const start = (workout: Workout, low?: boolean) =>
    setPlaying({ workout, low: low ?? (p.level === 'beginner' || workout.goal === 'recover') });

  return (
    <>
      {tab === 'today' && (
        <Today
          member={member}
          riseFrom={riseFrom}
          onStart={(w) => start(w)}
          onLogWeight={(value) => update((m) => ({ ...m, weights: [...m.weights.filter((w) => w.date !== dayKey()), { date: dayKey(), value }] }))}
        />
      )}
      {tab === 'workouts' && <Workouts member={member} onStart={start} />}
      {tab === 'progress' && <Progress member={member} />}
      {tab === 'me' && <Me member={member} email={email} onShareDetails={demo || member.contact ? undefined : () => setAskContact(true)} onSave={(profile) => update((m) => ({ ...m, profile }))} />}
      <TabBar tab={tab} onTab={setTab} />
      {demo && (
        <p className="fixed left-1/2 -translate-x-1/2 z-30 chip !py-1.5 !text-[13px] whitespace-nowrap !bg-[rgba(38,32,90,0.95)] !text-[var(--cream)]" style={{ bottom: 'calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 8px)' }} role="status">
          Preview with sample data · nothing is saved
        </p>
      )}

      {playing && (
        <Player
          workout={playing.workout}
          level={p.level}
          lowImpact={playing.low}
          minutesBefore={minutesOn(member, dayKey())}
          target={dailyTargetMinutes(p.level)}
          onExit={() => setPlaying(null)}
          onFinish={(minutes) => {
            setRiseFrom(minutesOn(member, dayKey()) / dailyTargetMinutes(p.level));
            update((m) => ({
              ...m,
              workouts: [...m.workouts, { id: uid(), date: dayKey(), workoutId: playing.workout.id, title: playing.workout.title, minutes, completedAt: new Date().toISOString() }],
            }));
            setPlaying(null);
            setTab('today');
          }}
        />
      )}

      {askContact && !playing && (
        <ContactSheet
          initialName={p.name}
          onClose={() => setAskContact(false)}
          onSaved={(c) => { linked(c); setAskContact(false); }}
        />
      )}

      {celebrate.length > 0 && !playing && (
        <Toast onDone={clearCelebrate}>New milestone: {celebrate.map((c) => c.label).join(', ')}</Toast>
      )}
    </>
  );
}
