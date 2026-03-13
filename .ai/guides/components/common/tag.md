# Components / common / tag.vue Guide

**Purpose:** Reusable component to render small distinct interactive or informational tags, chips, or pills.

---

## Structure

- Lives at `components/common/tag.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `String` | Yes | — | The textual content of the tag. |
| `color` | `String` | No | `'gray'` | Base colour styling of the tag. |
| `removable`| `Boolean`| No | `false`| Enables a close icon representing a dismissible tag. |

---

## Responsibilities

- **Keyword Display** — showcasing categories, properties, or search filters as visual chips.
- **Interoperation** — (optionally) allowing users to remove and interact with the tag element via events.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonTag text="User Role" color="blue" />
```
