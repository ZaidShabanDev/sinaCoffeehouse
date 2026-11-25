# SINA Coffee — Landing Page POC

Proof-of-concept landing page to pitch SINA Coffee (specialty café, Amman). Animated intro + hero first, other sections later.

---

## Stack

- Astro 7 (static output), Vite 8, TypeScript, Node 24 (Astro 7 needs Node 22+).
- Plain WebGL 1 for the intro (no Three.js, no other 3D/animation library).
- Hosting: Netlify (`netlify.toml`). Source control: **Git** (GitHub).

## Working rules (always)

- **Step by step.** Explain the step, wait for "go", then build only that step. Never build ahead.
- **Ask one question at a time.** Give a recommendation with each question.
- **Update docs in the same turn as every code change** (see "Docs" below).
- **Never run builds or servers:** no `npm run dev/build/preview`, no `astro dev`, no `astro check`. Zaid runs them and reports back.
- **Never run git commands.** Give the exact commands; Zaid runs them. Branch → commit → PR → squash-merge. Commit format: `type(scope): summary`.
- **No new npm packages** without asking first.
- **Ask before creating or deleting files**, unless the approved step clearly includes them.
- Don't touch code outside the current step. Don't reorganise what wasn't asked.

## Docs

`docs/` is git-ignored (local notes only). One folder per task, `.md` files inside.

- `docs/Intro_Animation/Intro_Animation_Plan.md` — intro steps only: tick steps, add a dated one-line entry to "Changes log", update the step's explanation.
- `docs/Sand_WebGL/Sand_WebGL_Steps.md` — WebGL sand sub-steps (intro step 4): tick each step and fill its "Done" date.
- `docs/Project_Structure/Project_Structure.md` — update the tree and file list whenever a file is added, moved or removed.
- `docs/Shader_Conventions/Shader_Conventions.md` — **read before touching any shader.**
- `docs/Astro_Conventions/Astro_Conventions.md` — full Astro 7 reference (the short version is "Astro 7 rules" below).
- `docs/sina-coffee-design-breakdown.md` — brand reference (colors, type, tone).

## Project structure

```
src/
  assets/              images Astro optimises (logo, photos, brand board)
  components/<feature>/  .astro files: markup + scoped styles + one import
  features/<feature>/    TypeScript logic, one job per file
  shaders/             GLSL only (see Shader_Conventions.md)
    lib/               shared helpers + INDEX.md
    effects/<name>/    <name>.vert, <name>.frag, <name>.md contract (committed; the one allowed .md next to code)
  layouts/             page shells (when needed)
  pages/               routes
  styles/              tokens.css (brand values) + small global CSS
public/                files served as-is only (favicon, robots.txt)
```

- Group by feature. No big inline `<script>` in `.astro` files.
- Brand values live once in `src/styles/tokens.css` (cream `#F0ECE8`, rust `#78441F`). TS reads them with `getComputedStyle`, never hard-codes them.
- Add a file only when a step needs it.

## Code style

- TypeScript, descriptive names, small single-purpose functions.
- Fixed values: `UPPER_SNAKE` constants at the top of the file.
- Tuning knobs: one `settings.ts` object per feature (`sandSettings`, `introSettings`) so the dev debug panel (`?debug`, lil-gui, dev only) can change them live.
- Comments only for a non-obvious "why", 1–2 lines max. Longer reasoning goes in the task doc.
- Props typed with `interface Props`.

## Astro 7 rules

Full reference: `docs/Astro_Conventions/Astro_Conventions.md` and https://docs.astro.build. Don't use Astro 2–6 APIs.

- **Valid HTML only.** The Rust compiler no longer auto-closes tags; unclosed tags are build errors.
- **JSX whitespace:** a newline between inline elements renders no space. Use `{' '}` where a space is needed.
- **Images:** in `src/assets/`, rendered with `<Image />` / `<Picture />` from `astro:assets`, never a raw `<img>`. Only the hero/LCP image gets `loading="eager"` + `fetchpriority="high"`.
- **SVG:** import as a component (`import Logo from '...svg'`); props override the file's attributes (`viewBox`, `width`, `height`).
- **Scripts:** plain `<script>` in `.astro` (bundled, deferred). Avoid `is:inline` and `define:vars`; pass data with `data-*` attributes.
- **JS budget:** ship zero JS by default. No UI framework unless there's real interactivity; prefer `client:visible` if one is ever added.
- **Fonts:** use Astro's built-in Fonts API (`fonts` in `astro.config.mjs`), not Google Fonts `<link>` tags. Few families, few weights.
- **CSS:** scoped `<style>` in components; keep global CSS small.
- **i18n (later):** English first, Arabic at `/ar/`. Use Astro's `i18n` config, `hreflang` links, `<html lang="ar" dir="rtl">`, and CSS logical properties (`margin-inline-start`, not `margin-left`). Never add `letter-spacing` to Arabic text.
- **SEO (later):** set `site` in config, one `<h1>` per page, unique title + description, canonical URL, meaningful `alt` text, semantic HTML.

## Accessibility & motion

- Respect `prefers-reduced-motion`: no intro animation for those users.
- Decorative SVG/canvas gets `aria-hidden="true"`.
- The intro must never trap the page: always a skip control and a safety timeout.

## Verification

Claude can't run the app. After each step:
- Check VS Code diagnostics (must be empty).
- List exactly what Zaid should look for in the browser.
- Zaid runs `npm run dev`, checks, and sends a screenshot. Before shipping, Zaid runs `npx astro check`, `npm run build`, `npm run preview` and Lighthouse on the preview build.
