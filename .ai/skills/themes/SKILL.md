---
name: themes
description: Standardization for implementing and toggling dark/light mode themes.
---

# Themes Skill

This project utilizes Tailwind CSS's `class` based dark mode strategy. The theme state is persisted in the user's browser via `localStorage` and synchronizes with the `<html>` root element.

## Rules & Best Practices
1. **Root Element Toggling**: The active theme is controlled strictly by the presence of the `dark` class on the `document.documentElement` (`<html>` tag).
2. **Persistence**: The user's theme preference must be saved in `localStorage` under the exact key: `'color-theme'`.
3. **Initialization (`app.vue`)**: When the application mounts, it must check `localStorage.getItem('color-theme')` first. If no preference is set, it should fallback to the user's system preference using `window.matchMedia('(prefers-color-scheme: dark)')`.
4. **Tailwind Styling**: Use the `dark:` prefix in Tailwind classes to style elements for dark mode (e.g., `bg-white dark:bg-primary-600`). Do not write manual CSS media queries for dark mode.
5. **Local State**: Components that contain a theme toggle (like `TheSidebar.vue`) should maintain a local reactive variable (e.g., `currentTheme`) to update the active state of the toggle buttons instantly.

## Implementation Example

```vue
<!-- Theme Toggle Implementation (e.g., in a Sidebar or Header) -->
<template>
  <div class="flex gap-2">
    <button
      @click="setTheme('light')"
      :class="['p-2 rounded', currentTheme === 'light' ? 'bg-white text-primary-300' : 'text-neutral-500']"
    >
      Light
    </button>
    <button
      @click="setTheme('dark')"
      :class="['p-2 rounded', currentTheme === 'dark' ? 'bg-primary-600 text-white' : 'text-neutral-500']"
    >
      Dark
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentTheme = ref('')

const setTheme = (theme) => {
  currentTheme.value = theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('color-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('color-theme', 'light')
  }
}

// Ensure the local state matches the actual applied theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('color-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }
})
</script>
```
