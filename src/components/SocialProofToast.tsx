import { useState, useEffect, useRef } from 'react';

const FIRST_NAMES = [
  'James', 'Maria', 'David', 'Jessica', 'Chris', 'Ashley', 'Mike', 'Sarah',
  'Robert', 'Lisa', 'Daniel', 'Emily', 'Kevin', 'Nicole', 'Brian', 'Amanda',
  'Jason', 'Stephanie', 'Ryan', 'Michelle', 'Marcus', 'Tanya', 'Derek', 'Rachel',
  'Tony', 'Angela', 'Steve', 'Kim', 'Carlos', 'Diana', 'Andre', 'Priya',
  'Omar', 'Yuki', 'Jamal', 'Rosa', 'Tyler', 'Hannah', 'Nathan', 'Brooke',
];

const LAST_INITIALS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');

const CITIES = [
  'Houston, TX', 'Miami, FL', 'Atlanta, GA', 'Chicago, IL', 'Phoenix, AZ',
  'Dallas, TX', 'Denver, CO', 'Nashville, TN', 'Charlotte, NC', 'Seattle, WA',
  'Portland, OR', 'San Diego, CA', 'Austin, TX', 'Tampa, FL', 'Columbus, OH',
  'Detroit, MI', 'Memphis, TN', 'Las Vegas, NV', 'Baltimore, MD', 'Sacramento, CA',
];

const ACTIONS = [
  { text: 'just joined the Health Club', emoji: '🎉' },
  { text: 'started their figure design plan', emoji: '💪' },
  { text: 'signed up for remote coaching', emoji: '🏋️' },
  { text: 'joined the community', emoji: '🤝' },
  { text: 'started their weight loss journey', emoji: '🔥' },
  { text: 'got matched with a coach', emoji: '⭐' },
  { text: 'completed their first workout', emoji: '✅' },
  { text: 'hit their weekly goal', emoji: '🎯' },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMinutesAgo(): string {
  const n = Math.floor(Math.random() * 45) + 1;
  if (n <= 2) return 'just now';
  return `${n} min ago`;
}

function generateNotification() {
  const first = randomFrom(FIRST_NAMES);
  const initial = randomFrom(LAST_INITIALS);
  const city = randomFrom(CITIES);
  const action = randomFrom(ACTIONS);
  const time = randomMinutesAgo();
  return { first, initial, city, action, time, id: Math.random() };
}

export function SocialProofToast() {
  const [current, setCurrent] = useState<ReturnType<typeof generateNotification> | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const show = () => {
      const notif = generateNotification();
      setCurrent(notif);
      setVisible(true);

      // Hide after 6 seconds
      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    // First notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      show();
      // Then every 25 seconds
      timerRef.current = setInterval(show, 25000);
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!current || !visible) return null;

  return (
    <div
      className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-50 pointer-events-none"
      style={{ animation: visible ? 'slideInLeft 0.4s ease-out' : 'slideOutLeft 0.3s ease-in' }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 max-w-[260px] sm:max-w-[300px] pointer-events-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow">
            {current.first[0]}{current.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-sm font-semibold leading-tight">
              {current.first} {current.initial}.{' '}
              <span className="font-normal text-gray-600">{current.action.text}</span>
              {' '}{current.action.emoji}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-400 text-xs">{current.city}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-gray-400 text-xs">{current.time}</span>
            </div>
          </div>
        </div>

        {/* Progress bar that drains */}
        <div className="mt-2 h-[2px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            style={{
              animation: 'drainBar 6s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-120%); opacity: 0; }
        }
        @keyframes drainBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
