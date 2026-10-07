import { useEffect, useMemo, useState } from 'react';
import { DEMOS, FLOOR, poseAt, solve, type Body, type Demo } from '../lib/moves';

const reducedMotion = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };

/** Animated stick figure showing how to do a move. Falls back to nothing for unknown moves. */
export function MoveDemo({ demo, size = 180, playing = true, className = '' }: { demo: string; size?: number; playing?: boolean; className?: string }) {
  const d = DEMOS[demo] || DEMOS[demo.replace(/_low$/, '')];
  const [ms, setMs] = useState(0);
  const animate = playing && !reducedMotion();

  useEffect(() => {
    if (!d || !animate) return;
    let raf = 0; const start = performance.now();
    const tick = (now: number) => { setMs(now - start); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [d, animate]);

  const prop = useMemo(() => (d ? propShape(d) : null), [d]);
  if (!d) return null;
  // Still frame for reduced motion: the working position (second keyframe).
  const body = solve(animate ? poseAt(d, ms) : d.poses[Math.min(1, d.poses.length - 1)], d.anchor);

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label="Animated demo of the move">
      <line x1="4" y1={FLOOR + 2.4} x2="96" y2={FLOOR + 2.4} stroke="var(--line-strong)" strokeWidth="1.2" strokeLinecap="round" />
      {prop}
      <Figure b={body} front={!!d.front} />
    </svg>
  );
}

function Figure({ b, front }: { b: Body; front: boolean }) {
  const seg = (a: [number, number], c: [number, number], far: boolean, key: string) => (
    <line key={key} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="var(--cream)" strokeOpacity={far && !front ? 0.42 : 1} strokeWidth="3.6" strokeLinecap="round" />
  );
  const limb = (from: [number, number], l: [[number, number], [number, number]], far: boolean, key: string) =>
    [seg(from, l[0], far, key + 'a'), seg(l[0], l[1], far, key + 'b')];
  return (
    <g strokeLinejoin="round">
      {limb(b.neck, b.ra, true, 'ra')}
      {limb(b.hip, b.rl, true, 'rl')}
      {seg(b.hip, b.neck, false, 't')}
      {limb(b.hip, b.ll, false, 'll')}
      {limb(b.neck, b.la, false, 'la')}
      <circle cx={b.head[0]} cy={b.head[1]} r="5.5" fill="var(--sun)" />
    </g>
  );
}

/** Chair, wall or counter, placed against the body in the first keyframe. */
function propShape(d: Demo) {
  if (!d.prop) return null;
  const b = solve(d.poses[0], d.anchor);
  const at = d.prop.at === 'hand' ? b.la[1] : d.prop.at === 'elbow' ? b.la[0] : d.prop.at === 'neck' ? b.neck : b.hip;
  const s = { stroke: 'var(--faint)', strokeWidth: 2, strokeLinecap: 'round' as const, fill: 'none' };
  const floor = FLOOR + 2.4;
  if (d.prop.kind === 'wall') {
    // A wall in front of the hands, or behind the back for wall sits.
    const x = d.prop.at === 'hand' ? at[0] + 2.5 : at[0] - 2.5;
    return <line x1={x} y1={14} x2={x} y2={floor} {...s} strokeWidth={2.4} />;
  }
  if (d.prop.kind === 'counter') {
    const y = at[1] + 1.5;
    return <path d={`M${at[0] - 6} ${y} H${at[0] + 22} M${at[0] + 18} ${y} V${floor}`} {...s} />;
  }
  // Chair: seat at the anchor height, back on the side away from the body's front.
  const y = d.prop.at === 'hip' ? at[1] + 2 : at[1] + 1;
  // Sitting: seat runs forward under the thighs. Hands on it: seat centered under the hands.
  const x0 = d.prop.at === 'hip' ? at[0] - 4 : at[0] - 7, x1 = d.prop.at === 'hip' ? at[0] + 12 : at[0] + 7;
  const backX = d.prop.at === 'hip' ? x0 : x1;
  return <path d={`M${x0} ${y} H${x1} M${x0 + 1} ${y} V${floor} M${x1 - 1} ${y} V${floor} M${backX} ${y} V${y - 16}`} {...s} />;
}
