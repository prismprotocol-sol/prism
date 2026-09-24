# 03 — Layout & Grid System

## 1. Grid philosophy

The entire page is governed by a persistent architectural grid.

The grid should feel like:
- blueprint
- editorial layout
- technical drawing
- Swiss design system

## 2. Desktop

Use a centered page shell with narrow outer margins.

Conceptually:

| margin | col | col | col | col | col | col | col | col | col | col | col | margin |

A 12-column implementation is recommended.

Use consistent vertical guide lines across major sections.

## 3. Rules

Horizontal and vertical rules:
- 1px
- low opacity
- never bright
- continue through sections when visually appropriate

Suggested:
`rgba(255,255,255,0.10–0.18)`

## 4. Spacing scale

Use a disciplined spacing system rather than arbitrary values.

Suggested base:
`4px`

Useful values:
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 / 160 / 192

Large sections may use 160–280px vertical rhythm.

## 5. Hero geometry

Navigation:
thin horizontal band.

Headline:
full-width editorial composition.

Information strip:
one continuous bordered grid directly below headline.

Image:
large horizontal visual occupying the lower hero area.

## 6. Asymmetry

Asymmetry should happen *inside* the grid.

Examples:
- offset image cards
- cards starting at different columns
- security plates placed at different vertical positions
- crosshairs aligned to unusual intersections

Do not randomly position elements.

## 7. Responsive behavior

Desktop:
preserve full grid.

Tablet:
reduce columns but preserve rules.

Mobile:
stack content but keep:
- black space
- thin borders
- editorial typography
- technical labels
- asymmetric offsets where possible

Never simply turn everything into centered cards.

## 8. Section rhythm

Recommended architecture:

NAV
→ HERO
→ EDITORIAL QUOTE
→ METRICS / TESTIMONIAL
→ SERVICES
→ TECHNOLOGY / LOGOS
→ SECURITY
→ CTA
→ FOOTER

Each major section should have its own visual identity while sharing the same grid.
