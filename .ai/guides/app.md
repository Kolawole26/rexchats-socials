# app.vue Guide

**Purpose:** Root component of the Nuxt application. Wraps all layouts and pages, initialises the colour-theme on mount, and conditionally injects third-party scripts (e.g. New Relic) for production environments.

---

## Structure

- Lives at the project root as `app.vue`.
- Uses the Options API (`defineNuxtComponent`) with a `setup()` function.
- Mounts `<NuxtLayout>` and `<NuxtPage>` — all page rendering flows through here.
- Imports the global colour-token stylesheet in the `<style>` block.

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

---

## Responsibilities

- **Layout host** — `<NuxtLayout>` renders the active layout (`default` or `auth`) and `<NuxtPage>` renders the matched page component inside it.
- **Theme initialisation** — reads `color-theme` from `localStorage` in `onBeforeMount` and adds/removes the `dark` class on `<html>` to apply the correct Tailwind dark-mode palette before the first paint.
- **Conditional script injection** — uses `useHead` to inject `newRelic.js` only when `config.public.env === 'production'`, keeping non-production builds free of monitoring overhead.
- **Global CSS** — the `<style>` block imports `assets/css/colors.css` (CSS custom-property colour tokens) so they are available to every component.

---

## Exporting

`app.vue` is the root entry point — Nuxt picks it up automatically. No export configuration is needed.

When modifying `app.vue`:
- Keep it thin: only genuine root-level concerns (theme bootstrap, global head tags, top-level layout composition) belong here.
- Do not add feature-specific logic — move it to the relevant page, composable, or plugin instead.
- Additional global scripts should be added inside the `useHead` call following the existing conditional pattern.
- Additional global stylesheets should be imported in the `<style>` block or registered in `nuxt.config.ts` under `css:[]`.
