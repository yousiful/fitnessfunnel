import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

// The signature move: today's progress (0..1) is the height of the sun above the horizon,
// and the sky warms from pre-dawn indigo to gold as it climbs. Pass `from` to watch it rise.

const LAYERS = [
  'linear-gradient(180deg, #0E0B28 0%, #16123A 45%, #3B2A6B 85%, #5A3470 100%)', // pre-dawn
  'linear-gradient(180deg, #1C1647 0%, #4B2C6E 40%, #B2486C 78%, #FF6B4A 100%)', // sunrise
  'linear-gradient(180deg, #3B2A6B 0%, #C2507A 32%, #FF7A4A 64%, #FFB23F 100%)', // sun's up
];

const clamp = (n: number) => Math.max(0, Math.min(1, n));

function layerOpacity(p: number, i: number) {
  if (i === 0) return 1;
  if (i === 1) return Math.min(1, p / 0.5);
  return Math.max(0, (p - 0.5) / 0.5);
}

interface SkyProps {
  progress: number;
  /** Start the sun here and let it climb to `progress` after mount. */
  from?: number;
  height?: string;
  minHeight?: number;
  sunSize?: number;
  /** Horizontal sun position, as a percent of the width. */
  sunX?: number;
  children?: ReactNode;
  className?: string;
}

export function Sky({ progress, from, height = '50vh', minHeight = 0, sunSize = 132, sunX = 50, children, className = '' }: SkyProps) {
  const target = clamp(progress);
  const [shown, setShown] = useState(from != null ? clamp(from) : target);
  const [h, setH] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setH(el.clientHeight);
    const ro = new ResizeObserver(() => setH(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Two frames so the starting position paints before the climb begins.
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(() => setShown(target)); });
    return () => cancelAnimationFrame(id);
  }, [target]);

  const glow = 0.25 + shown * 0.75;
  const climb = shown * 0.62 * h;

  return (
    <div ref={box} className={`relative ${className}`} style={{ height, minHeight }}>
      <div className="absolute inset-0 overflow-hidden">
        {LAYERS.map((bg, i) => (
          <div key={i} aria-hidden="true" className="absolute inset-0" style={{ background: bg, opacity: layerOpacity(shown, i), transition: 'opacity 1800ms var(--ease-out)' }} />
        ))}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: `${sunX}%`, bottom: -sunSize / 2, width: sunSize, height: sunSize,
            transform: `translate(-50%, ${-climb}px)`,
            transition: h ? 'transform 2000ms var(--ease-out)' : 'none',
          }}
        >
          <div className="absolute rounded-full" style={{ inset: -sunSize * 0.9, background: `radial-gradient(circle, rgba(255,178,63,${0.55 * glow}) 0%, rgba(255,107,74,${0.25 * glow}) 35%, transparent 70%)` }} />
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 40%, #FFF1C9 0%, #FFC861 45%, #FF9A3D 100%)', boxShadow: '0 0 60px rgba(255,190,90,0.55)' }} />
        </div>
      </div>
      {/* The horizon, and the warm light it throws onto the ground below. */}
      <div aria-hidden="true" className="absolute left-0 right-0 bottom-0 z-[1]" style={{ height: 2, background: 'rgba(255,243,226,0.55)' }} />
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-0 translate-y-full pointer-events-none"
        style={{ height: 260, background: `linear-gradient(180deg, rgba(255,140,80,${0.08 + shown * 0.22}), transparent)`, transition: 'background 1800ms' }}
      />
      <div className="relative h-full z-[2]">{children}</div>
    </div>
  );
}

export type SunState = 'full' | 'half' | 'none' | 'future';

/** Sun as a state shape: full disc, half risen, unlit dawn arc, or a quiet future dot. */
export function SunGlyph({ state, size = 34, today = false, label }: { state: SunState; size?: number; today?: boolean; label?: string }) {
  const r = size / 2;
  const id = `clip-${state}-${size}`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
      <defs>
        <clipPath id={id}><rect x="0" y="0" width={size} height={r} /></clipPath>
        <radialGradient id="sunfill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF1C9" /><stop offset="55%" stopColor="#FFC861" /><stop offset="100%" stopColor="#FF8A3D" />
        </radialGradient>
      </defs>
      {today && <circle cx={r} cy={r} r={r - 1} fill="none" stroke="var(--cream)" strokeWidth="1.5" strokeDasharray="2 3" />}
      {state === 'full' && <circle cx={r} cy={r} r={r * 0.62} fill="url(#sunfill)" />}
      {state === 'half' && (
        <>
          <circle cx={r} cy={r} r={r * 0.62} fill="none" stroke="#FFB23F" strokeWidth="1.5" />
          <circle cx={r} cy={r} r={r * 0.62} fill="#FFB23F" clipPath={`url(#${id})`} />
          <line x1={r * 0.2} x2={size - r * 0.2} y1={r} y2={r} stroke="#FFB23F" strokeWidth="1.5" />
        </>
      )}
      {state === 'none' && (
        <>
          <path d={`M ${r - r * 0.62} ${r} A ${r * 0.62} ${r * 0.62} 0 0 1 ${r + r * 0.62} ${r}`} fill="none" stroke="var(--faint)" strokeWidth="1.5" />
          <line x1={r * 0.2} x2={size - r * 0.2} y1={r} y2={r} stroke="var(--faint)" strokeWidth="1.5" />
        </>
      )}
      {state === 'future' && <circle cx={r} cy={r} r={2.5} fill="var(--faint)" />}
    </svg>
  );
}

/** Short sky band that opens the secondary tabs, so the world reaches every screen. */
export function SkyBand({ progress, title, subtitle }: { progress: number; title: string; subtitle?: ReactNode }) {
  return (
    <Sky progress={progress} height="20vh" minHeight={150} sunSize={64} sunX={84}>
      <div className="h-full flex flex-col justify-end px-5 pb-4 max-w-xl mx-auto w-full">
        <h1 className="display text-[40px] font-extrabold leading-tight" style={{ color: progress >= 0.8 ? 'var(--night)' : 'var(--cream)' }}>{title}</h1>
        {subtitle && <p className="font-semibold" style={{ color: progress >= 0.8 ? 'var(--night)' : 'var(--muted)' }}>{subtitle}</p>}
      </div>
    </Sky>
  );
}
