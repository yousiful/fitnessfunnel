import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SunGlyph } from '../components/Sky';
import { sunStateFor } from '../components/Bits';
import { MILESTONES, bestStreak, currentStreak, dayKey, latestWeight, todayProgress, type Member } from '../lib/model';
import { SkyBand } from '../components/Sky';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function Progress({ member }: { member: Member }) {
  const p = member.profile!;
  const totalMin = member.workouts.reduce((s, w) => s + w.minutes, 0);
  const streak = currentStreak(member);
  const best = bestStreak(member);

  return (
    <main className="screen">
      <SkyBand progress={todayProgress(member)} title="Progress" />
      <div className="px-5 max-w-xl mx-auto">
      <p className="mt-5 text-[19px] leading-snug">
        <span className="num font-extrabold text-[24px]">{member.workouts.length}</span> workout{member.workouts.length === 1 ? '' : 's'},{' '}
        <span className="num font-extrabold text-[24px]">{totalMin}</span> minutes,{' '}
        {streak > 0 ? <><span className="num font-extrabold text-[24px]">{streak}</span> day streak</> : <>longest streak <span className="num font-extrabold text-[24px]">{best}</span> days</>}.
      </p>

      <MonthOfSuns member={member} />
      <WeightChart member={member} unit={p.unit} />

      <section className="mt-10" aria-labelledby="milestones">
        <h2 id="milestones" className="display text-[24px] font-extrabold">Milestones</h2>
        <ul className="mt-3">
          {MILESTONES.filter((m) => m.key !== 'goal_reached' || p.targetWeight != null).map((m) => {
            const at = member.milestones[m.key];
            return (
              <li key={m.key} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
                <SunGlyph state={at ? 'full' : 'none'} size={36} label={at ? 'reached' : 'not yet'} />
                <span className="flex-1 font-semibold" style={{ color: at ? 'var(--cream)' : 'var(--faint)' }}>{m.label}</span>
                {at && <span className="text-[14px]" style={{ color: 'var(--muted)' }}>{new Date(at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
              </li>
            );
          })}
        </ul>
      </section>
      </div>
    </main>
  );
}

function MonthOfSuns({ member }: { member: Member }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const today = dayKey();
  const first = new Date(cursor.y, cursor.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysIn = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, d) => dayKey(new Date(cursor.y, cursor.m, d + 1)))];
  const isCurrent = cursor.y === now.getFullYear() && cursor.m === now.getMonth();
  const shift = (n: number) => setCursor((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const active = cells.filter((k) => k && member.workouts.some((w) => w.date === k)).length;

  return (
    <section className="mt-8 panel p-5" aria-labelledby="month">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="p-2 -ml-2"><ChevronLeft aria-hidden="true" /></button>
        <h2 id="month" className="font-bold text-[18px]">{MONTHS[cursor.m]} {cursor.y !== now.getFullYear() ? cursor.y : ''}</h2>
        <button type="button" onClick={() => shift(1)} disabled={isCurrent} aria-label="Next month" className="p-2 -mr-2 disabled:opacity-25"><ChevronRight aria-hidden="true" /></button>
      </div>
      <div className="grid grid-cols-7 mt-3 text-center text-[12px] font-semibold" style={{ color: 'var(--faint)' }} aria-hidden="true">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <ol className="grid grid-cols-7 gap-y-1 mt-1">
        {cells.map((k, i) => (
          <li key={i} className="grid place-items-center h-11">
            {k && <SunGlyph state={sunStateFor(member, k, today)} size={32} today={k === today} label={k} />}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[15px] font-semibold" style={{ color: 'var(--muted)' }}>{active} active day{active === 1 ? '' : 's'} this month</p>
    </section>
  );
}

function WeightChart({ member, unit }: { member: Member; unit: string }) {
  const p = member.profile!;
  const logged = [...member.weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-60);
  // Start weight is the first point, so the line agrees with "down since you started".
  const pts = p.startWeight != null && logged.length && logged[0].value !== p.startWeight ? [{ date: 'start', value: p.startWeight }, ...logged] : logged;
  const now = latestWeight(member);
  if (!logged.length) {
    return (
      <section className="mt-6 panel p-5">
        <h2 className="display text-[22px] font-extrabold">Weight</h2>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>Log your weight from the Today tab and your line starts here.</p>
      </section>
    );
  }
  const values = pts.map((x) => x.value).concat(p.targetWeight != null ? [p.targetWeight] : []);
  const lo = Math.min(...values) - 2, hi = Math.max(...values) + 2;
  const W = 320, H = 150;
  const x = (i: number) => (pts.length === 1 ? W / 2 : 8 + (i / (pts.length - 1)) * (W - 16));
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;
  const path = pts.map((pt, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(pt.value).toFixed(1)}`).join(' ');
  const change = p.startWeight != null && now != null ? Math.round((now - p.startWeight) * 10) / 10 : null;

  return (
    <section className="mt-6 panel p-5" aria-labelledby="weight">
      <div className="flex items-baseline justify-between">
        <h2 id="weight" className="display text-[22px] font-extrabold">Weight</h2>
        <p className="num font-extrabold text-[28px]">{now} <span className="text-[16px]" style={{ color: 'var(--muted)' }}>{unit}</span></p>
      </div>
      {change != null && change !== 0 && (
        <p className="font-semibold" style={{ color: 'var(--muted)' }}>{change < 0 ? `${Math.abs(change)} ${unit} down` : `${change} ${unit} up`} since you started</p>
      )}
      <svg viewBox={`0 0 ${W} ${H + 8}`} className="w-full mt-4" role="img" aria-label={`Weight over time, now ${now} ${unit}`}>
        {p.targetWeight != null && (
          <>
            <line x1="0" x2={W} y1={y(p.targetWeight)} y2={y(p.targetWeight)} stroke="rgba(255,178,63,0.75)" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={W} y={y(p.targetWeight) - 6} textAnchor="end" fill="#FFB23F" fontSize="12" fontWeight="700">Goal {p.targetWeight}</text>
          </>
        )}
        <path d={path} fill="none" stroke="var(--cream)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((pt, i) => <circle key={pt.date} cx={x(i)} cy={y(pt.value)} r={i === pts.length - 1 ? 5 : 2.5} fill={i === pts.length - 1 ? '#FFB23F' : 'var(--cream)'} />)}
      </svg>
    </section>
  );
}
