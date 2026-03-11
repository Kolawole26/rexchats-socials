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

* Module registration
* Runtime configuration
* Vite configuration
* CSS framework setup
* Plugin configuration

Example modules:

* `@pinia/nuxt`
* `@nuxt/image`
* UI libraries (PrimeVue, Vuetify, etc.)
* TailwindCSS

---

# Folder Structure

Typical project layout:

```
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
│   ├── error.js               # useErrorHandler() — global error handler
│   ├── layout.js              # useLayout() — sidebar/theme layout state
│   ├── reUseFunctions.ts      # Shared utilities
│   └── useGlobalRecaptcha.ts  # Google reCAPTCHA composable

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

# Core Composables

The `composables/` directory contains reusable logic shared across the application.

These utilities should be reused whenever possible to prevent duplicated logic.

---

# API Requests

All HTTP requests must go through the **central API composable**.

File:

```
composables/api.js
```

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
* Standardized request interface

Do not call **fetch or axios directly inside components**.

---

# API Endpoints

All API routes must be registered in:

```
composables/endpoints.js
```

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

# Error Handling

Global error management is handled via:

```
composables/error.js
```

Example usage:

```javascript
const { handleError, clearError } = useErrorHandler()

try {
  const result = await sendRequest(...)
} catch (err) {
  const { error } = handleError(err)
}
```

Responsibilities:

* Standardize API error messages
* Handle HTTP status codes
* Provide consistent error state

---

# Shared Utilities

Utility helpers live in:

```
composables/reUseFunctions.ts
```

Before writing new helpers, check this file.

Common utilities may include:

* Number formatting
* Text truncation
* String helpers
* Currency formatting
* Date formatting

Example:

```ts
amountFunction(10000)
// 10,000
```

---

# Google reCAPTCHA

Integration handled by:

```
composables/useGlobalRecaptcha.ts
```

Example:

```ts
const { executeRecaptcha } = useGlobalRecaptcha()

const token = await executeRecaptcha('login')
```

Typical responsibilities:

* Load reCAPTCHA script
* Generate verification tokens
* Attach tokens to API requests

---

# State Management

Global state is managed with **Pinia**.

Stores should be created inside:

```
store/
```

Example:

```ts
export const useUserStore = defineStore('user', () => {
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

# Adding a New Feature

Recommended workflow:

1. Add endpoint to `endpoints.js`
2. Create composable if logic will be reused
3. Create components inside `components/feature/`
4. Create page in `pages/`
5. Create store if shared state is required
6. Test API integration
7. Generate and update documentation (explanation, how-to, reference, tutorial) in `.ai/docs/features/` after the feature is complete

---

# Environment Variables

Environment variables are defined in `.env`.

Typical variables:

| Variable        | Purpose              |
| --------------- | -------------------- |
| BASE_URL        | Backend API URL      |
| NUXT_PUBLIC_ENV | Current environment  |
| CAPTCHA_SITEKEY | Google reCAPTCHA key |

Access runtime config:

```javascript
const config = useRuntimeConfig()
```

---

# Testing

Testing is mandatory. Every feature must have unit tests (composables/stores) and integration tests. UI components must have widget/component tests.
Run `npm run test` before marking any task complete.
Detailed patterns are documented in [.ai/guides/testing.md](file:///c:/SGSProjects/ai-test-1/.ai/guides/testing.md).

---

# Development Commands

Common commands used in the project.

| Command         | Purpose                  |
| --------------- | ------------------------ |
| npm install     | Install dependencies     |
| npm run dev     | Start development server |
| npm run build   | Production build         |
| npm run preview | Preview production build |

---

# Development Guidelines

Follow these practices when working on the codebase.

1. Always reuse existing composables where possible
2. Do not duplicate business logic
3. Avoid hardcoding API URLs
4. Keep components small and reusable
5. Separate business logic from UI components
6. Follow the existing folder structure

---

# Agent Editing Rules

When AI agents modify this repository:

1. Read this document first
2. Follow existing architectural patterns
3. Reuse composables and utilities
4. Do not introduce unnecessary dependencies
5. Keep code consistent with the existing structure
6. Document any new shared utilities added
7. ALWAYS generate and update feature documentation (explanation, how-to, reference, tutorial) after a feature is completed

---

# Summary

This project follows a **structured Nuxt 3 architecture** focused on:

* composables for shared logic
* component-driven UI
* centralized API communication
* consistent error handling
* modular features

Agents and developers should always follow the patterns described here when extending the codebase.
