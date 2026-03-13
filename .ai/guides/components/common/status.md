# Components / common / status.vue Guide

**Purpose:** Reusable component for displaying standardized status badges, indicators, or labels to represent the state of an item (e.g., Active, Pending, Failed).

---

## Structure

- Lives at `components/common/status.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `status` | `String` | Yes | — | The semantic status to represent visually. |
| `label`  | `String` | No | `''`| Optional string to display inside the status UI, instead of resolving it from the status value itself. |

---

## Responsibilities

- **State Representation** — applying consistent colours, symbols, or formatting based on standardized conditions.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonStatus status="success" label="Active" />
```
