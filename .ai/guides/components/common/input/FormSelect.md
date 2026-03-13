# Components / common / input / FormSelect.vue Guide

**Purpose:** Reusable select/dropdown input component for form context, supporting custom styling opposed to native `<select>`.

---

## Structure

- Lives at `components/common/input/FormSelect.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `String` | No | `''` | Label for the input field. |
| `options` | `Array` | Yes | `[]` | Array of objects/strings to serve as select options. |
| `modelValue` | `Any` | Yes | `null` | `v-model` binding for the selected option. |

---

## Responsibilities

- **Option Display** — shows a list of choices clearly within a form context.
- **Form Integration** — hooks seamlessly into form state and validation schemas.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonInputFormSelect label="Country" :options="countries" v-model="selectedCountry" />
```
