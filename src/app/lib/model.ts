// Shared by the app and the app-state function: the member record and the stats derived from it.

export type Goal = 'lose' | 'recover' | 'stronger' | 'move';
export type Level = 'beginner' | 'regular' | 'advanced';
export type Unit = 'lb' | 'kg';

export interface Profile {
  name: string;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  unit: Unit;
  startWeight: number | null;
  targetWeight: number | null;
}

export interface WorkoutLog { id: string; date: string; workoutId: string; title: string; minutes: number; completedAt: string }
export interface WeightLog { date: string; value: number }

export interface Member {
  profile: Profile | null;
  workouts: WorkoutLog[];
  weights: WeightLog[];
  milestones: Record<string, string>;
  /** Set once the member shares their details (and is linked to a GHL contact). */
  contact?: { ghlId: string; firstName: string; email: string; phone: string };
}

export const emptyMember = (): Member => ({ profile: null, workouts: [], weights: [], milestones: {} });

/** Local calendar date as YYYY-MM-DD. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

/** Minutes the plan asks for each workout day, by level (one full guided workout). */
export const dailyTargetMinutes = (level: Level = 'beginner') => ({ beginner: 13, regular: 18, advanced: 18 }[level]);

export const todayProgress = (member: Member) => minutesOn(member, dayKey()) / dailyTargetMinutes(member.profile?.level);

export function minutesOn(member: Member, key: string): number {
  return member.workouts.filter((w) => w.date === key).reduce((s, w) => s + w.minutes, 0);
}

/** Consecutive days with a workout, ending today (or yesterday, so the streak survives until tonight). */
export function currentStreak(member: Member, today = dayKey()): number {
  const days = new Set(member.workouts.map((w) => w.date));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(cursor)) { n++; cursor = addDays(cursor, -1); }
  return n;
}

export function bestStreak(member: Member): number {
  const days = [...new Set(member.workouts.map((w) => w.date))].sort();
  let best = 0, run = 0, prev = '';
  for (const d of days) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; }
  return best;
}

export function latestWeight(member: Member): number | null {
  if (!member.weights.length) return member.profile?.startWeight ?? null;
  const sorted = [...member.weights].sort((a, b) => a.date.localeCompare(b.date));
  return sorted[sorted.length - 1].value;
}

export function goalReached(member: Member): boolean {
  const p = member.profile;
  const now = latestWeight(member);
  if (!p || p.startWeight == null || p.targetWeight == null || now == null || member.weights.length === 0) return false;
  return p.targetWeight < p.startWeight ? now <= p.targetWeight : p.targetWeight > p.startWeight ? now >= p.targetWeight : false;
}

export interface MilestoneDef { key: string; tag: string; label: string; test: (m: Member) => boolean }

export const MILESTONES: MilestoneDef[] = [
  { key: 'first_workout', tag: 'ihc app: first workout', label: 'First workout done', test: (m) => m.workouts.length >= 1 },
  { key: 'workouts_10', tag: 'ihc app: 10 workouts', label: '10 workouts', test: (m) => m.workouts.length >= 10 },
  { key: 'workouts_25', tag: 'ihc app: 25 workouts', label: '25 workouts', test: (m) => m.workouts.length >= 25 },
  { key: 'workouts_50', tag: 'ihc app: 50 workouts', label: '50 workouts', test: (m) => m.workouts.length >= 50 },
  { key: 'streak_3', tag: 'ihc app: 3 day streak', label: '3 days in a row', test: (m) => bestStreak(m) >= 3 },
  { key: 'streak_7', tag: 'ihc app: 7 day streak', label: '7 days in a row', test: (m) => bestStreak(m) >= 7 },
  { key: 'goal_reached', tag: 'ihc app: goal weight reached', label: 'Goal weight reached', test: goalReached },
];
