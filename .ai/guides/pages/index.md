# Pages / index.vue Guide

**Purpose:** Entry-point page of the application (rendered at the `/` route). Demonstrates the standard page scaffold: layout declaration, store access via Pinia, and component-ready template.

---

## Structure

- Lives at `pages/index.vue`.
- Uses `<script setup>` with Nuxt 3 Composition API auto-imports.
- Imports `useUserDetailsStore` and destructures reactive state with `storeToRefs`.
- Calls `onMounted` for any client-side initialisation logic.

```vue
<template>
  <div>
    <!-- page content goes here -->
  </div>
</template>

<script setup>
import { useUserDetailsStore } from '@/store/userDetailsStore'
import { storeToRefs } from 'pinia'

const userDetailsStore = useUserDetailsStore()
const { user } = storeToRefs(userDetailsStore)

onMounted(() => {
  // client-side init (data fetch, side-effects, etc.)
})
</script>
```

---

## Responsibilities

- **Declare layout** — set `definePageMeta({ layout: 'default' })` (or `'auth'`) at the top of `<script setup>`.
- **Access global state** — use `storeToRefs(useUserDetailsStore())` to get `user` and `token`; never import `localStorage` directly inside a page.
- **Trigger initial data fetch** — call `sendRequest` from `useApiRequest()` inside `onMounted` or as an `async` function wired to a lifecycle hook.
- **Keep templates declarative** — move complex display logic into composables or child components; pages should orchestrate, not implement.

---

## Exporting

Pages are auto-registered by Nuxt based on their file path — no export is required.

When creating a new page:

1. Create the `.vue` file under `pages/` following the Nuxt file-based routing convention.
2. Add `definePageMeta` with the appropriate `layout` and any required `middleware`.
3. Source data through `useApiRequest()` and store it in local `ref`s or the Pinia store.
4. Add the page's path to `check-route.global.js`'s `validRoutes` array.
