# Layouts / default.vue Guide

**Purpose:** The main application shell used by all authenticated pages. Wraps every page with the sidebar, mobile overlay, and top header, and forwards route-meta breadcrumb props to child components.

---

## Structure

- Lives at `layouts/default.vue`.
- Uses `<script setup>` with Vue 3 Composition API.
- Three visual zones: fixed sidebar, mobile overlay backdrop, and a scrollable main content area.
- Sidebar visibility is controlled by a local `isSidebarOpen` ref and toggled via an event emitted from `PartialsTheHeader`.

**Key refs:**

| Ref | Type | Source | Purpose |
|-----|------|--------|---------|
| `isSidebarOpen` | `Boolean` | local | Shows/hides sidebar and backdrop |
| `customProp` | `String` | `route.meta` | Current page title displayed in mobile breadcrumb |
| `prevNavProp` | `String` | `route.meta` | Parent breadcrumb label |
| `prevNavLink` | `String` | `route.meta` | Parent breadcrumb route path |
| `currentPrevProp` | `String` | `route.meta` | Second-level breadcrumb label |
| `currentPrevLink` | `String` | `route.meta` | Second-level breadcrumb route path |

All five route-meta refs are kept in sync with `watch()` so navigation between pages updates the header without a full remount.

---

## Responsibilities

- **Render sidebar** — mounts `<PartialsTheSidebar>` in a fixed column and listens for its `close-sidebar` event.
- **Mobile overlay** — shows a semi-transparent backdrop when `isSidebarOpen` is true on mobile; click dismisses the sidebar.
- **Render header** — mounts `<PartialsTheHeader>` and passes all breadcrumb props down; receives `toggle-sidebar` event to open the sidebar.
- **Page slot** — renders the active page inside `<slot />` in the scrollable main area.
- **Mobile breadcrumb** — displays a simple `prevNavProp / customProp` heading on small screens (hidden on `lg`).
- **Route-meta sync** — watches all five `route.meta.*` keys so the layout reacts to Nuxt route changes without requiring a component remount.

---

## Exporting

Layouts are auto-registered by Nuxt — no explicit export is required.

Apply this layout in a page with:

```js
definePageMeta({ layout: 'default' })
```

Or omit `definePageMeta` entirely — `default` is the fallback layout when no other is specified.

When adding breadcrumb information to a page, populate route meta in that page's `definePageMeta`:

```js
definePageMeta({
  layout: 'default',
  customProp: 'Dashboard',
  prevNavProp: 'Home',
  prevNavLink: '/'
})
```
