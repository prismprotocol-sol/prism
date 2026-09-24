# Compound Technology Partners — Finalized Recreation Design System

## Status

This document is the implementation-ready visual specification for the recreation.

**Source of truth:** supplied reference video/screenshots and the supplied design-system documents. The reference visual wins when the documents are vague or internally inconsistent. This is a fidelity specification, not a redesign.

No Next.js implementation should begin until this specification is accepted.

---

# 1. Design Direction

The reference is built on one deliberate contradiction:

**extreme editorial typography + technical architectural UI structure + chaotic/degraded photography.**

The resulting page should feel:

- intelligent
- expensive
- architectural
- cinematic
- slightly mysterious
- precise
- experimental
- enterprise credible

It must not drift into:

- generic SaaS
- generic Web3
- neon/futurist AI
- conventional consulting
- portfolio-style effects

The visual language is monochrome at the UI layer. Color is allowed to enter almost exclusively through photography.

The page rhythm alternates between:

1. large sparse editorial space
2. dense technical grid structure
3. chaotic photographic material

Do not normalize every section into the same card pattern.

---

# 2. Reference Findings That Override Ambiguity

## 2.1 Persistent shell

The reference video shows a persistent technical header and a thin architectural frame around the page. The header stays visible as the page moves through sections.

Desktop reference viewport is approximately **2940 × 1912**.

Use:

- page outer inset: **24px** desktop
- outer frame: **1px**
- header height target: **62px**
- header bottom rule: **1px**
- header content vertically centered
- left: timestamp
- center: Compound mark
- right: HOME / ABOUT / SERVICES

The header must remain quiet. It is structural chrome, not a hero element.

## 2.2 Architectural grid

The source documents call for a persistent 12-column desktop system, while the reference screenshots visibly use a strong inset architectural content region in lower sections.

Resolve this as two nested systems:

**A. Global shell**
- 24px outer inset
- full-width frame/rules

**B. Content grid**
- 12 columns
- max-width: 1056px at the reference desktop
- centered
- 8px column gap
- vertical rules preserved between major sections

At smaller desktop widths, the content grid becomes fluid:

`grid-template-columns: repeat(12, minmax(0, 1fr));`

Use a fluid max width instead of hard-coded reference pixels:

`width: min(calc(100% - 160px), 1056px);`

This gives the reference-like narrow architectural field while keeping the outer frame full width.

For desktop widths below 1280px, reduce the horizontal inset proportionally rather than allowing the grid to become unusably narrow.

## 2.3 Section ordering

The written architecture describes the conceptual system as NAV → HERO → QUOTE → METRICS → SERVICES → TECHNOLOGY → SECURITY → CTA → FOOTER.

The supplied video demonstrates a different scroll presentation and includes a results/metrics section, integrations, security, CTA, footer, and a quote sequence. Therefore:

**Do not hard-code the written list as a claim about DOM order.**

Build the sections as independent modules whose order is controlled by a single page-content configuration. The initial recreation should use the **reference video order**, with the quote treated as a distinct editorial module rather than forcing it into the written architecture.

Recommended initial reference order:

1. Header
2. Hero
3. What We Do
4. Results / Metrics + Testimonial
5. Integrations
6. Security
7. CTA
8. Footer
9. Editorial Quote / quote media sequence as shown in the captured reference flow

Do not merge quote and testimonial. They are visually and semantically different.

## 2.4 Reference viewport artifacts

The video contains browser/system artifacts such as a WhatsApp notification and browser chrome during portions of capture. These are **not part of the design** and must not be recreated.

---

# 3. Design Tokens

## 3.1 Color

```css
--black: #000000;
--surface-1: #101010;
--surface-2: #151515;

--text-primary: #F2F2EF;
--text-secondary: #A2A29E;
--text-tertiary: #666663;

--line: rgba(255,255,255,0.14);
--line-soft: rgba(255,255,255,0.08);
--line-faint: rgba(255,255,255,0.05);

--image-black: rgba(0,0,0,0.55);
```

Rules:

