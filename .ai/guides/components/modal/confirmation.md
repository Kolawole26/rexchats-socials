# Components / modal / confirmation.vue Guide

**Purpose:** Reusable dialog prompt to confirm declarative or destructive user actions before proceeding.

---

## Structure

- Lives at `components/modal/confirmation.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `String` | No | `'Confirm Action'` | Title of the confirmation dialog. |
| `message` | `String` | Yes | — | Informational message explaining the action impacts. |
| `type` | `String` | No | `'warning'` | Semantic type indicating the severity (e.g., danger, warning, info). |
| `modelValue` | `Boolean` | Yes | `false` | `v-model` binding controlling the modal's visibility. |

---

## Responsibilities

- **Action Safeguard** — intercepts critical clicks to request explicit user intent verification.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<ModalConfirmation v-model="showConfirmDialog" message="Are you sure you want to delete this?" @confirm="onConfirmDeletion" />
```
