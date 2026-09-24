# 06 — Component System

The eventual Next.js implementation should be componentized around the visual system.

## Global

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

## Typography

- `EditorialHeading`
- `DisplayQuote`
- `MonoLabel`

## Imagery

- `HalftoneImage`
- `ImagePlate`
- `NoiseOverlay`
- `GlitchImage` only if needed

## Sections

- `Hero`
- `QuoteSection`
- `MetricsSection`
- `ServicesSection`
- `LogoGrid`
- `SecuritySection`
- `CTASection`
- `Footer`

## Data driven content

Services should be represented as data.

Security cards should be represented as data.

Technology logos should be represented as data.

This prevents visual/content duplication.

## Component rules

Components should expose visual parameters only when useful.

Do not create a huge component API.

Prefer a small number of consistent primitives.

## CSS architecture

Create tokens for:
- colors
- spacing
- typography
- borders
- z-index
- motion durations

Do not scatter magic values throughout the application.

## Layering

Think in layers:

1. page black background
2. technical grid
3. photography
4. image treatment
5. cards/panels
6. typography
7. micro-details
8. interaction/cursor

This layering is fundamental to the visual style.
