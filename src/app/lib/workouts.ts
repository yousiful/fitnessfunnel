import type { Goal, Level } from './model';

// No-equipment home workouts for the club's four goals. Every move carries a low-impact version
// (shown automatically for beginners and the Heal & Recover goal, and on request for everyone).

export interface Exercise { id: string; name: string; cue: string; low?: { name: string; cue: string } }

const X: Record<string, Exercise> = {
  march: { id: 'march', name: 'March in place', cue: 'Lift your knees to a comfortable height and swing your arms. Breathe easy.' },
  armCircles: { id: 'armCircles', name: 'Arm circles', cue: 'Arms out to the sides. Small circles forward, then backward, growing bigger.' },
  hipCircles: { id: 'hipCircles', name: 'Hip circles', cue: 'Hands on hips, feet wide. Draw slow circles with your hips both ways.' },
  torsoTwist: { id: 'torsoTwist', name: 'Standing twists', cue: 'Soft knees, turn your shoulders side to side and let your arms swing.' },
  jacks: { id: 'jacks', name: 'Jumping jacks', cue: 'Jump feet out as arms go up, jump back in. Land softly.', low: { name: 'Step jacks', cue: 'Step one foot out as arms go up, step back in, then switch sides.' } },
  highKnees: { id: 'highKnees', name: 'High knees', cue: 'Run in place, driving your knees toward hip height. Stay light on your feet.', low: { name: 'Knee lifts', cue: 'March and lift each knee high, touching it with the opposite hand.' } },
  buttKicks: { id: 'buttKicks', name: 'Butt kicks', cue: 'Jog in place, kicking your heels up toward your seat.', low: { name: 'Standing hamstring curls', cue: 'Hold a chair, curl one heel toward your seat, lower, switch.' } },
  skaters: { id: 'skaters', name: 'Skaters', cue: 'Leap side to side, landing on one foot with the other sweeping behind.', low: { name: 'Side step and reach', cue: 'Step wide to one side and reach across your body, then switch.' } },
  climbers: { id: 'climbers', name: 'Mountain climbers', cue: 'From a high plank, drive your knees toward your chest one at a time.', low: { name: 'Chair climbers', cue: 'Hands on a sturdy chair seat, step your knees in one at a time.' } },
  burpee: { id: 'burpee', name: 'Burpees', cue: 'Squat, hands down, jump feet back, jump in, stand and reach up.', low: { name: 'Step-back burpees', cue: 'Squat, hands down, step back one foot at a time, step in, stand tall.' } },
  squatJump: { id: 'squatJump', name: 'Squat jumps', cue: 'Sit back into a squat, then jump up and land softly back into it.', low: { name: 'Squat to calf raise', cue: 'Squat down, stand up and rise onto your toes at the top.' } },
  punches: { id: 'punches', name: 'Boxer punches', cue: 'Soft knees, fists up, punch forward fast and steady, alternating arms.' },
  squat: { id: 'squat', name: 'Squats', cue: 'Feet hip-width, sit back like there is a chair behind you, chest up, stand.', low: { name: 'Chair sit-to-stand', cue: 'Sit down to a chair with control and stand back up without using your hands if you can.' } },
  pushup: { id: 'pushup', name: 'Push-ups', cue: 'Hands under shoulders, body in one line, lower your chest and press up.', low: { name: 'Wall push-ups', cue: 'Hands on a wall at chest height, lower your chest toward it and press away.' } },
  lunge: { id: 'lunge', name: 'Reverse lunges', cue: 'Step one foot back and lower both knees, push through the front heel to stand.', low: { name: 'Supported split squat', cue: 'Hold a chair, feet staggered, bend both knees a little and stand back up.' } },
  bridge: { id: 'bridge', name: 'Glute bridges', cue: 'Lie on your back, knees bent, squeeze your glutes and lift your hips, lower slowly.' },
  plank: { id: 'plank', name: 'Plank', cue: 'Forearms down, body in one straight line, squeeze your belly and breathe.', low: { name: 'Counter plank', cue: 'Forearms on a kitchen counter, walk your feet back into a straight line and hold.' } },
  superman: { id: 'superman', name: 'Supermans', cue: 'Lie face down, lift your arms and legs a few inches, hold, lower.', low: { name: 'Bird dog', cue: 'On hands and knees, reach one arm and the opposite leg long, switch.' } },
  dips: { id: 'dips', name: 'Chair dips', cue: 'Hands on a sturdy chair behind you, bend your elbows to lower, press up.', low: { name: 'Bent-knee chair dips', cue: 'Same move with feet close and knees bent so your legs help.' } },
  calfRaise: { id: 'calfRaise', name: 'Calf raises', cue: 'Hold a wall, rise onto your toes slowly, lower slowly.' },
  wallSit: { id: 'wallSit', name: 'Wall sit', cue: 'Back against a wall, slide down until your knees bend, hold and breathe.', low: { name: 'Half wall sit', cue: 'Only bend your knees a little against the wall and hold.' } },
  sidePlank: { id: 'sidePlank', name: 'Side plank', cue: 'On one forearm, stack your feet and lift your hips. Switch halfway.', low: { name: 'Knee side plank', cue: 'Same position with knees bent and down, lift your hips. Switch halfway.' } },
  catCow: { id: 'catCow', name: 'Cat and cow', cue: 'On hands and knees, round your back up, then let your belly drop. Move with your breath.' },
  birdDog: { id: 'birdDog', name: 'Bird dog', cue: 'On hands and knees, reach one arm and the opposite leg long, pause, switch.' },
  deadBug: { id: 'deadBug', name: 'Dead bug', cue: 'On your back, arms up, knees bent over hips. Lower the opposite arm and leg slowly, switch.' },
  clamshell: { id: 'clamshell', name: 'Clamshells', cue: 'Lie on your side, knees bent, open the top knee like a clamshell, close. Switch halfway.' },
  wallAngel: { id: 'wallAngel', name: 'Wall angels', cue: 'Back to a wall, arms in a goalpost shape, slide them up and down slowly.' },
  heelSlide: { id: 'heelSlide', name: 'Heel slides', cue: 'On your back, slide one heel toward your seat and back out, switch.' },
  legExt: { id: 'legExt', name: 'Seated leg lifts', cue: 'Sit tall on a chair, straighten one knee, hold a moment, lower, switch.' },
  shoulderRoll: { id: 'shoulderRoll', name: 'Shoulder rolls', cue: 'Roll your shoulders up, back and down in big slow circles.' },
  hinge: { id: 'hinge', name: 'Hip hinges', cue: 'Hands on hips, soft knees, push your hips back with a flat back, stand tall.' },
  hipFlexor: { id: 'hipFlexor', name: 'Kneeling hip stretch', cue: 'Half kneel, tuck your tail and shift forward gently. Switch halfway.', low: { name: 'Standing hip stretch', cue: 'Hold a chair, step one foot back, tuck your tail and lean forward a little. Switch halfway.' } },
  worldsGreatest: { id: 'worldsGreatest', name: 'Lunge and reach', cue: 'Step into a lunge, hand down inside your foot, reach the other arm to the sky. Switch.', low: { name: 'Supported lunge reach', cue: 'Hold a chair with one hand, small step forward, reach the free arm up. Switch.' } },
  openBook: { id: 'openBook', name: 'Open book', cue: 'Lie on your side, knees bent, open your top arm across to the other side. Switch halfway.' },
  ankleCircles: { id: 'ankleCircles', name: 'Ankle circles', cue: 'Seated or holding a wall, draw circles with each ankle, both directions.' },
  squatHold: { id: 'squatHold', name: 'Deep squat hold', cue: 'Sink into a deep squat, elbows pressing knees out, breathe.', low: { name: 'Supported squat hold', cue: 'Hold a doorframe or counter and sink only as low as feels good.' } },
  hamSweep: { id: 'hamSweep', name: 'Hamstring sweeps', cue: 'Heel forward, hinge and sweep your hands toward your toes, switch legs.' },
  forwardFold: { id: 'forwardFold', name: 'Forward fold', cue: 'Soft knees, hang forward and let your head and arms relax.', low: { name: 'Seated forward reach', cue: 'Sit on a chair and reach toward your toes, slow and easy.' } },
  chestOpen: { id: 'chestOpen', name: 'Chest opener', cue: 'Hands clasped behind you, lift your chest and open your shoulders.' },
  breathe: { id: 'breathe', name: 'Slow breathing', cue: 'In through your nose for four, out through your mouth for six. Let your shoulders drop.' },
};

