import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MoveDemo } from './MoveDemo';
import { HOWTO } from '../lib/howto';
import { VIDEOS } from '../lib/videos';

const base = (key: string) => key.replace(/_low$/, '');

/** Full how-to for one move: a real video demo, the animated figure and step-by-step instructions. */
export function HowToSheet({ demo, name, onClose }: { demo: string; name: string; onClose: () => void }) {
  const how = HOWTO[demo] || HOWTO[base(demo)];
  const video = VIDEOS[demo] || VIDEOS[base(demo)];
  const [playVideo, setPlayVideo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={`How to do ${name}`}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="rise-in relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-[28px] px-5 pt-5 pb-[max(28px,env(safe-area-inset-bottom))]" style={{ background: 'var(--ground-2)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--sun)' }}>How to do it</p>
            <h2 className="display text-[28px] leading-tight font-extrabold">{name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 -mr-2"><X aria-hidden="true" /></button>
        </div>

        {video && (
          <div className="mt-4 rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16 / 9', background: 'var(--ground)' }}>
            {playVideo ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${name} video demo`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              // Thumbnail first so the sheet opens instantly and nothing loads from YouTube until they tap.
              <button type="button" onClick={() => setPlayVideo(true)} className="absolute inset-0 w-full h-full group" aria-label={`Play video demo of ${name}`}>
                <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-90" loading="lazy" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="w-16 h-16 rounded-full grid place-items-center" style={{ background: 'var(--sun)', color: 'var(--night)' }}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        )}
        {video && <p className="mt-2 text-[13px]" style={{ color: 'var(--faint)' }}>Video: {video.channel}</p>}

        <div className="mt-4 flex gap-4 items-start">
          <MoveDemo demo={demo} size={110} className="shrink-0 rounded-2xl" />
          {how && (
            <ol className="flex-1 space-y-2.5">
              {how.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-[16px] leading-snug">
                  <span className="num shrink-0 w-6 h-6 rounded-full grid place-items-center text-[13px] font-bold" style={{ background: 'var(--ground-3)', color: 'var(--sun)' }}>{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {how && (
          <p className="mt-4 panel px-4 py-3 text-[15px]" style={{ background: 'var(--ground-3)' }}>
            <span className="font-bold" style={{ color: 'var(--sun)' }}>Tip: </span>{how.tip}
          </p>
        )}
      </div>
    </div>
  );
}
