# Layouts / auth.vue Guide

**Purpose:** Minimal layout shell used exclusively by authentication pages (login, register, forgot-password, etc.). Provides a blank canvas with no sidebar, header, or navigation chrome.

---

## Structure

- Lives at `layouts/auth.vue`.
- Contains an empty `<template>` and an empty `<script setup>` block.
- No child components, no reactive state, no route-meta watchers.
- The page slot is rendered directly into the template — all visual structure is owned by the individual auth page.

---

## Responsibilities

- **Isolate auth pages** from the main application shell (sidebar, header, breadcrumbs).
- **Provide a clean context** so each auth page can control its own full-page layout (centered card, split-screen, etc.).
- **No shared chrome** — do not add global navigation, footers, or wrappers to this layout.

---

## Exporting

Layouts are auto-registered by Nuxt — no explicit export is required.

Apply this layout in any auth page:

```js
// pages/login.vue
definePageMeta({ layout: 'auth' })
```

When building a new auth page:
- Always set `layout: 'auth'` in `definePageMeta`.
- Own the full-screen visual structure (background color, centering, card) inside the page itself.
- Do not import sidebar or header components into auth pages.
