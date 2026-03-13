# AGENT.md — Frontend (Nuxt 3 Application)

## Purpose

This document provides guidance for **AI agents and developers** working on this frontend codebase.
It explains the **architecture, conventions, shared utilities, and workflows** used in the project.

Before editing or generating code, always read this document to understand how the project is structured.

---

# Project Overview

This project is built with **Nuxt 3** using a **component-driven architecture**.

Key principles:

* File-based routing via Nuxt `pages/`
* Shared logic handled through **composables**
* Global state managed via **Pinia**
* API communication handled through a **central HTTP composable**
* Reusable UI components organized by feature

---

# Language & Coding Standards

This project adheres to extremely strict coding standards:

* **Language**: Standard ES6+ JavaScript. **TypeScript is explicitly NOT used**. Do not generate TypeScript code. Do not use `<script setup lang="ts">`, interfaces, structural types, or type assertions. Always use plain `<script setup>`.
* **Styling**: **Tailwind-first**. Build interfaces mobile-first. Use semantic Tailwind classes tied to our global CSS variables (e.g., `text-primary-300`, `bg-neutral-20` mapped from `assets/css/colors.css`). Never hardcode colors.
* **No Scoped Styles**: Never use `<style scoped>` within `.vue` components. If custom CSS is absolutely necessary, place it inside `assets/css/global.css`.

---

# UI Components & Structure

Always use the standardized, project-specific components rather than raw HTML tags:

* **Buttons**: Always use `<CommonButton>` component instead of raw `<button>`.
* **Inputs/Forms**: Use standardized components (e.g., `<CommonInputFormText>`, `<CommonInputFormSelect>`).
* **Form Validation**: Form validation occurs locally using **Joi** schemas tied to reactive state before calling APIs.
* **Icons**: Utilize the `<BaseCustomIcon>` component instead of raw `<img>` or inline `<svg>`. All `.svg` assets must use `currentColor` for fill/stroke.

---

# Entry Points

## app.vue

Root component of the application.

Responsibilities may include:
* Rendering layouts and pages
* Global theme initialization
* Providing global state via `provide()`
* Application bootstrapping

Example structure:
```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

---

## nuxt.config.ts

Main configuration file for the Nuxt application.

Typical responsibilities:
* Module registration (e.g., `@pinia/nuxt`, TailwindCSS)
* Runtime configuration
* Vite configuration
* Plugin configuration

---

# Folder Structure

Typical project layout:

```text
project-root/

├── app.vue
├── nuxt.config.ts
├── tailwind.config.js

├── assets/
│   ├── css/
│   ├── images/
│   └── fonts/

├── components/
│   ├── base/            # Primitive UI components
│   ├── common/          # Reusable shared components
│   ├── forms/           # Form elements
│   ├── layout/          # Header, sidebar, footer
│   └── feature/         # Feature-specific components

├── composables/
│   ├── api.js                 # useApiRequest() — central HTTP client
│   ├── endpoints.js           # Centralised API endpoint map
│   ├── error.js               # useErrorHandler() & useToastHandler()
│   ├── layout.js              # useLayout() — sidebar/theme layout state
│   ├── reUseFunctions.js      # Shared utilities
│   └── useGlobalRecaptcha.js  # Google reCAPTCHA composable

├── layouts/
│   ├── default.vue
│   └── auth.vue

├── middleware/
├── pages/
├── plugins/
├── store/
└── public/
```

---

# API Requests

All HTTP requests must go through the **central API composable**. **Never use direct `fetch` or `axios` calls in components.**

File: `composables/api.js`

Example usage:

```javascript
const { sendRequest } = useApiRequest()

const response = await sendRequest({
  method: 'GET',
  endpoint: 'users',
  queryParams: { page: 1 }
})
```

Responsibilities:
* Base URL handling
* Authorization headers
* Error forwarding
* FormData handling

---

# API Endpoints

All API routes must be registered in: `composables/endpoints.js`

Example:

```javascript
export default {
  users: '/users',
  login: '/auth/login',
  register: '/auth/register'
}
```

Rules:
* Never hardcode API URLs in components
* Always reference endpoints from this file

---

# Error & Toast Handling

Global error management and notifications are handled via centralized composables.

File: `composables/error.js`

Example usage:

```javascript
const { handleError } = useErrorHandler()
const { showToast } = useToastHandler()

try {
  const result = await sendRequest(...)
  showToast('Success!', 'Operation completed successfully.', 'success')
} catch (err) {
  const { error } = handleError(err)
}
```

Responsibilities:
* Process and display API errors directly from catch blocks.
* Utilize PrimeVue toast deduplication service.

---

# Shared Utilities

Utility helpers live in: `composables/reUseFunctions.js`

Before writing new helpers, check this file.

Common utilities may include:
* Number formatting
* Text truncation
* Date formatting

Example:

```javascript
amountFunction(10000)
// 10,000
```

---

# State Management

Global state is managed with **Pinia**. Use `useState()` for simple shared interface states, but use Pinia for complex global data that persists (like authenticated User Profiles and JWT tokens).

Store files should be created inside: `store/`

Example usage:

```javascript
export const useUserDetailsStore = defineStore('userDetails', () => {
  const user = ref(null)
  return { user }
})
```

Use stores when:
* State must persist across pages
* State must be shared across components

---

# Layouts

Layouts define the overall structure of pages.

Common layouts:
| Layout  | Purpose                 |
| ------- | ----------------------- |
| default | Main application layout |
| auth    | Authentication pages    |

Example:

```javascript
definePageMeta({
  layout: 'default'
})
```

---

# Reference Material
Before developing a new feature or refactoring code, always check the `.ai/skills/` directory for granular instructions:
* `api-integration`: Standardized request loops.
* `auth-flow`: Handling JWTs and MFA routing.
* `colors`: Understanding the semantic variable system.
* `error-handling` / `toast`: Using the centralized PrimeVue toast deduplication service.
* `form-validation`: Implementing reactive Joi validation.
* `global-css`: Handling custom class creation properly.
* `svg-icons`: The `BaseCustomIcon` system.
* `ui-button`: Implementing `<CommonButton>`.

---

# Agent Editing Rules

When AI agents modify this repository:

1. Read this document and check `.ai/skills/` first.
2. Ensure TypeScript is strictly NOT generated.
3. Use pre-defined composables (`useApiRequest`, `useToastHandler`, `Joi` validation).
4. Utilize UI Component wrappers (`CommonButton`, `BaseCustomIcon`).
5. Never introduce `<style scoped>` in `.vue` files. Use standard Tailwind with globally defined CSS color variables.
6. ALWAYS generate and update feature documentation in `.ai/docs/features/` after a feature is completed.
