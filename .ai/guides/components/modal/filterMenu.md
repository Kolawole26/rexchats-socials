# Components / modal / filterMenu.vue Guide

**Purpose:** Reusable off-canvas or modal menu providing comprehensive filtering interfaces for complex data views.

---

## Structure

- Lives at `components/modal/filterMenu.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelValue` | `Boolean` | Yes | `false` | `v-model` visibility of the filter menu. |
| `filters` | `Object` | No | `{}` | Current active filter state passed in for syncing context. |

---

## Responsibilities

- **Advanced Filtering UI** — offloads large sets of form inputs (checkboxes, date ranges) away from the primary page layout.
- **State Application** — emits filtered constraints back to the parent layout cleanly.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<ModalFilterMenu v-model="isFilterOpen" @apply="fetchFilteredData" />
```