- base page is `#000000`
- UI remains monochrome
- primary text is off-white, never pure white
- secondary copy is visibly muted
- tertiary technical text is deliberately low contrast
- no UI gradient
- no colored buttons
- no colored borders
- no colored shadows
- photography supplies the rare color accents

Target visual distribution:

- **70–85%** black / near-black
- **10–20%** off-white text and rules
- **0–10%** image-derived color

## 3.2 Typography

Select these concrete roles for the recreation:

### Editorial Serif
**Instrument Serif**, regular 400.

Use for:

- hero
- editorial quote
- testimonial quote
- large editorial statements

Why: it best matches the reference's narrow, high-contrast, fashion/editorial display behavior among the supplied candidates.

### Neutral Sans
**Geist Sans**.

Use for:

- navigation
- section headings
- cards
- body
- CTA
- buttons

Keep weights restrained. Prefer 400 and 500.

### Technical Mono
**Geist Mono**.

Use for:

- timestamps
- metrics
- small labels
- metadata
- counters
- technical UI

Use sparingly.

## 3.3 Type scale

```css
--fs-micro: 10px;
--fs-label: 12px;
--fs-body: 14px;
--fs-card: 20px;
--fs-section: clamp(34px, 3vw, 52px);
--fs-quote: clamp(52px, 5.6vw, 110px);
--fs-hero: clamp(72px, 7vw, 175px);
```

Hero:

```css
font-family: "Instrument Serif";
font-size: clamp(72px, 7vw, 175px);
font-weight: 400;
line-height: 0.9;
letter-spacing: -0.045em;
```

Hero phrase **“your business”** is italic and visually distinct.

Do not reproduce this by using a generic fake italic if the selected serif has a real italic face available. Load the real italic cut.

Quote:

```css
font-family: "Instrument Serif";
font-weight: 400;
line-height: 0.92;
letter-spacing: -0.035em;
```

Section sans headings:

- 400 weight
- tight but not display-tight line-height
- no oversized weight contrast

Micro labels:

```css
font-family: "Geist Mono";
font-size: 10px;
letter-spacing: 0.08em;
text-transform: uppercase;
```

Body:

- 14px desktop baseline
- 1.45–1.55 line-height
- `--text-secondary`

Never make every text block primary white.

---

# 4. Spacing System

Base unit: **4px**

Allowed spacing tokens:

```text
4
8
12
16
24
32
48
64
80
96
128
160
192
224
256
280
```

Rules:

- component internals should live on the 4px rhythm
- avoid one-off values
- major editorial sections use **160–280px** vertical breathing room
- sparse areas are intentional
- do not fill empty space simply because it exists

---

# 5. Borders and Rules

All architectural rules are:

```css
border-width: 1px;
border-color: var(--line);
```

Use `--line-soft` for secondary dividers.

Rules should be:

- thin
- low opacity
- continuous where the reference suggests continuity
- never bright white
- never decorative for decoration's sake

Default radius:

```css
border-radius: 0;
```

No pills, capsules, rounded cards, soft bubbles, or floating SaaS containers.

---

# 6. Layer Model

Every major section should be mentally rendered as these layers:

1. black page canvas
2. technical grid
3. photography
4. image treatment
5. dark panels / cards
6. typography
7. micro-details
8. interaction layer

Do not collapse these into a single background-image layer.

---

# 7. Global Texture System

## 7.1 Technical diagonal texture

Create one reusable dark-on-dark texture primitive.

Target:

- very fine diagonal micro-lines
- barely visible
- should read as material, not pattern wallpaper
- black or near-black only

Preferred implementation:

- CSS repeating-linear-gradient for the default
- SVG only where a section needs more control

Suggested token:

```css
--texture-opacity: 0.055;
```

## 7.2 Grain

Global grain:

```css
opacity: 0.02–0.05;
```

It should only become obvious on close inspection.

Use a single composited noise layer rather than independently adding grain to every element.

## 7.3 Scanlines

Optional.

Only use where visible in the reference.

Rules:

- very low opacity
- slow movement
- no VHS aesthetic
- never allow scanlines to overpower text or photography

---

# 8. Photography / Image Processing

Photography is material, not decoration.

