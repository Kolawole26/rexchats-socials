---
name: animations
description: Rules for implementing standard UI micro-interactions and transitions.
---

# Animations & Transitions Skill

Subtle animations provide a premium feel to the application. They must be standardized to prevent jarring UX and maintain performance.

## Rules & Best Practices
1. **Use Vue `<Transition>`**: For elements entering or leaving the DOM (like modals, dropdowns, and toasts), ALWAYS use Vue's native `<Transition>` wrapper instead of manual CSS class toggling or JS animations.
2. **Hover States**: Apply hover transitions to interactive elements (buttons, links, cards). Standardize the duration using Tailwind's `transition-all duration-200` or `duration-300`.
3. **Loading Spinners**: For loading states, use integrated standard spinners (e.g., `pi pi-spinner pi-spin`) embedded inside the interacting element (like the `CommonButton`), rather than blocking the entire screen unnecessarily.
4. **Avoid Heavy Blocking Animations**: Keep animations under 300ms. UI should feel snappy. Avoid complex keyframe loops on standard components.

## Implementation Example

```vue
<template>
  <div class="p-6">
    <!-- Standard Hover Transitions on interactive elements -->
    <div class="p-4 rounded-xl border border-general-line-light cursor-pointer hover:border-primary-300 hover:shadow-md transition-all duration-200">
      <h3 class="mb-2">Hover me!</h3>
      <p class="body-small text-general-secondary-light">Notice the smooth 200ms transition.</p>
    </div>

    <!-- Toggling an element -->
    <CommonButton title="Toggle Details" @click="showDetails = !showDetails" class="mt-4" />

    <!-- Standard Vue Transition for DOM insertion/removal -->
    <Transition name="fade">
      <div v-if="showDetails" class="mt-4 p-4 bg-general-surface-light rounded-lg">
        <p class="body-regular">Here are the hidden details.</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showDetails = ref(false)
</script>

<style scoped>
/* Standard Fade Transition CSS to pair with <Transition name="fade"> */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```
