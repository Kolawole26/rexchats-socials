# Components / common / input / FormCheckBox.vue Guide

**Purpose:** Reusable checkbox input component with standardized styling and label support for forms.

---

## Structure

- Lives at `components/common/input/FormCheckBox.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `String` | No | `''` | Text description displayed next to the checkbox. |
| `modelValue` | `Boolean \| Array` | Yes | `false` | `v-model` binding for the checkbox state. |
| `disabled` | `Boolean` | No | `false` | Disables the checkbox input. |

---

## Responsibilities

- **Boolean Selection** — allows users to toggle a specific boolean preference or select multiple items in a group.
- **Standardized Styling** — applies consistent application-wide checkbox styling.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormCheckBox label="I agree to terms" v-model="isAgreed" />
```
