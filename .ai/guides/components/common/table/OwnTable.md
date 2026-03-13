# Components / common / table / OwnTable.vue Guide

**Purpose:** Highly configurable and reusable data table component with built-in support for generic layouts, slots for custom cells, styling, and action menus.

---

## Structure

- Lives at `components/common/table/OwnTable.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `Array` | Yes | `[]` | Configuration for table columns (keys, labels, custom classes). |
| `data`    | `Array` | Yes | `[]` | The array of objects representing rows in the table. |
| `loading` | `Boolean` | No | `false` | Shows a loading state over the table when true. |

---

## Responsibilities

- **Data Presentation** — displays structured lists of data flexibly.
- **Customization** — allows named slots to override the rendering of specific columns natively.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonTableOwnTable :columns="tableHeaders" :data="tableData" />
```
