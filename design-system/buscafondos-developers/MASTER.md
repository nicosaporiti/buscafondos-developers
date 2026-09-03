# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** BuscaFondos Developers
**Updated:** 2026-09-02
**Category:** API Developer Portal
**Foundation:** Vercel design guidelines, saved verbatim in [`vercel-design.md`](./vercel-design.md). Read that file first; this Master file translates it to the tokens, primitives and surfaces of this repository.
**Design Dials:** Variance 2/10 (Restrained) | Motion 1/10 (Still) | Density 6/10 (Comfortable reading, dense evidence)

---

## Principles

1. Precise, calm, direct, technically literate, evidence-led, editorial, restrained. Confidence comes from clarity and proof, never from decoration.
2. Start with the reader's job. A page opens with the answer or the tool, not with a masthead followed by setup.
3. Hierarchy through typography, alignment and spacing first. Surfaces, borders and color are earned, not default.
4. Design in monochrome. Color appears only when it adds meaning to state, action or data, always paired with a non-color cue.
5. Default to stillness. Motion only explains a state change or confirms an action.
6. Every fact on a page is sourced. Counts and versions on the home come from the OpenAPI snapshot; nothing is invented.

## Global rules

### Color palette

All tokens live in `app/globals.css`. Components read tokens; never hard-code hex values in components.

| Role | Light | Dark | CSS variable |
|------|-------|------|--------------|
| Background | `#FFFFFF` | `#0A0A0A` | `--background` |
| Foreground | `#171717` | `#EDEDED` | `--foreground` |
| Secondary surface | `#FAFAFA` | `#111111` | `--surface-secondary` (`--muted`) |
| Contrast surface | `#171717` | `#EDEDED` | `--surface-contrast` (`--primary`) |
| Text secondary | `#666666` | `#A1A1A1` | `--text-secondary` (`--muted-foreground`) |
| Text tertiary | `#8F8F8F` | `#7D7D7D` | `--text-tertiary` |
| Border subtle | `#EBEBEB` | `#1F1F1F` | `--border-subtle` |
| Border default | `#E6E6E6` | `#2E2E2E` | `--border` |
| Border strong | `#CCCCCC` | `#454545` | `--border-strong` |
| Input border | `#D9D9D9` | `#3A3A3A` | `--input` |
| Focus | `#0070F3` | `#52A8FF` | `--focus` (`--ring`) |
| Info | `#0070F3` | `#52A8FF` | `--color-info` |
| Success | `#297A3A` | `#62C073` | `--color-success` |
| Warning | `#A35200` | `#F1A10D` | `--color-warning` |
| Error | `#CB2A2F` | `#FF6166` | `--color-error` (`--destructive`) |

**Color rules**

- The primary action is the contrast surface (black on light, white on dark). There is no brand accent color.
- Semantic colors are reserved for: HTTP methods that mutate (`POST` info, `DELETE` error, `PATCH`/`PUT` warning), error states, warning callouts, focus rings and chart series.
- Never color a value because it is favorable or important. A `200` status is foreground, not green.
- Hard reject: gradients, glows, blobs, grid backgrounds, glass blur, colored side rails, ornamental shadows, fake depth.

### Typography

- **Sans:** Geist Sans, self-hosted through the `geist` package (`--font-geist-sans`). Used for prose, headings, labels, controls, tables, figures and dates.
- **Mono:** Geist Mono (`--font-geist-mono`). Only for code, commands, paths, HTTP methods, headers, status codes, identifiers and versions. Set only the identifier in mono, never the sentence.
- No Google Fonts requests; the CSP keeps `font-src 'self'`.

Type roles (class → size / weight / leading):

| Role | Class | Size token | Weight | Use |
|------|-------|------------|--------|-----|
| Display | `.display` | `--type-display` (40 to 56px) | 600 | One page-defining statement (home `h1`). |
| Page title | `.page-title`, `.prose > h1` | `--type-page-title` (30 to 36px) | 600 | Normal page title. |
| Heading 24 | `.heading-24`, `.prose h2` | `--type-title` (24px) | 600 | Major section turn. |
| Heading 20 | `.heading-20`, `.prose h3` | `--type-section` (20px) | 600 | Nested structure. |
| Heading 16 | `.heading-16`, `.prose h4` | `--type-subsection` (16px) | 600 | Compact structure. |
| Lede | `.lede`, `.prose > h1 + p` | `--type-lede` (18px) | 400 | One orientation passage. |
| Body | default | `--type-body` (16px) | 400 | Reading. |
| Compact | tables, callouts, steps | `--type-compact` (14px) | 400 | Dense evidence. |
| Label | `.label`, form labels | `--type-label` (13px) | 500 | Compact names. |
| Caption / meta | `.caption`, `.meta` | `--type-label` (13px) | 400 | Subordinate context, secondary color. |

Rules: sentence-case headings that state the reader's question; no all-caps eyebrows, kickers or overlines; no decorative section numbers (the ordered steps on the home are a real sequence); no em dashes; no arbitrary font sizes or numeric weights outside 400/500/600; prose measure near 68 characters (`--measure`); tabular numerals for aligned figures.

### Spacing

| Token | Value | Relationship |
|-------|-------|--------------|
| `--space-1` | 4px | Icon gaps |
| `--space-2` | 8px | Label to value |
| `--space-3` | 12px | Table cell padding, within-group gaps |
| `--space-4` | 16px | Paragraph rhythm, callout padding |
| `--space-5` | 20px | Field groups |
| `--space-6` | 24px | Column gutter, between groups |
| `--space-8` | 32px | Section intro to evidence |
| `--space-10` | 40px | Lede to first section |
| `--space-12` | 48px | Section turn |
| `--space-16` | 64px | Chapter break, footer |

