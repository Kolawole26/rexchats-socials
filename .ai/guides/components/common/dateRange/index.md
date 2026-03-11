# Components / common / dateRange / index.vue Guide

**Purpose:** Reusable component for selecting a start and end date, providing a consistent date range picker interface.

---

## Structure

- Lives at `components/common/dateRange/index.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelValue` | `Object` | No | `{ start: '', end: '' }` | `v-model` binding for the selected date range. |

---

## Responsibilities

- **Date Selection** — provides an intuitive UI for users to select a valid start and end date.
- **Validation** — ensures the end date is not before the start date.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonDateRange v-model="selectedRange" />
```
