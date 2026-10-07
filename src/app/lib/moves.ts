// Stick-figure demos for every move. Each pose is a set of absolute segment angles
// (0 = pointing down, 90 = forward/right, 180 = up, -90 = back/left); the figure is solved,
// set on the floor and anchored so feet (or hands, or hips) stay put while it moves.

export type Angles = [number, number]; // [upper segment, lower segment]
export interface Pose {
  t: number;          // torso, hip -> neck
  la: Angles; ra: Angles; // near arm, far arm (side view) / left, right (front view)
  ll: Angles; rl: Angles; // near leg, far leg / left, right
  hd?: number;        // head tilt relative to torso
  lift?: number;      // airborne height (jumps, calf raises)
}
export type Anchor = 'foot' | 'hand' | 'hip' | 'knee';
export type Prop = { kind: 'chair' | 'wall' | 'counter'; at: 'hand' | 'hip' | 'elbow' | 'neck' };
export interface Demo { poses: Pose[]; ms: number; anchor: Anchor; front?: boolean; prop?: Prop }

const p = (t: number, la: Angles, ra: Angles, ll: Angles, rl: Angles, o: Partial<Pose> = {}): Pose => ({ t, la, ra, ll, rl, ...o });

// Reused shapes
const STAND = p(180, [0, 0], [0, 0], [0, 0], [0, 0]);
const ARMS_FWD = p(180, [90, 90], [90, 90], [0, 0], [0, 0]);
const SQUAT = p(145, [90, 90], [90, 90], [80, -15], [80, -15]);
const PLANK = p(102, [0, 0], [0, 0], [-79, -79], [-79, -79]);
const FOREARM_PLANK = p(98, [0, 90], [0, 90], [-81, -81], [-81, -81]);
const PLANK_LOW = p(97, [-38, 32], [-38, 32], [-84, -84], [-84, -84]);
const ALL_FOURS = p(90, [0, 0], [0, 0], [0, -90], [0, -90]);
const ON_BACK_KNEES = p(-90, [90, 90], [90, 90], [140, 25], [140, 25]);
const SEATED = p(180, [60, 90], [60, 90], [90, 0], [90, 0]);
const LUNGE = p(180, [0, 0], [0, 0], [88, 0], [-12, -95]);
const HALF_KNEEL = p(180, [-30, 40], [-30, 40], [88, 0], [0, -92]);

