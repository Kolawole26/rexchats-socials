# Components / common / otpInput.vue Guide

**Purpose:** Reusable component for handling One-Time Password (OTP) inputs, typically used during Two-Factor Authentication (2FA) flows.

---

## Structure

- Lives at `components/common/otpInput.vue`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `length` | `Number` | No | `6` | The number of character inputs for the OTP. |
| `value`  | `String` | No | `''`| `v-model` binding for the current OTP string. |

---

## Responsibilities

- **Input Control** — managing sequential focal logic and capturing digit-by-digit input cleanly.
- **Validation** — ensuring valid character entry constraints.

---

## Exporting

Components in `components/` are auto-imported by Nuxt.

Usage:

```vue
<CommonOtpInput v-model="otpCode" :length="6" />
```