## 8.1 Core treatment

Images should commonly pass through:

1. crop
2. contrast compression or thresholding
3. downsampling
4. halftone / dot conversion
5. restrained RGB separation
6. subtle grain
7. darkening / compositing

Target result:

- recognizable subject
- visibly degraded
- hard-edged pixel clusters
- dense dot field
- imperfect color channels
- lower luminosity than foreground typography

## 8.2 Halftone

Prefer an implementation that can change dot density responsively.

Target:

- tiny dots
- clustered threshold regions
- no clean stock-photo rendering
- no generic AI-image filter look

Possible implementation architecture:

- processed image asset for hero-critical media
- CSS/overlay mask for lightweight instances
- Canvas/WebGL only if runtime performance remains acceptable

Do not make canvas mandatory for every image.

## 8.3 RGB artifacts

Use a small channel offset:

- red channel: approximately +1px
- cyan/blue channel: approximately -1px

Keep artifacts local and imperfect.

Never apply an obvious global chromatic-aberration filter to the whole site.

## 8.4 Image darkness

Add a dark composite layer so that:

**text always wins against photography.**

The reference hero image uses strong black negative space, white astronaut figure, red/blue flag color, and dense low-resolution ground texture.

## 8.5 Image frame

Reusable `ImagePlate` structure:

```text
outer black frame
  → thin border
  → inner image
  → crop
  → treatment
  → optional corner markers
```

Corner markers are technical, not ornamental.

---

# 9. Crosshair / Technical Marker Primitive

Use a reusable crosshair primitive.

Construction:

- horizontal 1px line
- vertical 1px line
- 12–20px overall span depending on scale
- low opacity

Default:

```css
width: 18px;
height: 18px;
```

Large hero markers may scale to 24px.

Placement must always correspond to a meaningful grid intersection.

Never randomly scatter crosshairs.

---

# 10. Global Header

Structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ timestamp             COMPOUND mark              HOME ABOUT SERVICES │
└──────────────────────────────────────────────────────────────┘
```

Desktop:

- height: 62px
- full shell width
- 24px outer inset
- timestamp left
- centered mark
- navigation right

Timestamp:

- Geist Mono
- 9–10px
- tertiary gray
- uppercase/system style

Navigation:

- Geist Sans / Mono-like compact treatment
- 10–11px
- muted
- generous but controlled horizontal gap

Header logo:

- small
- centered precisely to viewport/shell
- not scaled to dominate

Header must remain visually subordinate to hero typography.

---

# 11. Hero System

Hero is the strongest visual statement.

## 11.1 Geometry

Sequence:

1. persistent header
2. hero headline
3. continuous information strip
4. large degraded hero image

Headline spans the available shell width.

The hero title must dominate the viewport.

## 11.2 Information strip

Continuous bordered row immediately under headline.

Reference structure:

- technical globe / orbit icon
- copy: `CUSTOM AI AGENTS FOR THE MID MARKET.`
- dark technical texture field
- copy: `AI TRANSFORMATION FOR CRITICAL INDUSTRIES.`
- CTA: `CONTACT US →`

All segments share one row and one border language.

CTA has square corners.

Use segment-specific columns, not separate floating cards.

## 11.3 Hero image

Reference subject language:

- American flag
- astronaut
- dark landscape / pixel field

The exact source asset should be treated as a reconstruction asset, not as an excuse to substitute generic space photography.

Image presentation:

- very dark
- large horizontal field
- halftone dominant
- red/cyan/blue generated naturally from the source
- crosshairs on grid intersections
- faint boundary rules

---

# 12. Services / What We Do

Label:

`[ WHAT WE DO ]`

Three cards:

### 01 — Discover
We embed with your team to understand your business. Interviews, workflow mapping, and rigorous documentation to help find where AI actually moves the needle.

### 02 — Build
We turn strategy into working software with custom agents built on top of your tools and embedded AI in your products. Built for your workflows, not generic use cases.

### 03 — Adopt
We don’t just hand over a working system, we make sure it gets adopted. We redesign workflows around it, train your people, and stay until it sticks.

Visual rules:

- three major columns
- asymmetric vertical starts
- dark transparent panels over/near photography
- thin borders
- large service title
- micro number
- bottom metadata rule
- thin geometric icon
- no rounded cards

The asymmetry must remain grid-native.

Suggested desktop geometry:

- card width: 4 columns each
- card gap: 8px
- vertical offsets: approximately 0 / 48px / 96px
- offsets collapse toward zero on tablet/mobile only when needed for readability

---

# 13. Results / Metrics + Testimonial

This is a dense technical editorial section.

Three metric rows:

```text
80%     Reduction in recurring software costs

