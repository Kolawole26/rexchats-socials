---
title: Password Reset Flow
description: Forgot password (email -> OTP) then reset password (form -> success).
---

# Password Reset Flow

## Routes

- /auth/forgot-password
  - Screen 1: Recover your account (email + Generate OTP)
- /auth/forgot-password/otp
  - Screen 2: Enter OTP (6 digits) using components/common/otpInput.vue
- /auth/reset-password
  - Screen 3: Create new password (New + Confirm) then Success state

## Flow (UI Phase)

1) User enters email on /auth/forgot-password
   - Email is stored in sessionStorage as reset_email
   - Navigate to /auth/forgot-password/otp

2) User enters OTP on /auth/forgot-password/otp
   - OTP is stored in sessionStorage as reset_otp
   - Navigate to /auth/reset-password

3) User sets a new password on /auth/reset-password
   - On success, the page switches to a success state and offers Proceed to Login

## Token Styling

All screens reuse the same tokens as login:

- Background: neutral-background + neutral-surface
- Text: neutral-primary, neutral-secondary
- Links/actions: primary-500
- Primary buttons: primary-300 with neutral-inverted label
