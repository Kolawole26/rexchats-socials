# Components / base / FormLoading.vue Guide

**Purpose:** Full-screen loading overlay displayed during form submissions or any blocking async operation. Prevents user interaction while a request is in-flight.

---

## Structure

- Lives at `components/base/FormLoading.vue`.
- Template-only component — no `<script>` block, no props, no emits.
- Renders a fixed full-viewport overlay with a semi-transparent dark background and a centred PrimeVue `<ProgressSpinner>`.

```vue
<template>
  <div class="fixed left-0 top-0 h-full w-full z-50 flex justify-center items-center bg-[#000000a6]">
    <ProgressSpinner />
  </div>
</template>
```

---

## Responsibilities

- **Block interaction** — `fixed` positioning and `z-50` ensure the overlay covers all content and interactive elements.
- **Visual feedback** — `<ProgressSpinner>` (PrimeVue) gives users an animated loading indicator.
- **Zero configuration** — the component is intentionally prop-free; visibility is controlled entirely by the parent using `v-if`.

---

## Exporting

Auto-imported by Nuxt — no explicit import needed.

Usage in any page or component:

```vue
<template>
  <div>
    <BaseFormLoading v-if="isLoading" />
    <!-- rest of the form -->
  </div>
</template>

<script setup>
const isLoading = ref(false)

async function submit() {
  isLoading.value = true
  try {
    await sendRequest({ ... })
  } finally {
    isLoading.value = false
  }
}
</script>
```

- Always wrap the `isLoading = true` / `isLoading = false` toggle in a `try/finally` block so the overlay is never left on-screen after an error.
- Do not use this overlay for background/non-blocking data fetches — reserve it only for operations where the user must wait before continuing.
- `<PageLoading>` (sibling component) is the equivalent for full-page initial-load states; use `<FormLoading>` only for in-page async actions.
