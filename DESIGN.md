---
name: Health Club
description: The Internet Health Club member app, where each day is a dawn and finishing today's plan raises the sun.
colors:
  night: "#16123A"
  dusk: "#3B2A6B"
  coral: "#FF6B4A"
  sun: "#FFB23F"
  sun-hover: "#FFC25F"
  cream: "#FFF3E2"
  ground: "#120F2E"
  ground-2: "#1B1742"
  ground-3: "#26205A"
  ground-3-hover: "#312A6A"
  ground-lit: "#2A2050"
  line: "rgba(255, 243, 226, 0.14)"
  line-strong: "rgba(255, 243, 226, 0.28)"
  muted: "#C9BFD9"
  faint: "#9D93B5"
  alert: "#FF9C86"
typography:
  numeral-timer:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "132px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  numeral:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  display:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Bricolage Grotesque Variable, Figtree Variable, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  item:
    fontFamily: "Figtree Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Figtree Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
  button:
    fontFamily: "Figtree Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1
  label:
    fontFamily: "Figtree Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  bar: "3px"
  field: "16px"
  button: "18px"
  choice: "20px"
  panel: "22px"
  sheet: "28px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  gutter: "20px"
  gutter-wide: "24px"
  section: "28px"
  tap-min: "56px"
  tabbar: "72px"
components:
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "56px"
  button-sun-hover:
    backgroundColor: "{colors.sun-hover}"
  button-sun-disabled:
    backgroundColor: "{colors.ground-3}"
    textColor: "{colors.faint}"
  button-raised:
    backgroundColor: "{colors.ground-3}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "56px"
  button-raised-hover:
    backgroundColor: "{colors.ground-3-hover}"
  button-quiet:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "56px"
  button-quiet-hover:
    backgroundColor: "{colors.ground-3}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "56px"
  field:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.cream}"
    rounded: "{rounded.field}"
    padding: "0 18px"
    height: "58px"
  chip:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  panel:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.cream}"
    rounded: "{rounded.panel}"
    padding: "20px"
  choice:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.cream}"
    rounded: "{rounded.choice}"
    padding: "18px 20px"
  choice-selected:
    backgroundColor: "{colors.ground-lit}"
    textColor: "{colors.cream}"
  sheet:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sheet}"
    padding: "24px"
  tab-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.faint}"
    typography: "{typography.label}"
    height: "72px"
  tab-bar-active:
    textColor: "{colors.sun}"
---

# Design System: Health Club

## Overview

**Creative North Star: "Each Day Is a Dawn"**

The member app is a sky over a ground. The top of every screen is a sky whose height and warmth are today's progress: pre-dawn indigo with no work done, coral at sunrise, gold once the plan is finished. The sun sits at progress height above a single cream horizon hairline; below the horizon is a deep indigo ground where the work happens (lists, panels, the Start button). The world refuses the fitness category default of a black screen and neon activity rings.

Density is low and the type is big because members use the app one-handed, at arm's length, with the phone propped on the floor mid-workout. Numbers are the loudest thing on any screen: heavy rounded Bricolage Grotesque numerals, tabular, set larger than the words around them. Everything else is Figtree at a generous 17px body.

Motion is slow and warm where it carries meaning (the sky cross-fades over 1.8s, the sun climbs over 2s, the week stamp lands after a finished workout) and quick and tactile on controls (160ms press scale). Reduced-motion collapses all of it.

**Key Characteristics:**
- Sky above, ground below, one horizon hairline between them on every screen.
- Progress is sun height and sun shape, never a ring or percentage bar.
- One action color, sun gold, carried by the primary button, active tab, focus ring, and selection.
- Heavy display numerals; plain warm Figtree for everything else.
- Large targets: 56px minimum buttons, 72px tab bar, 96px play control.

## Colors

A pre-dawn palette: indigo grounds, a sunrise run of violet and coral held inside the sky, and one gold sun that does all the work of saying "act here".

### Primary
- **Sun Gold** (sun): the single action and "done" color. Primary button fill, active tab, focus ring, input caret, selected-choice border, switch on-state, the final three seconds of a work interval, the weight goal line, and the latest weight point. Hover lifts to Morning Gold (sun-hover).

### Secondary
- **Sunrise Coral** (coral) and **Dawn Violet** (dusk): the warming stops of the sky gradient. They live inside the Sky component and its horizon glow only.

