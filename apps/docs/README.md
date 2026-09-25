# @prism/docs

The PRISM documentation site, built with [Mintlify](https://mintlify.com).

## Develop

```bash
npm run dev:docs            # from the repo root
npm run dev --workspace=@prism/docs
```

Serves at http://localhost:3000 by default; pass `--port` to change it.

## Check before committing

```bash
npm run build      --workspace=@prism/docs   # mint validate (strict)
npm run check:links --workspace=@prism/docs
npm run check:a11y  --workspace=@prism/docs
```

## Structure

Content is MDX. Navigation is declared explicitly in `docs.json` — a new page will
not appear in the sidebar until it is listed under `navigation.groups`.

See `AGENTS.md` for the writing rules, the content boundaries, and the MDX gotchas
specific to this project.

## Deploy

Mintlify builds from the connected git repository. For a self-hosted or air-gapped
static build:

```bash
npm run export --workspace=@prism/docs
```