Every gap has one owner: the wrapper (`.stack`, `.flow`, `.grid-12`, `.section-intro`) sets it and children carry no competing margins.

### Grid and layout

- `.container` is `min(1200px, 100% - 2 × padding)`, centered.
- `.grid-12` is 12 columns on desktop, 6 on tablet (under 1024px), 4 on mobile (under 640px). Spans: `.span-4` to `.span-12`.
- Prose occupies 6 to 7 columns (`.reading`, `.prose` measure). Tables, code, the reference and the playground may use all 12.
- Documentation pages use a 16rem sidebar and a 1120px reading column with a 68ch measure for prose.

### Shape and elevation

- `--radius-small` 4px (inline code, kbd), `--radius` 6px (buttons, inputs, code blocks, callouts), `--radius-large` 8px (dialogs).
- No shadows except the search dialog, which is a real overlay.

## Component specs

### Buttons (`components/ui/button.tsx`)

- Primary: `--primary` background, `--primary-foreground` text, hover `--primary-hover`. Height 40px (`size="lg"`) on page actions, 32px in toolbars.
- Secondary: `variant="outline"`, `--border`, hover `--muted`.
- Text labels first; an icon only when it makes the action faster to recognize (arrow for navigation links).

### Inputs and fields (`.field`)

- Visible label (13px, 500) with optional inline qualifier in secondary color, 36px control, helper text below in secondary color.
- Focus: 2px `--focus` outline. Invalid: `--destructive` border and an adjacent `role="alert"` message.

### Code (`components/code-example.tsx`)

- `figure.code-example`: `--surface-secondary` background, `--border`, 6px radius, caption bar with the title in 13px secondary and a ghost copy button. Same treatment in light and dark; no permanent dark terminal box.

### Callouts (`components/callout.tsx`)

- One bordered `aside`, no colored rail. The tone is expressed by the prefix word (`Nota:`, `Atención:`, `Listo:`); warning and success tint only that prefix.

### Tables

- Semantic `table` with `caption`, `thead`, `tbody`; span the full evidence width; header alignment matches cells; numeric columns and headers use `.numeric` (right-aligned, tabular).
- Rows separate with 1px `--border`; header rule is `--border-strong`. No cell borders, no zebra fill.

### API reference (`components/api-reference.tsx`)

- Operations are separated by a top rule, not wrapped in cards. The heading row sets method (mono, semibold, semantic color only for mutating methods), path (mono) and access label (secondary text, right).
- Responses are native disclosures (Accordion) with the status code in mono.

### Playground (`components/playground.tsx`)

- One tool, two peer sections (`Request` 5 columns, `Response` 7 columns) under a shared top rule. No nested cards; the empty response state is a dashed field.
- The status line stays monochrome; only errors use `--color-error`.

### Shell

- Header: 64px, hairline `--border-subtle`, solid background. Wordmark `BuscaFondos / Developers` left, search field and the single primary action right.
- Footer: quiet, hairline top rule, wordmark left, one ownership line plus the theme toggle right. Theme preference is otherwise implicit (system).

## Style guidelines

**Style:** Vercel restraint. Precise hierarchy, excellent typography, clear evidence, strong alignment, deliberate tension. Not merely black, white and empty margins.

**Home composition:** claim-led opening (display title, lede, two actions) with the first request as proof on the right; a stat strip sourced from the OpenAPI snapshot; a full-width table of contract areas; three true-peer steps; a closing that resolves to the reference.

**Page pattern (docs):** title, lede, then sections that each answer a new reader question. Evidence (tables, code) sits under the sentence that introduces it.

## Motion

Default to stillness. Allowed: 120ms color and border transitions on hover, the accordion open/close, the request spinner while loading. Forbidden: scroll reveals, parallax, hover translations or scale, decorative pulses. `prefers-reduced-motion` collapses every transition.

## Anti-patterns (do NOT use)

- All-caps or tracked eyebrows, kickers, overlines, decorative section numbers.
- Em dashes.
- Gradients, glows, blobs, textures, grid backgrounds, glass effects, ornamental shadows.
- Centered hero copy followed by a card grid.
- Metric boxes with borders; use the unboxed `.stat-strip`.
- Badges or pills for ordinary metadata (methods, status codes and access levels are plain text).
- Cards inside cards, borders used to repair weak hierarchy, a dark rounded box around every tool.
- Icon tiles, oversized icons, mixed icon styles, emojis as icons.
- Tiny muted prose, arbitrary sizes, misaligned peers.
- Narrow tables inside wide sections, centered headers above numeric columns.
- Invented metrics, fake response timings or screenshots.
- Buried endpoints, broken version switching, missing rate-limit state.

## Pre-delivery checklist

- [ ] First viewport states the claim or shows the tool; no masthead-then-setup.
- [ ] Only Geist Sans and Geist Mono; mono restricted to identifiers and code.
- [ ] Type roles from the table above; no ad hoc sizes or weights.
- [ ] Monochrome by default; each colored element encodes state, action or data and has a non-color cue.
- [ ] No gradients, glows, cards-in-cards, pills for metadata, eyebrows or em dashes.
- [ ] Tables are semantic, full width, headers aligned with cells, numeric columns right-aligned.
- [ ] Every gap has one owner; peers share role, size, weight and baseline.
- [ ] Light and dark themes have equivalent hierarchy and contrast (WCAG AA, 4.5:1 body text).
- [ ] Landmarks, one `h1`, ordered headings, skip link, visible focus, labels on every control.
- [ ] Reflows at 375, 768, 1024 and 1440px without horizontal scroll; grid children have `min-width: 0`.
- [ ] `prefers-reduced-motion` respected; no motion required to read the page.
- [ ] Facts on the page trace to the OpenAPI snapshot or documented sources.
