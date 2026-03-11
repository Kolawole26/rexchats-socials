# Components / common / input / FormText.vue Guide

**Purpose:** Reusable foundational text input component for standards text, email, and password fields.

---

## Structure

- Lives at `components/common/input/FormText.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `String` | No | `''` | Input field label. |
| `type` | `String` | No | `'text'` | HTML input type (e.g., text, password, email). |
| `modelValue` | `String \| Number` | Yes | `''` | `v-model` binding for the input value. |
| `error` | `String` | No | `''` | Validation error string to display below the input. |

---

## Responsibilities

- **Text Capture** — provides a standardized UI for any basic textual data entry.
- **Error Display** — integrates standardized error message styling.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormText label="Email Address" type="email" v-model="email" />
```
