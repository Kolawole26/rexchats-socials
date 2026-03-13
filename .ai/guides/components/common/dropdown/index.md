# Components / common / dropdown / index.vue Guide

**Purpose:** Reusable dropdown menu component for displaying selectable options or actions in a floating popover.

---

## Structure

- Lives at `components/common/dropdown/index.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Array` | Yes | `[]` | List of items to display in the dropdown menu. |
| `modelValue` | `Any` | No | `null` | `v-model` binding for the currently selected option. |

---

## Responsibilities

- **Option Presentation** — displays a list of choices cleanly.
- **State Management** — handles the open/close state of the dropdown menu and selection logic.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonDropdown :options="menuOptions" v-model="selectedOption" />
```
