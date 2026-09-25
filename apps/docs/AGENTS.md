# PRISM documentation site

Read this before editing anything in `apps/docs`.

## About this project

- A [Mintlify](https://mintlify.com) docs site. Pages are MDX with YAML frontmatter.
- Configuration lives in `docs.json`. Navigation is explicit — a new page is invisible
  until it is listed in `navigation.groups`.
- Run it with `npm run dev:docs` from the repo root.
- Source of truth for the prose is `PRISM-docs-content.md`, split by `# PAGE:` markers.
  If that file changes, reflect the change here rather than rewriting from memory.

## Structure

Ten navigation groups, 38 pages:

| Directory | Group |
|---|---|
| `index.mdx`, `status.mdx` | Introduction |
| `how-it-works/` | How it works — the four layers, worked example, life of a pool, tenor |
| `concepts/` | Core concepts — tranches, first loss, attachment points, the originator problem, controlled collections, the tripwire |
| `originators/` | For originators |
| `investors/` | For investors |
| `risk/` | Risk and protections — overview, Goldfinch, the four controls, limits |
| `economics/` | Economics |
| `architecture/` | Architecture |
| `roadmap.mdx` | Roadmap |
| `resources/`, `disclosures.mdx` | Resources — glossary, FAQ, security, disclosures |

The nine `# PAGE:` sections of `PRISM-docs-content.md` are distributed across these —
no page is a verbatim one-to-one copy any more. Elaboration is allowed; new factual
claims are not.

## What PRISM is

PRISM structures and funds the capital between a senior lender's advance and an
originator's own money. It is not a lender: it never makes a loan, never holds one,
and is never the lender of record. It earns a structuring fee at issuance and a
servicing fee on notes outstanding.

## Be accurate about the current state

Zero loans originated. Zero dollars deployed. Zero losses, because zero loans. The
tranche mechanics run on Solana devnet only. No originator signed, no credit investor
signed, no audit, no legal entity.

**Never write copy that implies otherwise. Everything is future tense until a pool
matures.**

## Writing style

- Plain language. A reader who does not know what a tranche is should follow it.
- Short sentences. No marketing adjectives — no "revolutionary", "seamless",
  "cutting-edge".
- Every risk stated plainly. Our credibility comes from naming what can go wrong,
  because our audience has watched Goldfinch and Maple V1 fail.
- Numbers always carry their status: measured, modelled, or assumed. The 4% expected
  loss rate and the fee ranges are assumptions — label them and link to
  `/disclosures`.
- Sentence case for headings.

## Content boundaries

- No fake testimonials, no fake logos, no fake metrics. Anywhere.
- `disclosures.mdx` stays in the main navigation, never buried in the footer.
- Tranche rates are targets, not guarantees. Say so wherever they appear.

## MDX gotchas in this project

- **Escape dollar amounts as `\$`.** A bare `$` can pair with a later `$` and render as
  inline LaTeX. The content is full of figures like `\$10M`.
- **Do not use `<strong>` inside JSX blocks.** Mintlify's MDX component mapping drops
  it and the text disappears silently. Use `<span style={{ fontWeight: 600 }}>`
  instead. Markdown `**bold**` in ordinary prose is fine.
- Inline `style` must be a JSX object (`style={{ fontSize: "0.8rem" }}`), not a string.
- The four-layer diagram in `how-it-works.mdx` is styled entirely from `currentColor`
  via `color-mix`, so it inverts correctly in light and dark mode. Keep it that way —
  do not hardcode hex values there.

## Before you call it done

```bash
npm run build --workspace=@prism/docs   # mint validate, strict
npm run check:links --workspace=@prism/docs
npm run check:a11y --workspace=@prism/docs
```

`check:a11y` also audits the `docs.json` palette: `colors.dark` must clear 3:1 against
both a light and a dark background, which is why it is the mid-grey `#6d6d69`
(`--color-muted-2` in `packages/ui`) rather than near-black.

## Things that must not be invented

PRISM has no deployed contracts, no SDK, no public API, and no audit. Do not add
program IDs, error-code tables, event schemas, an API reference, or an audits page
that implies one exists. `resources/security.mdx` states plainly that there is no
audit; keep it that way until there is one.

## A known inconsistency in the source numbers

`originators/overview.mdx` says the PRISM slice costs "roughly 11% a year, all in".
`originators/your-numbers.mdx` shows cost of borrowing rising from \$487,500 to
\$637,500 — \$150,000 more for the \$1M PRISM funds, which is 15%, not 11%. Both
figures come from `PRISM-docs-content.md` as written. Do not silently reconcile them
by inventing a third number; the source needs fixing.
