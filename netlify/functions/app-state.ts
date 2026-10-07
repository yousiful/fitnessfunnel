import type { Handler } from '@netlify/functions';
import { json, parseBody, readSession, recordMilestones, store } from '../lib/app-lib';
import { MILESTONES, emptyMember, latestWeight, type Member, type Profile } from '../../src/app/lib/model';

// GET -> the signed-in member's record. PUT { profile, workouts, weights } -> saves it and
// returns it with any newly reached milestones, which are also tagged on their GHL contact.

const GOALS = ['lose', 'recover', 'stronger', 'move'];
const LEVELS = ['beginner', 'regular', 'advanced'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const num = (v: unknown, lo: number, hi: number) => (typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : null);

function cleanProfile(p: any): Profile | null {
  if (!p || typeof p !== 'object') return null;
  if (!GOALS.includes(p.goal) || !LEVELS.includes(p.level)) return null;
  return {
    name: String(p.name || '').slice(0, 60),
    goal: p.goal,
    level: p.level,
    daysPerWeek: num(p.daysPerWeek, 2, 7) ?? 3,
    unit: p.unit === 'kg' ? 'kg' : 'lb',
    startWeight: num(p.startWeight, 40, 900),
    targetWeight: num(p.targetWeight, 40, 900),
  };
}

export const handler: Handler = async (event) => {
  const session = readSession(event);
  if (!session) return json(401, { error: 'Please reopen the app.' });

  const db = store(event);
  const key = `member/${session.cid}`;
  const current = ((await db.get(key, { type: 'json' })) as Member | null) || emptyMember();
  // Device members link to GHL once they share their details; early email sign-ins already are.
  const ghlId = current.contact?.ghlId || (session.cid.startsWith('d_') ? '' : session.cid);
  const email = current.contact?.email || session.email;

  if (event.httpMethod === 'GET') return json(200, { member: current, email });
  if (event.httpMethod !== 'PUT') return json(405, { error: 'Method not allowed' });
  if ((event.body || '').length > 400_000) return json(413, { error: 'Too much data.' });

  const body = parseBody<Partial<Member>>(event);
  if (!body) return json(400, { error: 'Bad request' });

  const workouts = (Array.isArray(body.workouts) ? body.workouts : current.workouts)
    .filter((w: any) => w && DATE.test(w.date) && typeof w.id === 'string')
    .slice(-3000)
    .map((w: any) => ({
      id: String(w.id).slice(0, 40), date: w.date, workoutId: String(w.workoutId || '').slice(0, 40),
      title: String(w.title || '').slice(0, 80), minutes: num(w.minutes, 0, 300) ?? 0, completedAt: String(w.completedAt || '').slice(0, 30),
    }));
  const weights = (Array.isArray(body.weights) ? body.weights : current.weights)
    .filter((w: any) => w && DATE.test(w.date) && num(w.value, 40, 900) != null)
    .slice(-2000)
    .map((w: any) => ({ date: w.date, value: w.value }));

  const next: Member = {
    ...current,
    profile: body.profile === undefined ? current.profile : cleanProfile(body.profile) ?? current.profile,
    workouts,
    weights,
    milestones: { ...current.milestones },
  };

  const reached = MILESTONES.filter((m) => !next.milestones[m.key] && m.test(next));
  const now = new Date().toISOString();
  reached.forEach((m) => { next.milestones[m.key] = now; });

  await db.setJSON(key, next);

  if (reached.length && ghlId) {
    const w = latestWeight(next);
    const unit = next.profile?.unit || 'lb';
    try {
      await recordMilestones(ghlId, reached.map((m) => ({
        tag: m.tag,
        note: `${m.label} (${next.workouts.length} workouts total${w != null ? `, current weight ${w} ${unit}` : ''})`,
      })));
    } catch (e) { console.error(e); }
  }

  return json(200, { member: next, reached: reached.map((m) => ({ key: m.key, label: m.label })) });
};