export const DEMOS: Record<string, Demo> = {
  // Warm up
  march: { ms: 1100, anchor: 'foot', poses: [p(180, [-30, -10], [30, 50], [70, 0], [0, 0]), p(180, [30, 50], [-30, -10], [0, 0], [70, 0])] },
  armCircles: { ms: 900, anchor: 'foot', front: true, poses: [p(180, [-78, -78], [78, 78], [-6, -6], [6, 6]), p(180, [-102, -102], [102, 102], [-6, -6], [6, 6])] },
  hipCircles: { ms: 1500, anchor: 'foot', front: true, poses: [p(172, [-35, 30], [35, -30], [-10, -10], [14, 14]), p(188, [-35, 30], [35, -30], [-14, -14], [10, 10])] },
  torsoTwist: { ms: 1300, anchor: 'foot', front: true, poses: [p(180, [-70, -100], [30, 10], [-10, -10], [10, 10]), p(180, [-30, -10], [70, 100], [-10, -10], [10, 10])] },

  // Cardio
  jacks: { ms: 800, anchor: 'hip', front: true, poses: [p(180, [-8, -5], [8, 5], [-5, -5], [5, 5]), p(180, [-150, -170], [150, 170], [-22, -22], [22, 22], { lift: 5 })] },
  jacks_low: { ms: 1100, anchor: 'hip', front: true, poses: [p(180, [-8, -5], [8, 5], [-4, -4], [4, 4]), p(180, [-150, -170], [150, 170], [-4, -4], [26, 26]), p(180, [-8, -5], [8, 5], [-4, -4], [4, 4]), p(180, [-150, -170], [150, 170], [-26, -26], [4, 4])] },
  highKnees: { ms: 600, anchor: 'hip', poses: [p(180, [-35, 55], [35, 150], [100, 0], [-5, -15], { lift: 3 }), p(180, [35, 150], [-35, 55], [-5, -15], [100, 0], { lift: 3 })] },
  highKnees_low: { ms: 1100, anchor: 'foot', poses: [p(180, [10, 10], [60, 105], [98, 0], [0, 0]), p(180, [60, 105], [10, 10], [0, 0], [98, 0])] },
  buttKicks: { ms: 600, anchor: 'hip', poses: [p(180, [-30, 60], [30, 120], [0, -160], [0, 0], { lift: 3 }), p(180, [30, 120], [-30, 60], [0, 0], [0, -160], { lift: 3 })] },
  buttKicks_low: { ms: 1300, anchor: 'foot', prop: { kind: 'wall', at: 'hand' }, poses: [p(175, [95, 95], [95, 95], [0, 0], [0, 0]), p(175, [95, 95], [95, 95], [0, 0], [-5, -150])] },
  skaters: { ms: 1000, anchor: 'hip', front: true, poses: [p(160, [-60, -40], [30, 60], [-8, 4], [-35, -25], { lift: 2 }), p(200, [-30, -60], [60, 40], [35, 25], [8, -4], { lift: 2 })] },
  skaters_low: { ms: 1300, anchor: 'hip', front: true, poses: [p(170, [-20, -10], [150, 160], [-24, -24], [4, 4]), p(190, [-150, -160], [20, 10], [-4, -4], [24, 24])] },
  climbers: { ms: 650, anchor: 'hand', poses: [p(102, [0, 0], [0, 0], [25, -60], [-79, -79]), p(102, [0, 0], [0, 0], [-79, -79], [25, -60])] },
  climbers_low: { ms: 1000, anchor: 'hand', prop: { kind: 'chair', at: 'hand' }, poses: [p(125, [10, 10], [10, 10], [40, -50], [-55, -55]), p(125, [10, 10], [10, 10], [-55, -55], [40, -50])] },
  burpee: { ms: 900, anchor: 'hand', poses: [p(180, [0, 0], [0, 0], [0, 0], [0, 0]), SQUAT, p(140, [10, 0], [10, 0], [75, -40], [75, -40]), PLANK, p(140, [10, 0], [10, 0], [75, -40], [75, -40]), p(180, [175, 178], [175, 178], [0, 0], [0, 0], { lift: 7 })] },
  burpee_low: { ms: 1100, anchor: 'hand', poses: [STAND, p(140, [10, 0], [10, 0], [75, -40], [75, -40]), p(110, [0, 0], [0, 0], [75, -40], [-75, -75]), PLANK, p(110, [0, 0], [0, 0], [75, -40], [-75, -75]), STAND] },
  squatJump: { ms: 800, anchor: 'foot', poses: [SQUAT, p(180, [-10, -10], [-10, -10], [0, 0], [0, 0], { lift: 9 })] },
  squatJump_low: { ms: 1100, anchor: 'foot', poses: [SQUAT, p(180, [90, 90], [90, 90], [0, 0], [0, 0], { lift: 3 })] },
  punches: { ms: 500, anchor: 'foot', poses: [p(180, [90, 90], [40, 150], [12, 0], [-12, 0]), p(180, [40, 150], [90, 90], [12, 0], [-12, 0])] },

  // Strength
  squat: { ms: 1600, anchor: 'foot', poses: [ARMS_FWD, SQUAT] },
  squat_low: { ms: 1800, anchor: 'foot', prop: { kind: 'chair', at: 'hip' }, poses: [p(160, [20, 20], [20, 20], [90, 0], [90, 0]), p(180, [0, 0], [0, 0], [0, 0], [0, 0])] },
  pushup: { ms: 1500, anchor: 'hand', poses: [PLANK, PLANK_LOW] },
  pushup_low: { ms: 1500, anchor: 'foot', prop: { kind: 'wall', at: 'hand' }, poses: [p(155, [100, 100], [100, 100], [-25, -25], [-25, -25]), p(150, [55, 145], [55, 145], [-30, -30], [-30, -30])] },
  lunge: { ms: 1600, anchor: 'foot', poses: [STAND, LUNGE] },
  lunge_low: { ms: 1600, anchor: 'foot', prop: { kind: 'chair', at: 'hand' }, poses: [p(180, [40, 0], [0, 0], [25, 0], [-20, -20]), p(180, [40, 0], [0, 0], [55, -5], [-10, -60])] },
  bridge: { ms: 1700, anchor: 'foot', poses: [ON_BACK_KNEES, p(-72, [80, 80], [80, 80], [115, 15], [115, 15])] },
  plank: { ms: 2400, anchor: 'hand', poses: [FOREARM_PLANK, { ...FOREARM_PLANK, t: 100 }] },
  plank_low: { ms: 2400, anchor: 'foot', prop: { kind: 'counter', at: 'elbow' }, poses: [p(135, [0, 90], [0, 90], [-45, -45], [-45, -45]), p(137, [0, 90], [0, 90], [-43, -43], [-43, -43])] },
  superman: { ms: 1700, anchor: 'hip', poses: [p(90, [90, 90], [90, 90], [-90, -90], [-90, -90]), p(97, [100, 100], [100, 100], [-98, -98], [-98, -98])] },
  superman_low: { ms: 1700, anchor: 'knee', poses: [ALL_FOURS, p(90, [95, 95], [0, 0], [0, -90], [-95, -95])] },
  dips: { ms: 1600, anchor: 'foot', prop: { kind: 'chair', at: 'hand' }, poses: [p(180, [-15, -5], [-15, -5], [70, 0], [70, 0]), p(178, [-70, 10], [-70, 10], [95, 15], [95, 15])] },
  dips_low: { ms: 1600, anchor: 'foot', prop: { kind: 'chair', at: 'hand' }, poses: [p(180, [-15, -5], [-15, -5], [60, -20], [60, -20]), p(178, [-60, 10], [-60, 10], [90, -15], [90, -15])] },
  calfRaise: { ms: 1500, anchor: 'foot', prop: { kind: 'wall', at: 'hand' }, poses: [p(180, [80, 90], [80, 90], [0, 0], [0, 0]), p(180, [80, 90], [80, 90], [0, 0], [0, 0], { lift: 4 })] },
  wallSit: { ms: 2600, anchor: 'foot', prop: { kind: 'wall', at: 'hip' }, poses: [p(180, [0, 0], [0, 0], [90, 0], [90, 0]), p(180, [60, 60], [60, 60], [90, 0], [90, 0])] },
  wallSit_low: { ms: 2600, anchor: 'foot', prop: { kind: 'wall', at: 'hip' }, poses: [p(180, [0, 0], [0, 0], [45, -10], [45, -10]), p(180, [40, 40], [40, 40], [45, -10], [45, -10])] },
  sidePlank: { ms: 2200, anchor: 'hand', front: true, poses: [p(110, [0, 90], [180, 180], [-72, -72], [-72, -72]), p(105, [0, 90], [180, 180], [-75, -75], [-75, -75])] },
  sidePlank_low: { ms: 2200, anchor: 'hand', front: true, poses: [p(115, [0, 90], [180, 180], [-50, -110], [-50, -110]), p(110, [0, 90], [180, 180], [-55, -110], [-55, -110])] },

  // Recover and mobility
  catCow: { ms: 2600, anchor: 'knee', poses: [p(84, [0, 0], [0, 0], [0, -90], [0, -90], { hd: 45 }), p(96, [0, 0], [0, 0], [0, -90], [0, -90], { hd: -25 })] },
  birdDog: { ms: 1900, anchor: 'knee', poses: [ALL_FOURS, p(90, [95, 95], [0, 0], [0, -90], [-95, -95])] },
  deadBug: { ms: 1900, anchor: 'hip', poses: [p(-90, [180, 180], [180, 180], [180, 90], [180, 90]), p(-90, [-105, -100], [180, 180], [180, 90], [100, 95])] },
  clamshell: { ms: 1600, anchor: 'hip', front: true, poses: [p(-90, [100, 140], [90, 90], [130, 40], [128, 38]), p(-90, [100, 140], [90, 90], [170, 50], [128, 38])] },
  wallAngel: { ms: 1900, anchor: 'foot', front: true, poses: [p(180, [-90, -180], [90, 180], [-6, -6], [6, 6]), p(180, [-150, -175], [150, 175], [-6, -6], [6, 6])] },
  heelSlide: { ms: 1800, anchor: 'hip', poses: [p(-90, [90, 90], [90, 90], [90, 90], [90, 90]), p(-90, [90, 90], [90, 90], [140, 25], [90, 90])] },
  legExt: { ms: 1700, anchor: 'hip', prop: { kind: 'chair', at: 'hip' }, poses: [SEATED, p(180, [60, 90], [60, 90], [90, 88], [90, 0])] },
  shoulderRoll: { ms: 1800, anchor: 'foot', poses: [p(180, [-15, -15], [-15, -15], [0, 0], [0, 0], { hd: -6 }), p(180, [15, 15], [15, 15], [0, 0], [0, 0], { hd: 6 })] },
  hinge: { ms: 1700, anchor: 'foot', poses: [p(180, [-40, 70], [-40, 70], [0, 0], [0, 0]), p(110, [-5, 100], [-5, 100], [12, -8], [12, -8])] },
  hipFlexor: { ms: 2400, anchor: 'knee', poses: [HALF_KNEEL, p(184, [-30, 40], [-30, 40], [70, -10], [-18, -100])] },
  hipFlexor_low: { ms: 2400, anchor: 'foot', prop: { kind: 'chair', at: 'hand' }, poses: [p(180, [45, 5], [0, 0], [10, 0], [-25, -25]), p(185, [45, 5], [0, 0], [25, -5], [-30, -30])] },
  worldsGreatest: { ms: 2200, anchor: 'foot', poses: [p(140, [10, 0], [10, 0], [80, -5], [-60, -60]), p(140, [10, 0], [180, 180], [80, -5], [-60, -60])] },
  worldsGreatest_low: { ms: 2200, anchor: 'foot', prop: { kind: 'chair', at: 'hand' }, poses: [p(180, [40, 10], [0, 0], [30, 0], [-20, -20]), p(180, [40, 10], [175, 175], [35, -5], [-20, -20])] },
  openBook: { ms: 2400, anchor: 'hip', poses: [p(-90, [180, 180], [180, 180], [140, 40], [138, 38], { hd: 0 }), p(-90, [180, 180], [-130, -150], [140, 40], [138, 38], { hd: -20 })] },
  ankleCircles: { ms: 1300, anchor: 'hip', prop: { kind: 'chair', at: 'hip' }, poses: [p(180, [40, 90], [40, 90], [80, 60], [90, 0]), p(180, [40, 90], [40, 90], [80, 85], [90, 0])] },
  squatHold: { ms: 2600, anchor: 'foot', poses: [p(155, [45, 80], [45, 80], [110, -25], [110, -25]), p(158, [45, 85], [45, 85], [108, -25], [108, -25])] },
  squatHold_low: { ms: 2600, anchor: 'foot', prop: { kind: 'wall', at: 'hand' }, poses: [p(160, [90, 90], [90, 90], [70, -15], [70, -15]), p(165, [90, 90], [90, 90], [60, -10], [60, -10])] },
  hamSweep: { ms: 1800, anchor: 'foot', poses: [p(180, [-10, -10], [-10, -10], [25, 25], [0, 0]), p(120, [30, 40], [30, 40], [25, 25], [12, -8])] },
  forwardFold: { ms: 2600, anchor: 'foot', poses: [p(180, [0, 0], [0, 0], [0, 0], [0, 0]), p(25, [10, 10], [10, 10], [8, -6], [8, -6], { hd: 10 })] },
  forwardFold_low: { ms: 2600, anchor: 'hip', prop: { kind: 'chair', at: 'hip' }, poses: [SEATED, p(125, [60, 60], [60, 60], [90, 0], [90, 0])] },
  chestOpen: { ms: 2400, anchor: 'foot', poses: [p(180, [-25, -15], [-25, -15], [0, 0], [0, 0]), p(186, [-50, -35], [-50, -35], [0, 0], [0, 0], { hd: -10 })] },
  breathe: { ms: 4200, anchor: 'foot', front: true, poses: [p(180, [-12, -6], [12, 6], [-6, -6], [6, 6]), p(180, [-40, -30], [40, 30], [-6, -6], [6, 6], { hd: -4 })] },
};

