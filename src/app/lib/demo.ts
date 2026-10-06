import { addDays, dayKey, type Member } from './model';
import { WORKOUTS } from './workouts';

// Preview mode (/app/?demo): a sample member so the club can show the app without signing in.
// Synthetic data, kept in memory only; nothing is sent to the server or the CRM.
export const isDemo = () => {
  try { return new URLSearchParams(window.location.search).has('demo'); } catch { return false; }
};

export function demoMember(): Member {
  const today = dayKey();
  const lose = WORKOUTS.filter((w) => w.goal === 'lose');
  const workouts: Member['workouts'] = [];
  const weights: Member['weights'] = [];
  // 24 days of history ending yesterday: active most days, a few rest days, weight trending down.
  const rest = new Set([3, 7, 10, 14, 17, 21]);
  for (let d = 24; d >= 1; d--) {
    const date = addDays(today, -d);
    if (!rest.has(d)) {
      const w = lose[workouts.length % lose.length];
      workouts.push({ id: `demo-${d}`, date, workoutId: w.id, title: w.title, minutes: d % 5 === 0 ? 9 : 18, completedAt: `${date}T07:30:00.000Z` });
    }
    if (d % 3 === 0) weights.push({ date, value: Math.round((186 - (24 - d) * 0.22) * 10) / 10 });
  }
  const iso = (n: number) => `${addDays(today, -n)}T08:00:00.000Z`;
  return {
    profile: { name: 'Maria', goal: 'lose', level: 'regular', daysPerWeek: 5, unit: 'lb', startWeight: 186, targetWeight: 170 },
    workouts,
    weights,
    milestones: { joined: iso(24), first_workout: iso(24), streak_3: iso(22), workouts_10: iso(12), streak_7: iso(6) },
  };
}