$1M+    Annual EBITDA added per engagement*

500+    Hours saved per month
```

Desktop geometry from the reference is approximately:

- left two-thirds = metrics
- right one-third = photographic testimonial plate

Each metric row is a bounded cell with:

- metric value
- explanatory copy
- 1px borders
- large black field

Testimonial:

> Compound learned how our business operates and became a true extension of our team.

Metadata:

`CMO, FINANCIAL SERVICES`

The quote may use the editorial serif, while the metric copy stays sans/mono.

---

# 14. Integrations / Technology Logos

Section label:

`[ INTEGRATIONS ]`

Support line:

`Your data lives in ERPs, HRIS, CRMs, and dozens of industry-specific tools. We plug into all of them, so our AI agents can pull context, take action, and do real work across your entire stack.`

Desktop:

- 5 columns
- 3 rows in the reference
- thin borders
- equal cells
- centered monochrome logos

Use this reference set:

NETSUITE  
SAP  
Sage  
QuickBooks  
HubSpot  
Salesforce  
ADP  
DocuSign  
RIPPLING  
PROCORE  
ServiceTitan  
Epic  
ModMed  
Microsoft 365  
Google Workspace

Then centered:

`AND HUNDREDS MORE`

Logo sizing must be restrained.

Do not recolor logos.

Do not use bright backgrounds.

---

# 15. Security Section

Label:

`[ SECURITY ]`

Heading:

`Industries Where Failure Isn’t An Option`

Body:

`We work with organizations in operationally complex, often regulated industries that need AI systems they can trust.`

Background:

- black
- subtle vertical/diagonal technical texture

Three image plates:

### 01
**Data Protection.**
All data encrypted in transit and at rest.

Reference imagery: dark stone doorway / arch.

### 02
**Compliance-Ready.**
HIPAA and SOC 2 ready. Built to meet the frameworks your industry requires.

Reference imagery: parchment / seal.

### 03
**Access Control.**
Role-based permissions. Multi-factor authentication. Full audit logging.

Reference imagery: antique key.

Desktop placement is intentionally asymmetric:

- first plate lower-left
- second offset lower-right
- third offset independently

Never align all three cards to one perfect row.

---

# 16. CTA

Large sparse black field.

Centered:

Compound Technology Partners mark

Heading:

`Most AI Implementations Fail.`
`Yours Doesn’t Have To.`

Button:

`LET'S BUILD SOMETHING THAT WORKS →`

CTA button:

- square corners
- dark panel
- thin border
- compact horizontal layout
- arrow aligned to far right
- no pill
- no glossy hover effect

CTA should feel calm and expensive, not salesy.

---

# 17. Footer

Use large black space before the footer content.

Footer has a thin top/bottom rule structure.

Left:

`LINKS`

`HOME  /  ABOUT  /  SERVICES  /  LINKEDIN`

`PRIVACY POLICY  /  TERMS OF SERVICE`

Right:

`© 2026 COMPOUND TECHNOLOGIES OF AMERICA LLC`

`ATLANTA, GA  /  EST. 2025`

Typography:

- very small
- muted
- technical
- low contrast

---

# 18. Editorial Quote Module

Quote:

`“The measure of intelligence is the ability to change.”`

Author:

`- ALBERT EINSTEIN`

Use large Instrument Serif, centered.

The reference pairs the quote with heavily processed Washington Crossing the Delaware imagery.

The quote area should have:

- substantial black negative space above/below
- centered type
- large degraded image below
- halftone treatment
- image-derived warm/cool color only