// Segment lengths in a 100x100 box.
const L = { torso: 24, neck: 3, head: 5.5, upper: 12, fore: 11, thigh: 16, shin: 16 };
export const FLOOR = 92;
type Pt = [number, number];
const v = (deg: number): Pt => { const r = (deg * Math.PI) / 180; return [Math.sin(r), Math.cos(r)]; };
const add = (a: Pt, d: number, deg: number): Pt => { const u = v(deg); return [a[0] + u[0] * d, a[1] + u[1] * d]; };

export interface Body {
  hip: Pt; neck: Pt; head: Pt;
  la: [Pt, Pt]; ra: [Pt, Pt]; ll: [Pt, Pt]; rl: [Pt, Pt]; // [elbow/knee, hand/foot]
}

/** Solves a pose into points, standing on the floor with the anchor at x = ax. */
export function solve(pose: Pose, anchor: Anchor, ax = 50): Body {
  const hip: Pt = [0, 0];
  const neck = add(hip, L.torso, pose.t);
  const head = add(neck, L.neck + L.head, pose.t + (pose.hd || 0));
  const limb = (from: Pt, a: Angles, l1: number, l2: number): [Pt, Pt] => { const j = add(from, l1, a[0]); return [j, add(j, l2, a[1])]; };
  const b: Body = {
    hip, neck, head,
    la: limb(neck, pose.la, L.upper, L.fore), ra: limb(neck, pose.ra, L.upper, L.fore),
    ll: limb(hip, pose.ll, L.thigh, L.shin), rl: limb(hip, pose.rl, L.thigh, L.shin),
  };
  const pts: Pt[] = [hip, neck, [head[0], head[1] + L.head], b.la[0], b.la[1], b.ra[0], b.ra[1], b.ll[0], b.ll[1], b.rl[0], b.rl[1]];
  const dy = FLOOR - Math.max(...pts.map((q) => q[1])) - (pose.lift || 0);
  const ref = anchor === 'foot' ? b.ll[1] : anchor === 'hand' ? b.la[1] : anchor === 'knee' ? b.ll[0] : hip;
  const dx = ax - ref[0];
  const mv = (q: Pt): Pt => [q[0] + dx, q[1] + dy];
  return {
    hip: mv(hip), neck: mv(neck), head: mv(head),
    la: [mv(b.la[0]), mv(b.la[1])], ra: [mv(b.ra[0]), mv(b.ra[1])],
    ll: [mv(b.ll[0]), mv(b.ll[1])], rl: [mv(b.rl[0]), mv(b.rl[1])],
  };
}

