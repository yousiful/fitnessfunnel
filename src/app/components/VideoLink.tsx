import { PlayCircle } from 'lucide-react';
import { videoSearchUrl } from '../lib/moves';

/** Opens YouTube demos of the move in a new tab (pausing the workout first, if asked). */
export function VideoLink({ name, onOpen }: { name: string; onOpen?: () => void }) {
  return (
    <a
      href={videoSearchUrl(name)} target="_blank" rel="noopener noreferrer" onClick={onOpen}
      className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
      style={{ color: 'var(--sun)' }}
    >
      <PlayCircle className="w-[18px] h-[18px]" aria-hidden="true" /> Watch a video demo
    </a>
  );
}
