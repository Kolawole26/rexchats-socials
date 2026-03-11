---
name: general-guidelines
description: Overarching rules, architecture standards, and AI instructions for the entire Nuxt 3 project.
---

# General Project Guidelines

Welcome to the central AI instruction manual for this Nuxt 3 project. This document serves as the top-level ground truth. All specialized instructions live within the `.ai/skills/` directory and extend these basic principles.

## 1. Project Architecture & Frameworks
- **Framework**: Nuxt 3 (Vue 3 Composition API).
- **Language**: Standard ES6+ JavaScript (TypeScript is explicitly NOT used in this project). Use `<script setup>` syntax for all components.
- **Styling**: Tailwind CSS (Utility-First) coupled with predefined CSS variables mapped from `assets/css/colors.css`.
- **UI Components**: PrimeVue (used sparingly and styled extensively via Tailwind or `global.css`).

## 2. Core Development Principles
### A. Code Standards (JavaScript Only)
- Never generate TypeScript code. Do not use `<script setup lang="ts">`, interfaces, standard types, or type assertions.
- Rely on standard Javascript imports, `ref()`, `reactive()`, `computed()`, and `watch()`.

### B. Styling Strategy
- **Tailwind First**: Build interfaces mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
- **Variables**: Never hardcode colors (e.g., `#FFFFFF` or `red-500`). Use the semantic Tailwind classes tied to our global variables (e.g., `text-general-primary-light`, `bg-primary-300`).
- **No Scoped Styles**: Never use `<style scoped>` within `.vue` components. If custom CSS is absolutely necessary, place it inside `assets/css/global.css`.

### C. Components & Reusability
- **Buttons**: Always use the `<CommonButton>` component instead of raw `<button>` HTML tags.
- **Inputs & Forms**: Use standardized form components (e.g., `<CommonInputFormText>`, `<CommonInputFormSelect>`).
- **Icons**: Utilize the `<BaseCustomIcon>` component instead of raw `<img>` tags or inline `<svg>` elements. All `.svg` assets must use `currentColor` for fill/stroke properties.

### D. State Management & Data Flow
- Place isolated UI state (modals opening, local loading states) inside component `ref()`s.
- Use `useState()` for shared simple interface states.
- Use **Pinia** (e.g., `useUserDetailsStore`) for complex global data that needs to persist across the application, particularly authenticated User Profiles and JWT tokens.

### E. Integrations & Error Handling
- Never use direct `fetch` or `axios` calls in components. Use the centralized `useApiRequest()` composable.
- Form validation occurs locally using `Joi` schemas tied to reactive state before any API calls fire.
- Use the central `useErrorHandler()` and `useToastHandler()` to process and display API errors directly from catch blocks.

## 3. Reference Material
Before developing a new feature or refactoring code, the AI must check the `.ai/skills/` directory to ensure compliance with specific, granular instructions:
- `api-integration`: Standardized request loops.
- `auth-flow`: Handling JWTs and MFA routing.
- `colors`: Understanding the semantic variable system.
- `date-time`: Parsing and displaying moment.js objects.
- `error-handling` / `toast`: Using the centralized PrimeVue toast deduplication service.
- `form-validation`: Implementing reactive Joi validation.
- `global-css`: Handling custom class creation properly.
- `responsive-design`: Best practices for grid and flex layouts.
- `routing-middleware`: Page protection and `NuxtLink` usage.
- `seo-metadata`: Implementing `useSeoMeta`.
- `state-management`: Distinguishing between Local, Nuxt, and Pinia states.
- `svg-icons`: The `BaseCustomIcon` system.
- `table`: Standardizing `OwnTable` configurations.
- `themes`: Managing light/dark mode persistence.
- `typography`: Global CSS font-sizing rules.
- `ui-button`: Implementing `<CommonButton>`.
