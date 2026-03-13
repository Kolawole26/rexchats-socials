# Components / common / input / FormRadioFlex.vue Guide

**Purpose:** Reusable flexbox-oriented radio group or tailored layout variant for displaying radio options cleanly.

---

## Structure

- Lives at `components/common/input/FormRadioFlex.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Array` | Yes | `[]` | List of options to render as flex-laid radio buttons. |
| `modelValue` | `Any` | Yes | — | `v-model` binding tracking the currently selected value. |

---

## Responsibilities

- **Layout Presentation** — arranges radio options horizontally or in a flexible grid for better use of space.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormRadioFlex :options="radioOptions" v-model="selectedValue" />
```
