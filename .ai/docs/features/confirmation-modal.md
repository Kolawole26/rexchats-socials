---
title: Confirmation Modal
description: Global confirmation modal (logout/delete/etc.) triggered via a shared composable.
---

# Confirmation Modal

## Purpose

- Provide a single, consistent confirmation dialog UI across the app.
- Avoid duplicating modal instances in pages/components.

## How it works

- ModalConfirmationForwarder is mounted in components/partials/TheHeader.vue and renders ModalConfirmation when opened.
- Components trigger confirmations using useConfirmationModal().open({...}) from composables/confirmation.js.

## Files

- components/modal/confirmation.vue
- components/modal/confirmationForwarder.vue
- composables/confirmation.js
- components/partials/TheHeader.vue
- components/partials/TheSidebar.vue
