# Plugins / primevue.js Guide

**Purpose:** Registers PrimeVue (the UI component library) and its required services as a Nuxt plugin so they are available globally across every page and component.

---

## Structure

- Lives at `plugins/primevue.js`.
- A single default export using `defineNuxtPlugin`.
- Registers three items on `nuxtApp.vueApp`:
  1. `PrimeVue` — the core library (enables theme, config, directives).
  2. `ToastService` — required for `useToast()` to work anywhere in the app.
  3. `Button` — globally registered PrimeVue button component.

---

## Responsibilities

- **Library registration** — installs PrimeVue on the Vue app instance so all PrimeVue components become available.
- **Toast infrastructure** — installing `ToastService` is a prerequisite for `useToast()` — without it, toast calls will throw.
- **Global component registration** — registering `Button` globally removes the need to import it in every component file.

> Add additional PrimeVue components here only if they are used in 3 or more different components; otherwise import them locally.

---

## Exporting

```js
// plugins/primevue.js
import { defineNuxtPlugin } from '#app'
import PrimeVue       from 'primevue/config'
import ToastService   from 'primevue/toastservice'
import Button         from 'primevue/button'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue)
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.component('Button', Button)
})
```

- Plugins in `plugins/` are auto-registered by Nuxt — no import or config entry is needed.
- PrimeVue theme configuration belongs in `nuxt.config.ts` under the `primevue.options.theme` key, not in this file.
- When adding a new globally registered component, follow the same `.component('ComponentName', Component)` pattern.
