---
name: routing-middleware
description: Best practices for Nuxt 3 routing, NuxtLink usage, and route guards.
---

# Routing & Middleware Skill

Nuxt 3 uses a file-based routing system. Standardizing how we link between pages and how we protect those pages is essential for security and UX.

## Rules & Best Practices
1. **Always use `<NuxtLink>`**: Never use raw `<a>` tags for internal application routing. `NuxtLink` ensures Vue Router intercepts the click for an SPA-like transition without full page reloads.
2. **Use `definePageMeta` for Layouts & Middleware**: Assign specific layouts (e.g., `layout: 'auth'`) and route guards (e.g., `middleware: ['auth']`) at the top of your `<script setup>` block using `definePageMeta`.
3. **Dynamic Routes**: Use the `[param].vue` syntax for dynamic routes (e.g., `pages/users/[id].vue`). Access the parameter securely via `useRoute().params.id`.
4. **Programmatic Navigation**: Use `navigateTo('/path')` or `useRouter().push('/path')` for handling redirects after function executions (like an API login success), instead of `window.location.href`.

## Implementation Example

```vue
<template>
  <div>
    <!-- Correct Internal Linking -->
    <NuxtLink 
      to="/dashboard" 
      class="text-primary-300 hover:text-primary-400 font-bold"
    >
      Go to Dashboard
    </NuxtLink>

    <!-- Correct External Linking -->
    <NuxtLink 
      to="https://google.com" 
      target="_blank" 
      external
    >
      External Site
    </NuxtLink>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Route Protection & Layout Assignment
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'] // Requires user to be logged in
})

const router = useRouter()

const onLoginSuccess = () => {
  // Correct Programmatic Navigation
  router.push('/dashboard')
}
</script>
```