export interface Workout { id: string; goal: Goal; title: string; blurb: string; moves: string[] }

const WARMUP = ['march', 'armCircles', 'hipCircles', 'torsoTwist'];
const COOLDOWN = ['forwardFold', 'chestOpen', 'breathe'];

export const WORKOUTS: Workout[] = [
  { id: 'lose-burn', goal: 'lose', title: 'Morning Burn', blurb: 'A full-body sweat to wake everything up.', moves: ['jacks', 'squat', 'highKnees', 'pushup', 'skaters'] },
  { id: 'lose-cardio', goal: 'lose', title: 'Living Room Cardio', blurb: 'Keep moving, keep the heart rate up.', moves: ['punches', 'buttKicks', 'climbers', 'squatJump', 'jacks'] },
  { id: 'lose-total', goal: 'lose', title: 'Total Body Torch', blurb: 'Strength and cardio back to back.', moves: ['burpee', 'lunge', 'highKnees', 'plank', 'skaters'] },
  { id: 'recover-gentle', goal: 'recover', title: 'Gentle Reset', blurb: 'Easy movement to loosen up and feel better.', moves: ['catCow', 'heelSlide', 'bridge', 'shoulderRoll', 'legExt'] },
  { id: 'recover-back', goal: 'recover', title: 'Back Care', blurb: 'Build a strong, calm back and core.', moves: ['catCow', 'birdDog', 'deadBug', 'bridge', 'wallAngel'] },
  { id: 'recover-hips', goal: 'recover', title: 'Happy Hips and Knees', blurb: 'Steady strength around the joints.', moves: ['clamshell', 'bridge', 'legExt', 'calfRaise', 'hinge'] },
  { id: 'stronger-legs', goal: 'stronger', title: 'Strong Legs', blurb: 'Build the legs that carry you everywhere.', moves: ['squat', 'lunge', 'bridge', 'wallSit', 'calfRaise'] },
  { id: 'stronger-upper', goal: 'stronger', title: 'Upper Body Strength', blurb: 'Arms, chest, shoulders and back.', moves: ['pushup', 'dips', 'superman', 'plank', 'wallAngel'] },
  { id: 'stronger-core', goal: 'stronger', title: 'Core Builder', blurb: 'A stronger middle for everything you do.', moves: ['plank', 'deadBug', 'sidePlank', 'birdDog', 'bridge'] },
  { id: 'move-mobility', goal: 'move', title: 'Morning Mobility', blurb: 'Feel loose and light from head to toe.', moves: ['catCow', 'worldsGreatest', 'openBook', 'hamSweep', 'ankleCircles'] },
  { id: 'move-flow', goal: 'move', title: 'Stretch and Flow', blurb: 'Slow, smooth moves that open you up.', moves: ['hipFlexor', 'hamSweep', 'squatHold', 'openBook', 'shoulderRoll'] },
  { id: 'move-balance', goal: 'move', title: 'Balance and Control', blurb: 'Steadier on your feet every week.', moves: ['birdDog', 'hinge', 'calfRaise', 'clamshell', 'wallAngel'] },
];