Do not confuse this with the client testimonial component.

---

# 19. Component Primitives

Use these primitives exactly as the visual vocabulary:

### Global
- `SiteShell`
- `Header`
- `CompoundLogo`
- `Timestamp`
- `GridOverlay`
- `TechnicalLabel`
- `Crosshair`
- `TechTexture`
- `ArrowButton`
- `SectionLabel`

### Typography
- `EditorialHeading`
- `DisplayQuote`
- `MonoLabel`

### Imagery
- `HalftoneImage`
- `ImagePlate`
- `NoiseOverlay`
- `GlitchImage` only when visually required

### Sections
- `Hero`
- `ServicesSection`
- `ResultsSection`
- `QuoteSection`
- `IntegrationsSection`
- `SecuritySection`
- `CTASection`
- `Footer`

Do not create a generic mega-card component with dozens of props.

Expose only meaningful visual parameters.

---

# 20. Data Model Rules

Services are data.

Metrics are data.

Technology logos are data.

Security cards are data.

This keeps content separate from the layout system.

The implementation should allow content changes without duplicating visual markup.

---

# 21. Responsive System

## Desktop ≥ 1440px

- 12-column grid
- 24px outer frame inset
- 1056px target content grid at the reference width
- persistent vertical rules
- full asymmetry
- hero display scale active
- image plates can remain offset
- 5-column integrations

## Tablet 768–1439px

- 8-column logical grid
- preserve architectural rules
- reduce outer inset toward 20px
- reduce hero type fluidly
- service cards can become two + one
- security plates reduce vertical offsets
- integrations remain multi-column if readable

## Mobile < 768px

Use a 4-column logical grid.

Preserve:

- black space
- 1px rules
- editorial serif
- technical labels
- asymmetric placement where it remains legible

Do not convert every section into centered rounded cards.

Hero:

- headline becomes fluid and wraps intentionally
- keep italic distinction in “your business”
- info strip becomes a stacked technical sequence while retaining borders
- image remains wide and cropped, not a small thumbnail

Services:

- stacked, but preserve staggered vertical spacing

Metrics:

- metrics stack vertically
- testimonial follows as an independent plate

Integrations:

- 2-column mobile grid

Security:

- stacked plates with retained offset rhythm where possible

CTA:

- centered but still architectural

---

# 22. Animation System

Motion is cinematic and nearly subliminal.

## Timing tokens

```css
--motion-micro: 280ms;
--motion-text: 900ms;
--motion-section: 1100ms;
--motion-ambient: 14s;
--motion-transition: 750ms;
```

Allowed source ranges:

- micro: 200–400ms
- text reveal: 600–1200ms
- section reveal: 800–1500ms
- ambient image movement: 8–20s
- navigation transition: 500–1000ms

Default easing:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Ambient:

- ease-in-out or linear

## Initial load

Sequence:

```text
0ms               black canvas
200–400ms         logo + navigation
400–900ms         hero typography
700–1300ms        info strip
900–1800ms        hero image resolves
1000–2200ms       crosshairs / micro details
```

This must feel like the page becoming visible, not a loading animation.

## Text reveal

Default:

- opacity 0 → 1
- translateY 12–30px → 0
- optional clip-path reveal

No bounce.

No elastic easing.

## Image reveal

Start:

- blurred
- lower opacity
- heavier degradation

Resolve toward:

- recognizable
- sufficiently sharp
- halftone retained

The image must not become a normal photographic image at the end.

## Ambient movement

Maximum visible displacement:

**1–4px.**

Allowed:

- x
- y
- tiny scale
- noise evolution

Do not use continuous cinematic parallax.

## Hover

Button:

- background changes slightly
- border becomes subtly brighter
- arrow moves 5–10px

Card:

- image clarity/brightness changes slightly
- icon moves 1–2px

Never dramatically scale cards.

## Navigation transition

For intentional page/section navigation:

```text
black overlay
→ centered small Compound mark
→ destination
```

Duration target:

**750ms**

Do not trigger this for ordinary continuous scrolling.

## Reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable:

