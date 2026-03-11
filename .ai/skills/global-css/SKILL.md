---
name: global-css
description: Rules for handling custom CSS and avoiding component scoped styles.
---

# Global CSS & Styling Skill

This project relies heavily on utility-first Tailwind CSS. However, when Tailwind utilities fall short (e.g., complex keyframes, deeply nested CSS selectors for third-party libraries, or highly specific pseudo-elements), custom CSS is required. 

To maintain a clean and maintainable codebase, **all custom CSS must reside in `assets/css/global.css`**.

## Rules & Best Practices
1. **Never use `<style>` blocks in Vue components**: Avoid using `<style scoped>` or `<style>` tags directly inside `.vue` files. This prevents style fragmentation and makes it easier to track application-wide theme changes.
2. **Utilize `global.css`**: If a design requires custom CSS that Tailwind cannot handle, add those styles directly into `assets/css/global.css`.
3. **Use Tailwind `@apply`**: When writing custom classes inside `global.css`, use Tailwind's `@apply` directive whenever possible to inherit existing utility values (like colors, spacing, and typography) instead of hardcoding raw CSS values.
4. **Third-Party Overrides**: When overriding styles for external libraries (like PrimeVue components), utilize `global.css` to target their specific classes (e.g., `.p-dropdown`).

## Implementation Example

```vue
<!-- components/MyComponent.vue -->
<template>
  <div class="custom-layered-shadow">
    <p>This component uses a custom class defined globally.</p>
  </div>
</template>

<script setup>
// Component logic here
</script>

<!-- INCORRECT: Do not add style blocks here -->
<!-- <style scoped>
.custom-layered-shadow {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> -->
```

```css
/* assets/css/global.css */

/* Correct usage: Define custom reusable classes globally */
@layer utilities {
  .custom-layered-shadow {
    /* Utilizing Tailwind's apply for colors where possible */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 2px 4px 0 rgba(255, 255, 255, 0.06);
  }
}

/* Correct usage: Scoping third party overwrites */
.p-dropdown {
  @apply bg-neutral-10 border-neutral-100 rounded-lg;
}
```
