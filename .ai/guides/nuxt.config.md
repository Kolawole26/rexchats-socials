# nuxt.config.ts Guide

**Purpose:** Central configuration file for the Nuxt application. Registers modules, configures the PrimeVue theme, sets up PostCSS/TailwindCSS, declares runtime environment variables, and wires Vite plugins.

---

## Structure

- Lives at the project root as `nuxt.config.ts`.
- Uses `defineNuxtConfig` with the following top-level keys: `compatibilityDate`, `devtools`, `ssr`, `postcss`, `css`, `modules`, `vite`, `primevue`, `runtimeConfig`.
- A custom PrimeVue theme preset (`MyPreset`) is defined at the top of the file using `definePreset` with the `Aura` base theme.

---

## Responsibilities

- **SSR mode** — `ssr: false` disables server-side rendering (SPA mode). Change this key if SSR is required.
- **CSS registration** — `css: ['~/assets/css/global.css', 'primeicons/primeicons.css']` loads global stylesheets before any component renders.
- **Module registration** — enables Nuxt modules in the correct order:
  - `@primevue/nuxt-module` — PrimeVue auto-import integration
  - `@pinia/nuxt` — Pinia state management
  - `pinia-plugin-persistedstate/nuxt` — localStorage persistence for Pinia
  - `@nuxt/eslint` — ESLint integration
- **Vite plugins** — `svgLoader()` (from `vite-svg-loader`) enables `?component` SVG imports used by `BaseCustomIcon`.
- **PrimeVue theme** — configures the custom preset and sets `darkModeSelector: '.dark'` to align with the Tailwind dark-mode class strategy.
- **Runtime config** — exposes `BASE_URL` and `env` as public runtime values; keeps `API_KEY` private (server-only). All runtime values are read via `useRuntimeConfig()`.

---

## Exporting

`nuxt.config.ts` is consumed directly by the Nuxt CLI — no export syntax beyond `export default defineNuxtConfig({...})` is needed.

When modifying:
- Add new public environment variables under `runtimeConfig.public`; access them in composables with `useRuntimeConfig().public.MY_VAR`.
- Add new Nuxt modules to the `modules` array and install the corresponding package.
- Do not add feature-specific logic here — use plugins, middleware, or composables for runtime behaviour.
- Update the `content` array in `tailwind.config.js` if you add new source directories that contain Tailwind classes.

**Runtime config reference:**

| Key | Visibility | Default | Purpose |
|-----|------------|---------|---------|
| `BASE_URL` | Public | `https://api.example.com` | Backend API base URL |
| `env` | Public | `development` | Current environment label |
| `API_KEY` | Private | — | Server-only secret key |