### Neutral
- **Night Indigo** (night): the darkest sky stop and the ink color on gold. Text placed on the sun button and on a finished (daylight) sky uses it.
- **Ground** (ground): the page background below the horizon; also the tab bar base at 92% opacity.
- **Ground Raised** (ground-2): panels, fields, chips, choices, sheets, quiet buttons.
- **Ground High** (ground-3): raised buttons, disabled sun button, scrollbar thumb. Hover is ground-3-hover.
- **Lit Ground** (ground-lit): a surface that is selected or celebrating: the pressed choice and the milestone toast.
- **Morning Cream** (cream): primary text and the horizon hairline (at 55%).
- **Haze** (muted): secondary text, meta lines, rest-interval countdown.
- **Far Haze** (faint): tertiary text, inactive tabs, placeholders, unlit and future suns.
- **Horizon Line** (line) and **Strong Horizon Line** (line-strong): hairline borders on panels, fields, list rows; strong for ghost buttons, switches, and the divider hairline.
- **Soft Alert** (alert): inline error text only, a warm coral-pink that stays legible on the ground without reading as punishment.

### Named Rules
**The One Sun Rule.** Sun gold is the only color that means "do this" or "done". Coral and violet never appear as UI fills, borders, or text outside the sky.

**The Sky Is the Score Rule.** Gradients exist only in the sky, and the sky always encodes a real progress value (today's minutes over the daily target; fixed low values on sign-in and loading). Never use a gradient as decoration.

**The Daylight Ink Rule.** Text sitting on the sky is cream until progress reaches 0.8, then flips to night. Check contrast against the sky at the progress value it will be shown at.

## Typography

**Display Font:** Bricolage Grotesque Variable (with Figtree Variable, system-ui)
**Body Font:** Figtree Variable (with system-ui, -apple-system, Segoe UI)

**Character:** Bricolage, set extrabold with optical sizing and tight tracking, gives rounded, heavy, friendly numerals and headings; Figtree keeps the instructions plain and readable. The pairing reads like a warm coach, not a scoreboard.

### Hierarchy
- **Numeral Timer** (800, 132px, tabular): the work-interval countdown in the player; the rest countdown uses 120px in haze.
- **Numeral** (800, 64px, tabular): today's minutes on the Today sky; smaller inline numerals (24-40px, 800) carry counts inside sentences on Progress and the finish screen.
- **Display** (800, 56px, 0.95): the finish moment ("Sun's up.").
- **Headline** (800, 40px): sign-in heading and the sky-band titles that open secondary tabs.
- **Title** (800, 28-38px): workout names, sheet titles, today's next-up workout; 38px in the player.
- **Section** (800, 22-24px): goal group headings, Milestones, Weight.
- **Item** (700, 19px): list row titles; also the hero Start button at 64px height.
- **Body** (400, 17px, 1.45): instructions, cues, blurbs.
- **Button** (700, 18px): every button label.
- **Label** (600, 13-15px): tab labels, weekday names, meta lines, chips (15px).

### Named Rules
**The Heavy Numeral Rule.** Every count (minutes, streak, weight, seconds left) is set in the display face at 800 with tabular figures and -0.03em tracking, and is larger than the words that describe it.

## Layout

Single column, mobile first, centered at a 576px max width (max-w-xl) on larger screens. Content gutters are 20px on list screens and 24px on the sky, player, and sheets. Sections are separated by 28-40px; list rows are separated by line hairlines rather than gaps.

The Today screen gives the sky 46vh (min 330px); secondary tabs open with a 20vh sky band (min 150px) with the sun pushed right (84%). Every screen reserves space for the fixed 72px tab bar plus the safe-area inset, plus 24px. Bottom sheets rise from the screen edge with a 28px top radius and respect the bottom safe area. Long option lists keep their main action visible with a sticky bottom bar that fades from transparent into ground.

## Elevation & Depth

Depth comes from the sky-over-ground split and tonal steps of the ground (ground, ground-2, ground-3, ground-lit), with hairline borders. Surfaces are flat. Shadows appear only as warm light from sun-colored elements, plus one dark drop for a floating toast. The tab bar uses a 14px backdrop blur over 92% ground.

### Shadow Vocabulary
- **Sun Glow** (`box-shadow: 0 10px 28px -12px rgba(255, 178, 63, 0.7)`): under the sun button.
- **Play Glow** (`box-shadow: 0 14px 34px -14px rgba(255, 178, 63, 0.8)`): under the player's play/pause disc.
- **Sun Halo** (`box-shadow: 0 0 60px rgba(255, 190, 90, 0.55)`): the sun disc itself, inside the sky.
- **Toast Lift** (`box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.8)`): the milestone toast floating over content.

### Named Rules
**The Light, Not Lift Rule.** A shadow is light thrown by the sun. Neutral panels, choices, and fields never take a shadow; they separate by tone and hairline.

## Shapes

Soft, generous corners that grow with the size of the surface: 16px fields, 18px buttons, 20px choices, 22px panels, 28px sheet tops. Chips, switches, and player controls are full pills or circles. Timer bars use a small 3px radius. The horizon is the one hard straight line in the world: a 2px cream rule at 55% where the sky meets the ground, echoed by 1px line hairlines between list rows.

## Components

### Buttons
Big, warm, and pressable.
- **Shape:** gently rounded (18px), 56px minimum height, 24px side padding, 10px icon gap.
- **Sun (primary):** sun gold fill, night text, sun glow. One per view; the Today Start button grows to 64px with a 19px label.
- **Hover / Active / Focus:** sun lightens to sun-hover; every button scales to 0.97 on press over 160ms; focus is a 3px sun outline offset 3px.
- **Disabled:** the sun button drops to ground-3 with faint text and loses its glow.
- **Raised:** ground-3 fill, cream text; replaces the sun button once today is done ("Do another workout").
- **Quiet:** ground-2 fill, for utility actions (Install).
- **Ghost:** transparent with a 1.5px strong line border that brightens to cream on hover; for secondary and exit actions (End workout, Sign out, Send a new code).

### Chips
- **Style:** pill, ground-2 fill, 1px line border, haze text at 15px/600, 8px by 14px padding. On the sky, the streak chip uses a translucent night fill (55%) with cream text and a sun-colored flame.

### Cards / Containers
- **Corner Style:** 22px (panel).
- **Background:** ground-2 with a 1px line border.
- **Shadow Strategy:** none (see The Light, Not Lift Rule).
- **Internal Padding:** 20px, or 16px by 20px when a panel is a tappable row.

### Choices
Full-width selectable rows for goal, level, and settings.
- **Style:** ground-2, 1.5px line border, 20px radius, 18px by 20px padding.
- **Selected:** border turns sun gold and the fill lifts to ground-lit; press scales to 0.985.

### Inputs / Fields
- **Style:** 58px tall, ground-2, 1.5px line border, 16px radius, 19px/600 text, faint placeholder, sun caret.
- **Focus:** the border turns sun gold; no glow.
- **Error:** an inline soft-alert sentence below the field, announced as an alert.
- **One-time code:** the field switches to the numeral face at 30px with 0.4em tracking, centered.

### Switch
- **Style:** 56 by 32px pill, 1.5px strong line border, cream knob. On: sun fill and border, night knob slid 24px.

### Navigation
- **Tab bar:** fixed bottom, 72px plus safe area, 92% ground with 14px blur and a line top border. Four equal tabs (Today, Workouts, Progress, Me), 24px stroke icons over 13px/600 labels. Inactive is faint; active is sun with a heavier icon stroke.

### Sheets
- Bottom sheets on ground-2 with a 28px top radius over a 60% black scrim, rising in with the rise-in motion (14px, 520ms).

### Sky (signature)
The world's signature. Three stacked gradients (pre-dawn, sunrise, sun's up) cross-fade by progress over 1.8s; the sun disc (radial cream to gold to amber, with a halo) climbs to 62% of the sky height at full progress over 2s. A 2px cream horizon sits at the bottom edge and casts a coral wash onto the ground that strengthens with progress. Used at full height on Today, sign-in, onboarding, loading, and the finish screen, and as a 20vh sky band at the top of every secondary tab.

