# 05 — Motion & Interaction System

## 1. Philosophy

Motion is cinematic and almost subliminal.

The page should feel alive without looking animated.

Avoid:
- bouncing
- springy UI
- exaggerated scaling
- constant parallax
- flashy transitions
- excessive scroll effects

## 2. Timing

Micro interaction:
`200–400ms`

Text reveal:
`600–1200ms`

Section reveal:
`800–1500ms`

Ambient image movement:
`8–20s`

## 3. Easing

Preferred:
`cubic-bezier(0.16, 1, 0.3, 1)`

For ambient loops:
slow ease-in-out or linear.

## 4. Page load

Suggested sequence:

0ms:
black canvas

200–400ms:
logo/navigation appear

400–900ms:
hero typography reveals

700–1300ms:
information strip resolves

900–1800ms:
hero image resolves from degraded state

1000–2200ms:
micro-details/crosshairs settle

Do not make this feel like a loading animation.

## 5. Text reveal

Preferred:
- opacity 0 → 1
- translateY 12–30px → 0
- optionally clip-path reveal

No bounce.

## 6. Image reveal

Start:
- slightly blurred
- low opacity
- heavily degraded

Resolve toward:
- crisp enough to recognize
- still retaining halftone treatment

## 7. Ambient image motion

Use extremely small:
- x movement
- y movement
- scale movement
- noise evolution

Maximum visible displacement:
roughly 1–4px.

## 8. Hover

Buttons:
- slight background change
- arrow moves 5–10px
- border subtly brightens

Cards:
- image clarity/brightness changes slightly
- decorative icon shifts 1–2px

Do not scale cards dramatically.

## 9. Crosshairs

Crosshairs can fade in with sections.

Some can remain static.

Some can subtly move by 1px.

## 10. Transition overlay

For intentional navigation transitions:

black overlay
→ centered small Compound mark
→ next section

Approx. 500–1000ms.

Do not trigger it for ordinary continuous scrolling.

## 11. Reduced motion

Respect:
`prefers-reduced-motion`.

Disable ambient and entrance animation when requested.
