# Components / common / button.vue Guide

**Purpose:** Reusable button component providing consistent styling, states, and accessibility across the application.

---

## Structure

- Lives at `components/common/button.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `String` | No | `'button'`| Standard HTML button type attribute (button, submit, reset). |
| `variant` | `String` | No | `'primary'`| Defines the visual style of the button. |
| `disabled` | `Boolean`| No | `false` | Sets component and HTML input state to disabled. |
| `loading` | `Boolean`| No | `false` | Displays a loading spinner and suspends interaction. |

---

## Responsibilities

- **Action Trigger** — handling clicks, form submissions, and general user actions.
- **State Feedback** — reflecting loading, disabled, or active states to the user.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonButton variant="primary" @click="handleClick">Submit</CommonButton>
```
