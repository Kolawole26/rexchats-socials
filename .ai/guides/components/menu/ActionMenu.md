# Components / menu / ActionMenu.vue Guide

**Purpose:** Reusable popover menu tailored specifically for rendering lists of actionable items (e.g. edit, delete, view) attached to a specific entity or row.

---

## Structure

- Lives at `components/menu/ActionMenu.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `actions` | `Array` | Yes | `[]` | List of action objects defining label, icon, and click handlers. |

---

## Responsibilities

- **Action Contextualization** — cleanly presenting contextual actions often used in data tables or detail cards.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<MenuActionMenu :actions="itemActions" @select="handleAction" />
```
