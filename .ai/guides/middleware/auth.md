# Middleware / auth.ts Guide

**Purpose:** Route-level guard that protects authenticated pages by verifying that a valid token and user object exist in both the Pinia store and `localStorage` before allowing navigation.

---

## Structure

- Lives at `middleware/auth.ts`.
- Named middleware — applied per-route, not globally.
- Imports `useUserDetailsStore` from `@/store/userDetailsStore` and reads `token` and `user` via `storeToRefs`.
- Reads persisted values from `localStorage` on each navigation and hydrates the store before the guard check.

---

## Responsibilities

- **Hydrate store from localStorage** — reads `token` (string) and `user` (JSON-parsed object) on every navigation hit so the guard works correctly after a page refresh or new tab.
- **Redirect unauthenticated users** — calls `navigateTo('/login')` and short-circuits the navigation when either `token` or `user` is falsy.
- **No side-effects beyond hydration and redirect** — do not perform API calls or modify application state beyond setting the store refs.

---

## Exporting

```ts
export default defineNuxtRouteMiddleware(() => {
  const { token, user } = storeToRefs(useUserDetailsStore())

  const localtoken = localStorage.getItem('token')
  const localUser = JSON.parse(localStorage.getItem('user') || '{}')

  user.value = localUser
  token.value = localtoken

  if (!(token.value && user.value)) return navigateTo('/login')
})
```

Apply to any protected page:

```ts
// pages/dashboard/index.vue
definePageMeta({ middleware: ['auth'] })
```

- Middleware name is derived from the filename — `auth.ts` → `'auth'`.
- Do **not** apply this middleware to auth pages (`/login`, `/register`) — they must remain publicly accessible.
- If authentication state shape changes (e.g. additional fields), update the hydration logic here and in `userDetailsStore.ts` together.
