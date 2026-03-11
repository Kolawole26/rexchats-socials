# tailwind.config.js Guide

**Purpose:** Configures Tailwind CSS for the project, defining the design token colour palette (mapped to CSS custom properties), typography tokens, dark-mode strategy, and the content-scan paths for purging unused styles.

---

## Structure

- Lives at the project root as `tailwind.config.js`.
- Uses the CommonJS `module.exports` format (required by PostCSS-based Tailwind setups).
- All colour values reference CSS custom properties (e.g. `var(--primary-500)`) defined in `assets/css/colors.css`, making it easy to swap themes by changing variable values without touching this file.

---

## Responsibilities

- **Dark mode** — `darkMode: 'class'` enables class-based dark mode (`<html class="dark">`), toggled by `app.vue`'s theme-bootstrap logic.
- **Content paths** — `content` scans `components/`, `layouts/`, `pages/`, `plugins/`, `app.vue`, and `error.vue` for class names; all generated CSS from other locations will be purged in production.
- **Colour tokens** — extends the Tailwind palette with semantic groups:

| Scale | Groups |
|-------|--------|
| 50 → 500 | `primary`, `secondary`, `success`, `danger`, `warning`, `info` |
| 10 → 500 | `neutral` |

Each step maps to a CSS variable (e.g. `primary-500` → `var(--primary-500)`).

- **Font family** — registers `geist: ["Geist", "sans-serif"]` so `font-geist` is available as a Tailwind utility class.

---

## Exporting

```js
// tailwind.config.js
module.exports = { ... }
```

When adding or changing tokens:
- **New colour** — add a new group under `theme.extend.colors` following the existing scale (50…500) and define the matching CSS variables in `assets/css/colors.css`.
- **New font** — add the entry under `theme.extend.fontFamily` and ensure the font is loaded in `assets/css/global.css` or via `nuxt.config.ts`.
- **New source directory** (e.g. `modules/`) — add its glob to the `content` array so its classes are not purged.
- Never hardcode colour hex values in this file — always use `var(--token-name)` so the single source of truth remains in `colors.css`.
