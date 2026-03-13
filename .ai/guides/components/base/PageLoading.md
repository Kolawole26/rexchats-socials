# Components / base / PageLoading.vue Guide

**Purpose:** A reusable loading overlay component for whole pages. It displays a full-screen spinner or loading animation, typically used while pending critical data fetches or page transitions.

---

## Structure

- Lives at `components/base/PageLoading.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loading` | `Boolean` | No | `false` | Toggles the active state of the page loading spinner. |

---

## Responsibilities

- **Visual Feedback** — provides full-screen visual feedback during page transitions or initialization.
- **Interaction Blocking** — prevents user interaction with the page while the content is loading.

---

## Exporting

Components in `components/` are auto-imported by Nuxt — no explicit import is required.

Usage:

```vue
<BasePageLoading :loading="isPageLoading" />
```
