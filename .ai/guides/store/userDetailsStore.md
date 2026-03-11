# Store / userDetailsStore.ts Guide

**Purpose:** Pinia store that holds the authenticated user's session data (profile object and access token). It is the single source of truth for auth state across the entire application.

---

## Structure

- Lives at `store/userDetailsStore.ts`.
- Uses Pinia's **setup-store** syntax (`defineStore` with a factory function), which mirrors Vue's Composition API.
- Leverages `@vueuse/core`'s `useLocalStorage` so `user` and `token` are automatically persisted to and read from `localStorage` without manual save/restore logic.

**State shape:**

| Ref | Type | Storage Key | Default |
|-----|------|-------------|---------|
| `user` | `Object` | `'user'` | `{}` |
| `token` | `String` | `'token'` | `""` |

---

## Responsibilities

- **Persist session** — `useLocalStorage` binds the refs directly to `localStorage`, so values survive page reloads and new tabs automatically.
- **Provide auth state** — other composables (`api.js`, `middleware/auth.ts`) read `token` via `storeToRefs` to authorise requests and guard routes.
- **Single write point** — only this store should write to `user` and `token`; middleware and composables should only read them.

---

## Exporting

```ts
// store/userDetailsStore.ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useUserDetailsStore = defineStore('userDetails', () => {
  const user  = useLocalStorage('user', {})
  const token = useLocalStorage('token', '')

  return { user, token }
})
```

Usage in a component or composable:

```ts
import { useUserDetailsStore } from '@/store/userDetailsStore'
import { storeToRefs } from 'pinia'

const { user, token } = storeToRefs(useUserDetailsStore())
```

- Always use `storeToRefs` to destructure reactive refs — direct destructuring breaks reactivity.
- To add new persisted fields, add a `useLocalStorage('key', defaultValue)` ref and include it in the returned object.
- To clear the session (e.g. on logout), set `user.value = {}` and `token.value = ''` — `useLocalStorage` will sync the change to `localStorage` automatically.
