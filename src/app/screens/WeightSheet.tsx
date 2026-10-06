import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Unit } from '../lib/model';

export function WeightSheet({ unit, initial, onClose, onSave }: { unit: Unit; initial: number | null; onClose: () => void; onSave: (v: number) => void }) {
  const [value, setValue] = useState(initial ?? (unit === 'lb' ? 170 : 77));
  const ref = useRef<HTMLDivElement>(null);
  const step = unit === 'lb' ? 0.2 : 0.1;
  const round = (n: number) => Math.round(n * 10) / 10;

  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Log your weight">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="rise-in relative w-full max-w-xl rounded-t-[28px] px-6 pt-6 pb-[max(28px,env(safe-area-inset-bottom))]" style={{ background: 'var(--ground-2)' }}>
        <div className="flex items-center justify-between">
          <h2 className="display text-[26px] font-extrabold">Today's weight</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2"><X aria-hidden="true" /></button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <button type="button" className="btn btn-raised w-16 h-16 !p-0 rounded-full" aria-label="Less" onClick={() => setValue((v) => round(v - step))}><Minus aria-hidden="true" /></button>
          <label className="text-center">
            <span className="sr-only">Weight in {unit}</span>
            <input
              className="num bg-transparent text-center text-[64px] font-extrabold w-[4.5ch] focus:outline-none"
              inputMode="decimal" value={value}
              onChange={(e) => { const n = Number(e.target.value.replace(/[^\d.]/g, '')); if (!Number.isNaN(n)) setValue(n); }}
            />
            <span className="block font-bold" style={{ color: 'var(--muted)' }}>{unit}</span>
          </label>
          <button type="button" className="btn btn-raised w-16 h-16 !p-0 rounded-full" aria-label="More" onClick={() => setValue((v) => round(v + step))}><Plus aria-hidden="true" /></button>
        </div>
        <button className="btn btn-sun w-full mt-8" disabled={!(value >= 40 && value <= 900)} onClick={() => onSave(round(value))}>Save</button>
      </div>
    </div>
  );
}
