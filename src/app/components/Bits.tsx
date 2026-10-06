import { Dumbbell, LineChart, Sunrise, UserRound } from 'lucide-react';
import { SunGlyph, type SunState } from './Sky';
import { addDays, dailyTargetMinutes, dayKey, minutesOn, type Member } from '../lib/model';

export type Tab = 'today' | 'workouts' | 'progress' | 'me';

const TABS: { id: Tab; label: string; Icon: typeof Sunrise }[] = [
  { id: 'today', label: 'Today', Icon: Sunrise },
  { id: 'workouts', label: 'Workouts', Icon: Dumbbell },
  { id: 'progress', label: 'Progress', Icon: LineChart },
  { id: 'me', label: 'Me', Icon: UserRound },
];

export function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      <ul className="grid grid-cols-4 h-[var(--tabbar-h)] max-w-xl mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const on = tab === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onTab(id)}
                aria-current={on ? 'page' : undefined}
                className="w-full h-full flex flex-col items-center justify-center gap-1 font-semibold text-[13px] transition-colors"
                style={{ color: on ? 'var(--sun)' : 'var(--faint)' }}
              >
                <Icon className="w-6 h-6" strokeWidth={on ? 2.4 : 2} aria-hidden="true" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function sunStateFor(member: Member, key: string, today: string): SunState {
  if (key > today) return 'future';
  const mins = minutesOn(member, key);
  if (mins <= 0) return 'none';
  return mins >= dailyTargetMinutes(member.profile?.level) * 0.8 ? 'full' : 'half';
}

/** This week, Monday to Sunday. Finished days stay stamped; missed days are a calm unlit dawn. */
export function WeekStrip({ member, stampToday = false }: { member: Member; stampToday?: boolean }) {
  const today = dayKey();
  const d = new Date();
  const monday = addDays(today, -((d.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <ol className="grid grid-cols-7 gap-1" aria-label="This week">
      {days.map((k, i) => {
        const s = sunStateFor(member, k, today);
        const text = { full: 'workout done', half: 'part of a workout', none: 'no workout', future: 'coming up' }[s];
        return (
          <li key={k} className="flex flex-col items-center gap-1.5">
            <span className={stampToday && k === today ? 'stamp' : undefined}><SunGlyph state={s} today={k === today} label={`${names[i]}: ${text}`} /></span>
            <span className="text-[13px] font-semibold" style={{ color: k === today ? 'var(--cream)' : 'var(--faint)' }}>{names[i]}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Toast({ children, onDone }: { children: React.ReactNode; onDone: () => void }) {
  return (
    <div className="fixed left-0 right-0 z-50 flex justify-center px-4" style={{ bottom: 'calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 14px)' }}>
      <button
        type="button"
        onClick={onDone}
        className="rise-in panel px-5 py-4 flex items-center gap-3 text-left max-w-md w-full"
        style={{ background: '#2A2050', borderColor: 'rgba(255,178,63,0.5)', boxShadow: '0 16px 40px -16px rgba(0,0,0,0.8)' }}
      >
        <SunGlyph state="full" size={36} />
        <span className="font-semibold">{children}</span>
      </button>
    </div>
  );
}
