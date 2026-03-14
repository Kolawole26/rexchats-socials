---
title: Authentication Login UI
description: Auth layout + login page UI aligned to the latest design.
---

# Authentication Login UI

## Routes

- /login: Primary login route (uses layouts/auth.vue).
- /auth/login: Alias route using the same view.
- /auth/forgot-password: Minimal stub to support the Forgot Password link.

## Layout

layouts/auth.vue provides a split-screen layout:

- Desktop (lg and up): left marketing panel with assets/images/auth-bg-image.jpg, right form panel.
- Mobile: left panel hidden; the form panel uses the full viewport.

## Components

- components/auth/LoginView.vue: Login form UI and local Joi validation.
- components/common/button.vue (CommonButton): Button wrapper supporting title, bgColor, textColor, loading, and createIcon props (while retaining legacy props).

## Color Tokens

The login UI uses the semantic Tailwind tokens:

- Background: bg-neutral-background + bg-neutral-surface.
- Text: text-neutral-primary, text-neutral-secondary.
- Links: text-primary-500.
- Button: bg-primary-300 with text-neutral-inverted.
