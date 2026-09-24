# 02 — Typography System

## 1. Typeface architecture

Use three roles.

### A. Editorial Serif

Purpose:
- hero
- major quote
- testimonial
- editorial statements

Desired character:
- high contrast
- elegant hairlines
- fashion/editorial
- slightly narrow
- sophisticated
- regular weight

Candidates to test:
- Instrument Serif
- Bodoni Moda
- Cormorant Garamond
- DM Serif Display

Do not use Georgia or Times New Roman.

### B. Neutral Sans

Purpose:
- navigation
- card titles
- body copy
- CTA
- section headings
- buttons

Candidates:
- Geist
- Helvetica Neue
- Inter
- Manrope
- another neutral grotesk

The sans should be clean and quiet.

### C. Technical Mono

Purpose:
- timestamps
- metrics
- numbering
- metadata
- occasional system labels

Candidates:
- Geist Mono
- IBM Plex Mono
- JetBrains Mono

Use sparingly.

## 2. Hierarchy

### Hero display

Extremely large.

Desktop target range:
`clamp(72px, 7vw, 175px)`

Weight:
`400`

Line-height:
approximately `0.85–0.95`

Tracking:
approximately `-0.03em to -0.055em`

The phrase "your business" is visually distinct and italic/editorial.

### Major serif quote

Large enough to dominate the viewport.

Weight:
400.

Line-height:
approximately 0.9–1.0.

### Large sans section heading

Modern, clean, lighter weight.

### Card title

Large but substantially smaller than hero.

### Body

Quiet gray, comfortable line-height.

### Micro labels

Uppercase.

Small.

Tracked.

Typical:
- 10–12px
- 0.04–0.10em tracking

## 3. Color hierarchy

Primary:
`#F2F2EF`

Secondary:
`#A0A09C`

Tertiary:
`#666663`

Never make all text white.

The contrast between primary and muted text is important.

## 4. Typography behavior

Avoid:
- bold everywhere
- giant font-weight jumps
- excessive text shadows
- gradients in text

The scale does most of the work.
