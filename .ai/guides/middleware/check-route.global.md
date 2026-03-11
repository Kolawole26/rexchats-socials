# Middleware / check-route.global.js Guide

**Purpose:** Global middleware that intercepts every navigation in the application and handles invalid or test routes by throwing a Nuxt error, preventing the user from reaching undefined pages silently.

---

## Structure

- Lives at `middleware/check-route.global.js`.
- **Global middleware** — the `.global` suffix in the filename means Nuxt applies it automatically to every route without needing to be declared in `definePageMeta`.
- Receives the `to` route object and checks against a list of valid paths.

---

## Responsibilities

- **Route validation** — maintains a `validRoutes` array of known paths. Any path outside this list can be inspected and handled explicitly.
- **404 error throwing** — uses `createError({ statusCode: 404, message: '...' })` for routes that should explicitly not exist (e.g. `/test`), which triggers Nuxt's built-in `error.vue` page.
- **Extensible gate** — the `validRoutes` array and the inner `if` block are the two places to add new route-handling logic as the project grows.

> **Note:** In production projects, `validRoutes` is typically replaced with a dynamic lookup against the Nuxt router's registered routes rather than a hardcoded array.

---

## Exporting

```js
// middleware/check-route.global.js
export default defineNuxtRouteMiddleware((to) => {
  const validRoutes = ['/', '/about', '/contact', '/products']

  if (!validRoutes.includes(to.path)) {
    if (to.path === '/test') {
      throw createError({
        statusCode: 404,
        message: 'The test page does not exist'
      })
    }
  }
})
```

- Because the filename ends in `.global.js`, Nuxt registers it automatically — no `definePageMeta` declaration is required on individual pages.
- When adding a new page, add its path to `validRoutes` to prevent it from being caught by this guard.
- Route-specific errors (e.g. restricted pages) should be handled in named middleware (`auth.ts`) rather than here to keep this file focused on structural 404 handling.