- ambient movement
- entrance transforms
- scanning
- nonessential motion

Keep basic opacity or instantaneous state changes where useful for comprehension.

---

# 23. Z-Index / Layer Tokens

```css
--z-canvas: 0;
--z-grid: 10;
--z-media: 20;
--z-treatment: 30;
--z-panel: 40;
--z-content: 50;
--z-micro: 60;
--z-interaction: 70;
--z-header: 80;
--z-transition: 100;
```

Do not invent arbitrary z-indexes per component.

---

# 24. Implementation Architecture

Implementation order:

## Phase 1 — Tokens

Create one global token layer for:

- colors
- typography
- spacing
- borders
- widths
- z-index
- motion
- texture
- image processing parameters

No component-specific magic values unless visually exceptional.

## Phase 2 — Structural primitives

Build:

1. `SiteShell`
2. `Header`
3. `GridOverlay`
4. `SectionLabel`
5. `TechnicalLabel`
6. `Crosshair`
7. `TechTexture`
8. `ArrowButton`

These establish the visual language before any major page section is built.

## Phase 3 — Typography

Load:

- Instrument Serif regular + italic
- Geist Sans
- Geist Mono

Implement the type hierarchy before tuning section geometry.

## Phase 4 — Image pipeline

Create:

- `HalftoneImage`
- `ImagePlate`
- `NoiseOverlay`

Test hero image first.

The hero treatment becomes the calibration reference for every other processed image.

## Phase 5 — Page sections

Implement in this order:

1. Hero
2. Services
3. Results
4. Integrations
5. Security
6. CTA
7. Footer
8. Editorial Quote sequence

Do not polish all sections simultaneously.

## Phase 6 — Motion

Add motion only after the static layout matches the reference.

Motion cannot compensate for incorrect geometry.

## Phase 7 — Responsive

Tune desktop first against the supplied reference aspect ratio.

Then tablet.

Then mobile.

Do not design mobile first and attempt to recover the desktop reference afterward.

## Phase 8 — QA

Use the visual checklist below at every breakpoint.

---

# 25. Visual QA Gate

The recreation is not complete until the rendered page passes all of these:

## Grid

- outer border visible but subtle
- vertical grid rules align across sections
- horizontal rules are 1px
- common alignment anchors repeat
- asymmetric elements still obey the grid

## Typography

- serif feels editorial, not generic
- hero dominates
- hero line-height is tight
- “your business” is italic/distinct
- sans is restrained
- metadata is small and tracked
- secondary copy is muted
- no accidental boldness

## Hero

- timestamp is tiny
- centered logo is exact
- navigation is quiet
- headline dominates
- information strip is one continuous structure
- CTA is square
- image is degraded/halftoned
- crosshairs exist
- image does not look like ordinary stock photography

## Images

- halftone dots are visible
- grain is subtle
- RGB artifacts restrained
- typography remains brighter than imagery
- crops match the reference composition
- no excessive blur
- no generic AI-image filter appearance

## Services

- three cards use asymmetric geometry
- panels remain readable over imagery
- icons are thin
- number labels are small
- bottom metadata bars exist

## Integrations

- 5-column desktop grid
- monochrome logos
- restrained logo sizing
- thin cell borders
- centered “AND HUNDREDS MORE”

## Security

- technical texture visible only subtly
- cards feel like photographic plates
- image frame visible
- numbers present
- card placement is asymmetric

## CTA

- large black space
- centered logo
- large sans heading
- square CTA
- arrow interaction subtle

## Motion

- entrances are slow
- no bounce
- no dramatic scaling
- ambient movement almost invisible
- hover states restrained
- reduced motion supported

---

# 26. Final Fidelity Test

Ask one question after rendering:

**Does this look like a premium editorial technology company with an architectural technical system, or does it look like a normal SaaS template with dark colors?**

If the latter, stop implementation and fix the visual system before adding more effects.

The correct implementation should derive its visual identity from:

**typography scale + grid discipline + dark materiality + degraded photography + microscopic technical details + restraint.**

Not from gradients, neon, shadows, rounded cards, parallax, or decorative motion.