const lerpA = (a: Angles, b: Angles, k: number): Angles => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
export function lerpPose(a: Pose, b: Pose, k: number): Pose {
  return {
    t: a.t + (b.t - a.t) * k, la: lerpA(a.la, b.la, k), ra: lerpA(a.ra, b.ra, k), ll: lerpA(a.ll, b.ll, k), rl: lerpA(a.rl, b.rl, k),
    hd: (a.hd || 0) + ((b.hd || 0) - (a.hd || 0)) * k, lift: (a.lift || 0) + ((b.lift || 0) - (a.lift || 0)) * k,
  };
}

/** Pose at time ms: hold briefly on each keyframe, ease between them, loop. */
export function poseAt(d: Demo, ms: number): Pose {
  const n = d.poses.length;
  const per = d.ms;
  const total = per * n;
  const tt = ((ms % total) + total) % total;
  const i = Math.floor(tt / per);
  const local = (tt - i * per) / per;
  const hold = 0.18;
  const k = local < hold ? 0 : (local - hold) / (1 - hold);
  const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  return lerpPose(d.poses[i], d.poses[(i + 1) % n], e);
}

/** A YouTube search for a form demo; never goes stale the way a single video link can. */
export const videoSearchUrl = (name: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} exercise how to proper form`)}`;