export const GOAL_LABEL: Record<Goal, string> = { lose: 'Lose weight', recover: 'Heal & recover', stronger: 'Get stronger', move: 'Move better' };
export const LEVEL_LABEL: Record<Level, string> = { beginner: 'Beginner', regular: 'Regular', advanced: 'Advanced' };

const TIMING: Record<Level, { work: number; rest: number; rounds: number }> = {
  beginner: { work: 30, rest: 30, rounds: 2 },
  regular: { work: 40, rest: 20, rounds: 3 },
  advanced: { work: 45, rest: 15, rounds: 3 },
};

export interface Step { kind: 'work' | 'rest'; seconds: number; exercise: Exercise; phase: 'Warm up' | 'Workout' | 'Cool down'; round?: number; rounds?: number }

/** The full timed sequence for one workout at one level. */
export function buildSteps(w: Workout, level: Level, lowImpact: boolean): Step[] {
  const pick = (id: string): Exercise => {
    const e = X[id];
    return lowImpact && e.low ? { id: e.id, name: e.low.name, cue: e.low.cue } : e;
  };
  const t = TIMING[level];
  const steps: Step[] = WARMUP.map((id) => ({ kind: 'work', seconds: 30, exercise: pick(id), phase: 'Warm up' }));
  for (let r = 1; r <= t.rounds; r++) {
    w.moves.forEach((id, i) => {
      steps.push({ kind: 'work', seconds: t.work, exercise: pick(id), phase: 'Workout', round: r, rounds: t.rounds });
      const last = r === t.rounds && i === w.moves.length - 1;
      if (!last) {
        const nextId = i + 1 < w.moves.length ? w.moves[i + 1] : w.moves[0];
        steps.push({ kind: 'rest', seconds: t.rest, exercise: pick(nextId), phase: 'Workout', round: r, rounds: t.rounds });
      }
    });
  }
  COOLDOWN.forEach((id) => steps.push({ kind: 'work', seconds: 30, exercise: pick(id), phase: 'Cool down' }));
  return steps;
}

export const totalSeconds = (steps: Step[]) => steps.reduce((s, x) => s + x.seconds, 0);
export const workoutMinutes = (w: Workout, level: Level) => Math.round(totalSeconds(buildSteps(w, level, false)) / 60);

/** Today's suggested workout: rotates through the member's goal workouts by day. */
export function todaysWorkout(goal: Goal, doneCount: number): Workout {
  const list = WORKOUTS.filter((w) => w.goal === goal);
  return list[doneCount % list.length];
}

export const exerciseCount = (w: Workout) => w.moves.length;
