# Components / modal / success.vue Guide

**Purpose:** Reusable dialog specifically tailored for communicating a successful operation or milestone clearly and positively.

---

## Structure

- Lives at `components/modal/success.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `String` | No | `'Success!'` | Primary positive heading. |
| `description` | `String` | Yes | — | Details explaining the success impact or next steps. |
| `modelValue` | `Boolean` | Yes | `false` | `v-model` visibility control. |

---

## Responsibilities

- **Positive Feedback Loop** — providing undeniable, celebrated confirmation that a long or significant user flow completed properly.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<ModalSuccess v-model="showSuccess" title="Payment Complete" description="Your invoice was settled" />
```
