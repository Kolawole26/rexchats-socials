# Components / common / input / FormRadio.vue Guide

**Purpose:** Reusable single radio button input component for forms.

---

## Structure

- Lives at `components/common/input/FormRadio.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `String` | No | `''` | Text displayed beside the radio button. |
| `value` | `Any` | Yes | — | The value representing this specific radio option. |
| `modelValue` | `Any` | Yes | — | `v-model` binding tracking the currently selected value in the group. |

---

## Responsibilities

- **Single Choice Selection** — provides a standard interface for selecting exactly one option from a set.
- **Visual Consistency** — uses standard radio controls styling.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormRadio label="Option A" value="A" v-model="selectedRadio" />
```
