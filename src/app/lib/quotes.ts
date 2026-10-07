// Short, unattributed lines to keep members going (no famous-person quotes, so nothing gets misattributed).
export const QUOTES = [
  'Small steps every day add up to big changes.',
  'You don\'t have to be great to start. You have to start to be great.',
  'The hardest part was showing up. You already did that.',
  'Progress, not perfection.',
  'Your body hears everything your mind says. Talk to it kindly.',
  'One workout won\'t change you. A hundred will.',
  'Strong is built one rep at a time.',
  'Rest when you need to. Don\'t quit.',
  'You are one workout away from a better mood.',
  'Every rep is a vote for the person you are becoming.',
  'Slow is fine. Stopped is the only thing that isn\'t.',
  'Sweat now, smile later.',
  'You showed up for yourself today. That matters.',
  'Feel the burn? That\'s you getting stronger.',
  'Don\'t compare your chapter one to someone else\'s chapter twenty.',
  'Discipline is choosing what you want most over what you want now.',
  'The only bad workout is the one that didn\'t happen.',
  'Breathe in strength. Breathe out doubt.',
  'You are stronger than you were yesterday.',
  'Keep going. Future you is already thankful.',
  'Consistency beats intensity.',
  'Make today count. Tomorrow will thank you.',
  'It gets easier. You get stronger.',
  'Your only competition is who you were yesterday.',
  'Motion is medicine.',
  'Little by little, a little becomes a lot.',
  'You didn\'t come this far to only come this far.',
  'You\'re allowed to go slow. Just keep going.',
  'Healthy is a lifestyle, not a deadline.',
  'Do it for the person you want to be in a year.',
];

/** Same quote all day, a new one tomorrow. */
export function quoteOfTheDay(d = new Date()) {
  const n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  return QUOTES[n % QUOTES.length];
}

/** A different line for each rest break, steady while that break lasts. */
export const quoteFor = (seed: number) => QUOTES[((seed * 7) + 3) % QUOTES.length];
