# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Members of The Internet Health Club (Sandi Sunday's remote fitness coaching club). Mixed ages and all fitness levels: moms, dads, grandparents, total beginners, people coming back from injury, and people who already train. They mostly work out at home, on their phone, often mid-workout with sweaty hands and the phone propped on the floor.

## Product Purpose
A member app linked from theinternethealthclub.com where members track progress, follow guided workouts, and reach their goals. Success: members open it several times a week, finish workouts, log their weight, and keep a streak going, and the coaching team can see who is active and who has gone quiet.

## Positioning
The club's promise is "a coach, a plan, a community, and simple tools to track your progress" from home with no equipment. The app is that plan and those tools in one place, tied to the member's real club account so their coach knows when they hit milestones.

## Operating Context
- Lives inside the existing Netlify site (repo `yousiful/fitnessfunnel`), at its own route, linked from the funnel and next to the existing "Member Login" (GHL client portal).
- Members sign in with their email and a one-time code sent through the club's GHL location. Progress is stored in the cloud so it follows them across devices.
- Milestones (joined the app, first workout, streaks, goal reached) post back to the member's GHL contact as tags and notes so the coaching team can follow up.

## Capabilities and Constraints
- The four goals the club already sells: Lose weight, Heal & recover, Get stronger, Move better.
- Guided home workouts are authored for the app (no equipment), with beginner, regular, and advanced levels, a work/rest timer, and low-impact options.
- Tracking: workouts completed, minutes, streaks, body weight over time, goal progress.
- Installable to the home screen (PWA).
- Undecided: whether members can message a coach in-app (today that happens through the GHL portal); nutrition tracking is out of scope for v1.

## Brand Commitments
- Name: The Internet Health Club. Voice on the site: warm, encouraging, plain words, "real people", "from home", "your coach".
- The funnel uses a warm orange-to-red energy and a heart logo (`src/components/AnimatedHeartLogo.tsx`).

## Evidence on Hand
- Site copy and the four goal categories in `src/App.tsx`.
- No real member results data exists for the app yet. Do not invent member counts, success rates, or testimonials inside the app.

## Product Principles
1. Every screen works one-handed on a phone, readable at arm's length mid-workout.
2. Progress is felt immediately: a finished workout always produces a visible change (streak, ring, badge).
3. Meet every level: the same plan scales from a grandparent's first week to someone who already trains.
4. Never shame a missed day; welcome people back.

## Accessibility & Inclusion
Older members and people with injuries: large tap targets, high contrast, readable type sizes, low-impact alternatives shown for every jump or floor move, motion that respects reduced-motion settings.
