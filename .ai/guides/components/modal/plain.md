# Components / modal / plain.vue Guide

**Purpose:** Barebones, minimalist modal wrapper acting as a blank canvas structural foundation for fully custom dialog content.

---

## Structure

- Lives at `components/modal/plain.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelValue` | `Boolean` | Yes | `false` | `v-model` visibility toggle. |
| `maxWidth`   | `String`  | No | `'max-w-md'` | Tailwind max-width class to control modal sizing. |

---

## Responsibilities

- **Overlay Framework** — handling standard modal concerns like backdrop clicks, z-index, escape key handling, and centering logic without imposing internal UI styling.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<ModalPlain v-model="isOpen">
  <!-- Custom specialized content goes here -->
</ModalPlain>
```