### Sun Glyph (signature)
The state shape for a day or milestone. **Full:** a filled sun disc (80% or more of the daily target, or a reached milestone). **Half:** a gold outline with the top half filled, sitting on a gold horizon line. **None:** an unlit faint arc on a faint horizon line, a calm missed day. **Future:** a small faint dot. Today adds a dashed cream ring. Each glyph carries a text label for screen readers.

### Week Strip
Monday to Sunday sun glyphs with 13px weekday labels; today's label is cream, others faint. After a workout is saved, today's glyph lands with the stamp motion (scale 1.6 to 1, blur clearing, 700ms after a 1.5s delay).

### Interval Bar
The workout timeline where length equals seconds: one segment per step, flex-grown by its duration. Work segments are 14px tall and fill with sun; rest segments are 6px and fill with haze; 3px gaps; the active segment fills linearly.

## Do's and Don'ts

### Do:
- **Do** open every screen with sky above ground and the cream horizon line between them; secondary tabs use the 20vh sky band.
- **Do** keep sun gold as the only action color, with one sun button per view.
- **Do** show day and milestone state with the Sun Glyph shapes (full, half, unlit, future) plus a text label.
- **Do** set every count in the heavy display numeral (800, tabular, -0.03em) larger than its label.
- **Do** keep buttons at 56px minimum height, body at 17px, and the tab bar at 72px.
- **Do** flip sky text from cream to night once progress reaches 0.8.

### Don't:
- **Don't** show progress as rings or arcs on a black screen; progress is sun height and sun shape.
- **Don't** use coral or violet outside the sky, and don't use gradients that don't encode progress.
- **Don't** mark a missed day in red or with a warning; it is an unlit dawn in faint.
- **Don't** put shadows on neutral panels, fields, or choices.
- **Don't** bring the marketing funnel's orange-to-red styles into the app; the app's warmth comes only from the sky.
