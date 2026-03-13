# Components / partials / TheSidebar.vue Guide

**Purpose:** The global layout structural sidebar responsible for top-level application routing and navigation logic.

---

## Structure

- Lives at `components/partials/TheSidebar.vue`.

**Props:**

- (Can optionally accept toggle/collapsed state props from the parent layout, but often manages this via a global UI pinia store or layout context).

---

## Responsibilities

- **Primary Navigation** — renders the core navigational anchors to major application modules.
- **Spatial Consistency** — takes up deterministic flex or grid space consistently across dashboard views.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

Typically used alongside a header within `layouts/default.vue`:
```vue
<template>
  <div class="flex">
    <PartialsTheSidebar />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
```
