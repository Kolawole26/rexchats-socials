# Components / common / input / FormPhone.vue Guide

**Purpose:** Reusable phone number input component, often handling country code selection and standardized formatting.

---

## Structure

- Lives at `components/common/input/FormPhone.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `String` | No | `''` | Label for the input field. |
| `modelValue` | `String` | Yes | `''` | `v-model` binding for the phone number. |
| `error` | `String` | No | `''` | Validation error message to display. |

---

## Responsibilities

- **International Number Support** — provides formatting and prefixing for phone numbers.
- **Input Formatting** — applies standard layout to phone numbers as they are typed.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormPhone label="Phone Number" v-model="phoneNumber" />
```
