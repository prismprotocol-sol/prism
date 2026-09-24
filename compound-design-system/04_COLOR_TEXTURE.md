# 04 — Color, Texture & Image Treatment

## 1. Base palette

```css
--black: #000000;
--surface: #101010;
--surface-2: #151515;
--white: #F2F2EF;
--white-muted: #A2A29E;
--gray: #666663;
--line: rgba(255,255,255,0.14);
--line-soft: rgba(255,255,255,0.08);
```

Keep the UI monochrome.

## 2. Image-derived color

Color comes primarily from photography.

The reference imagery can contain:
- red
- cyan
- blue
- yellow
- green
- warm orange

These colors should look accidental/generated from image processing rather than deliberately selected UI colors.

## 3. Technical texture

Several surfaces use nearly invisible diagonal patterns.

Create a reusable texture using CSS gradients or an SVG.

Target appearance:

dark-on-dark diagonal micro-lines.

Opacity should be extremely low.

## 4. Global grain

Add extremely subtle grain.

Target:
`opacity: 0.02–0.05`

The grain should be perceived only when looking closely.

## 5. Halftone

Photography should frequently be converted into:
- tiny dots
- pixel clusters
- thresholded regions
- degraded low-resolution patterns

Possible implementation techniques:
- SVG filters
- CSS radial-gradient dot masks
- canvas processing
- layered pseudo-elements

Use responsive dot density.

## 6. RGB artifacts

Some images can contain subtle:
- red channel offset
- cyan channel offset
- occasional isolated colored pixels

Keep this restrained.

## 7. Scanlines

Optional and extremely subtle.

If used:
- low opacity
- slow movement
- no obvious VHS effect

## 8. Image hierarchy

The image must remain subordinate to typography.

Especially in:
- testimonial
- security
- quote

Do not make the photography brighter than the foreground text.

## 9. Framing

Some images appear like physical plates:
- dark outer frame
- inner image
- thin border
- small corner markers

Recreate this as a reusable image-frame component.
